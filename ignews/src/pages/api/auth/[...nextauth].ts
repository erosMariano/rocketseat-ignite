import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"

import { query as q } from "faunadb";
import { fauna } from "../../../services/fauna";

export default NextAuth({
    // Configure one or more authentication providers
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
            authorization: { params: { scope: "read:user" } }
        }),
    ],

    
    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {

            try {
                const usuarioGithub = user.email as string

                await fauna.query(
                    q.If(
                        q.Not(
                            q.Exists(
                                q.Match(
                                    q.Index("user_by_email"),
                                    q.Casefold(usuarioGithub)
                                )
                            )
                        ),
                        q.Create(
                            q.Collection("users"),
                            { data: { email: usuarioGithub } }
                        ),
                        q.Get(
                            q.Match(
                                q.Index("user_by_email"),
                                q.Casefold(usuarioGithub)
                            )
                        )
                    ),




                )

                return true
            } catch (error) {
                console.log(error)
            }
            return false

        },
    }
})
