import type { NextPage, GetStaticProps } from "next";
import Head from "next/head";
import Image from "next/image";
import SubscribeButton from "../components/SubscribeButton";
import { stripe } from "../services/stripe";
import styles from "./home.module.scss";

interface HomeProps {
	product: {
		priceId: string;
		amount: number;
	};
}
export default function Home({ product }: HomeProps) {
	const myPrice = new Intl.NumberFormat("en-US",{
		style: "currency",
		currency: "USD"
	}).format(product.amount/100)
	return (
		<>
			<Head>
				<title>Home | ig.news</title>
			</Head>

			<main className={styles.contentContainer}>
				<section className={styles.hero}>
					<span>🤙 Hey, welcome</span>
					<h1>
						News about the <span>React</span> world.
					</h1>
					<p>
						Get access to all the publications <br />
						<span>for {myPrice} month</span>
					</p>
					<SubscribeButton  priceId={product.priceId}/>
				</section>

				<Image
					src="/images/avatar.svg"
					alt="girl coding"
					width="336"
					height="521"
				/>
			</main>
		</>
	);
}

export const getStaticProps: GetStaticProps = async () => {
	const price = await stripe.prices.retrieve(
		"price_1KEJDULCVBYitd5G7WfeXaoP",
	);

	const product = {
		priceId: price.id,
		amount: price.unit_amount,
	};
	return {
		props: {
			product,
		},
		revalidate: 60 * 60 * 24 //24 horas 60 seg, 60 min, 24 => 24horas
	};
};
