import { getBaseUrl } from "@/utils";
import type { Metadata } from "next";
import "..styles/globals.css";

export const metadata: Metadata = {
	metadataBase: new URL(getBaseUrl()),
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
