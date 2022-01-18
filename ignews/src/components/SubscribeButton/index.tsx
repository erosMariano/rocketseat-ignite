import { signIn, useSession } from "next-auth/react";
import React from "react";
import { api } from "../../services/api";
import { getStripeJs } from "../../services/stripe-js";
import styles from "./styles.module.scss";

interface SubscribeButtonProps {
	priceId: string;
}
function SubscribeButton({ priceId }: SubscribeButtonProps) {
	async function handleSubscribe() {
		if (!session) {
			signIn("github");
			return;
		}

		try {
			const response = await api.post("/subscribe");
			const { sessionId } = response.data;
			const stripe = await getStripeJs();

			await stripe?.redirectToCheckout({ sessionId });
		} catch (error) {
			alert("error " + error);
		}
		//Criação da checkout session
	}

	const session = useSession();
	return (
		<button
			type="button"
			className={styles.subscribeButton}
			onClick={handleSubscribe}
		>
			Subscribe Now
		</button>
	);
}

export default SubscribeButton;
