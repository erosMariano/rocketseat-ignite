import { NextApiRequest, NextApiResponse } from "next";

export default function myUsers(
	request: NextApiRequest,
	response: NextApiResponse
) {
	const users = [
		{
			id: 1,
			nome: "Eros",
		},
		{
			id: 2,
			nome: "Eros",
		},
		{
			id: 3,
			nome: "Eros",
		},
	];
	return response.json(users);
}
