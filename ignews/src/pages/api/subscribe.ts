import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { fauna } from "../../services/fauna";
import { stripe } from "../../services/stripe";
import { query as q } from "faunadb";

type User = {
    ref: {
        id: string
    },

    data: {
        stripe_costumer_id: string
    }
}
export default async function checkoutSession(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const session = await getSession({ req })

        const emailUser = session?.user?.email?.toString() as string

        const user = await fauna.query<User>(
            q.Get(
                q.Match(
                    q.Index("user_by_email"),
                    q.Casefold(emailUser)
                )
            )
        )

     
        let costumerId = user.data.stripe_costumer_id;
        if(!costumerId){
            
            const stripeCustomer = await stripe.customers.create({
                email: emailUser
            })
            await fauna.query(
                q.Update(
                    q.Ref(q.Collection("users"), user.ref.id),
                    {
                        data: {
                            stripe_costumer_id: stripeCustomer.id,
                        }
                    }
                )
            )

            costumerId = stripeCustomer.id
        }
    
        const stripeCheckoutSession = await stripe.checkout.sessions.create({
            customer: costumerId,
            payment_method_types: ['card'],
            billing_address_collection: 'required',
            line_items: [
                { price: "price_1KEJDULCVBYitd5G7WfeXaoP", quantity: 1 }
            ],

            mode: "subscription",
            allow_promotion_codes: true,
            success_url: process.env.STRIPE_SUCCESS_URL as string,
            cancel_url: process.env.STRIPE_CANCEL_URL as string,
        })

        return res.status(200).json({ sessionId: stripeCheckoutSession.id })
    } else {
        res.setHeader("Allow", "POST")
        res.status(405).end("Method not allowed")
    }
}


