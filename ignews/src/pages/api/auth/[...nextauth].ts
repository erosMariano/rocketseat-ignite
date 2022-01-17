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
            await fauna.query(
                q.Create(
                    q.Collection("users"),
                    { data: user.email }
                )
            )
            return true
        }
    }
})
