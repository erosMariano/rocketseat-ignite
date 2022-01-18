import { Client } from "faunadb"
const key: string = (<string>process.env.FAUNADB_KEY) || ""

export const fauna = new Client({
    secret: key,
})