import React from "react";
import Image from "next/image";
import styles from "./styles.module.scss";
import SignInButton from "../SignInButton";

function Header() {
	return (
		<header className={styles.headerContainer}>
			<div className={styles.headerContent}>
				<Image
					width={110}
					height={31}
					src="/images/logo.svg"
					alt="ig.news"
				/>

				<nav>
					<a className={styles.active}>Home</a>
					<a>Posts</a>
				</nav>
				<SignInButton />
			</div>
		</header>
	);
}

export default Header;
