"use client";

import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import { AppHeader, BaseAppShell } from ".";

interface AppPublicLayoutProps {
	children: ReactNode;
}

/**
 * Layout para páginas públicas (não autenticadas).
 * Fornece uma interface simples com logo e título, sem navegação.
 */
export function AppPublicLayout({ children }: AppPublicLayoutProps) {
	const router = useRouter();

	const handleTitleClick = () => {
		router.push("/auth");
	};

	return (
		<BaseAppShell header={<AppHeader onTitleClick={handleTitleClick} />}>
			{children}
		</BaseAppShell>
	);
}
