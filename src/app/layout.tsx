import type { Metadata } from "next";
import "..styles/globals.css";

const defaultUrl = process.env.VERCEL_URL
	? `https://${process.env.VERCEL_URL}`
	: "http://localhost:3000";

export const metadata: Metadata = {
	metadataBase: new URL(defaultUrl),
	title: "Todolist PI",
	description:
		"Projeto desenvolvido para o curso de Sistemas para Internet da UNCISAL.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="pt-BR">
			<body>{children}</body>
		</html>
	);
}
