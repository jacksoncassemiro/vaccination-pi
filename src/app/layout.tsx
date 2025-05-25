import { getBaseUrl } from "@/utils";
import type { Metadata } from "next";
import { ColorSchemeScript, mantineHtmlProps } from "@mantine/core";
import "../styles/globals.css";
import { MantineAllProviders } from "@/contexts";

export const metadata: Metadata = {
	metadataBase: new URL(getBaseUrl()),
	title: "VacinaPI",
	description:
		"Sistema de gestão de vacinação - Projeto desenvolvido para o curso de Sistemas para Internet da UNCISAL.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="pt-BR" {...mantineHtmlProps}>
			<head>
				<ColorSchemeScript defaultColorScheme="dark" />
			</head>
			<body>
				<MantineAllProviders>{children}</MantineAllProviders>
			</body>
		</html>
	);
}
