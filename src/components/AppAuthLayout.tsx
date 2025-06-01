"use client";

import { useAuth } from "@/contexts";
import { Burger, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { AppHeader } from "./layouts/AppHeader";
import { AuthDesktopNav, AuthNavbar } from "./layouts/AuthNavbar";
import { BaseAppShell } from "./layouts/BaseAppShell";
import { UserMenu } from "./UserMenu";

interface AppAuthLayoutProps {
	children: ReactNode;
	showUserMenu?: boolean;
}

/**
 * Layout para usuários autenticados.
 * Fornece navegação completa, menu do usuário e navbar mobile.
 */
export function AppAuthLayout({
	children,
	showUserMenu = true,
}: AppAuthLayoutProps) {
	const { user } = useAuth();
	const [mobileOpened, { toggle: toggleMobile, close: closeMobile }] =
		useDisclosure();
	const pathname = usePathname();

	// Fecha o menu mobile automaticamente quando a rota muda
	useEffect(() => {
		closeMobile();
	}, [pathname, closeMobile]);

	return (
		<BaseAppShell
			withNavbar={!!user}
			mobileOpened={mobileOpened}
			header={
				<AppHeader
					leftContent={
						<Burger
							opened={mobileOpened}
							onClick={toggleMobile}
							hiddenFrom="sm"
							size="sm"
						/>
					}
					rightContent={
						<Group gap={8}>
							<Group gap={8} visibleFrom="sm">
								<AuthDesktopNav />
							</Group>
							{showUserMenu && <UserMenu />}
						</Group>
					}
				/>
			}
			navbar={
				<div
					style={{
						padding: "16px",
						height: "100%",
						display: "flex",
						flexDirection: "column",
					}}
				>
					<AuthNavbar />
				</div>
			}
		>
			{children}
		</BaseAppShell>
	);
}
