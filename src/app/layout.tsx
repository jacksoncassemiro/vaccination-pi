import type { Metadata } from "next";

export const metadata: Metadata = {
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
