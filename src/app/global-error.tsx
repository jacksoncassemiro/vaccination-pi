"use client";

import { useEffect } from "react";
import { FaExclamationTriangle, FaRedo } from "react-icons/fa";

export default function GlobalError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		// Log do erro crítico para serviço de monitoramento
		console.error("Global Application Error:", error);
	}, [error]);

	return (
		<html lang="pt-BR">
			<body>
				<div
					style={{
						minHeight: "100vh",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						padding: "1rem",
						fontFamily: "system-ui, sans-serif",
					}}
				>
					<div
						style={{
							textAlign: "center",
							maxWidth: "500px",
						}}
					>
						<div
							style={{
								color: "#e03131",
								marginBottom: "1rem",
								display: "flex",
								justifyContent: "center",
							}}
						>
							<FaExclamationTriangle size={64} />
						</div>
						<h1
							style={{
								fontSize: "2rem",
								marginBottom: "1rem",
								color: "#333",
							}}
						>
							Erro Crítico
						</h1>
						<p
							style={{
								color: "#666",
								marginBottom: "2rem",
								lineHeight: 1.6,
							}}
						>
							Ocorreu um erro crítico na aplicação. Nossa equipe foi notificada
							automaticamente. Tente recarregar a página.
						</p>
						{process.env.NODE_ENV === "development" ||
							(process.env.NEXT_PUBLIC_VERCEL_ENV === "development" && (
								<p
									style={{
										color: "#e03131",
										fontSize: "0.875rem",
										fontFamily: "monospace",
										backgroundColor: "#f8f9fa",
										padding: "1rem",
										borderRadius: "4px",
										marginBottom: "2rem",
										textAlign: "left",
									}}
								>
									{error.message}
								</p>
							))}
						<button
							onClick={() => reset()}
							style={{
								backgroundColor: "#228be6",
								color: "white",
								border: "none",
								padding: "0.75rem 1.5rem",
								borderRadius: "4px",
								fontSize: "1rem",
								cursor: "pointer",
								display: "inline-flex",
								alignItems: "center",
								gap: "0.5rem",
							}}
						>
							<FaRedo size={16} />
							Tentar novamente
						</button>
					</div>
				</div>
			</body>
		</html>
	);
}
