import { signIn, signOut, useSession } from "next-auth/react";
import React from "react";
import { FaGithub } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import styles from "./styles.module.scss";


function SignInButton() {
	const session = useSession();

	let logado = false;
	if (session.status == "authenticated") {
		logado = true;
	}

	return logado ? (
		<button
			onClick={() => signOut()}
			type="button"
			className={styles.signInButton}
		>
			<FaGithub color="#04d361" />
			{session.data?.user?.name}
			<FiX color="#737380" className={styles.closeIcon} />
		</button>
	) : (
		<button
			onClick={() => signIn("github")}
			type="button"
			className={styles.signInButton}
		>
			<FaGithub color="#eba417" />
			Sign in with Github
		</button>
	);
}

export default SignInButton;
