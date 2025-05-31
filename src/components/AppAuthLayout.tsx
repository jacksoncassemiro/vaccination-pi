"use client";

import { useAuth } from "@/contexts";
import { Burger, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { ReactNode } from "react";
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
	const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();

	return (
		<BaseAppShell
			withNavbar={!!user}
			header={
				<AppHeader
					leftContent={
						user && (
							<Burger
								opened={mobileOpened}
								onClick={toggleMobile}
								hiddenFrom="sm"
								size="sm"
							/>
						)
					}
					rightContent={
						user && (
							<Group gap={8}>
								<Group gap={8} visibleFrom="sm">
									<AuthDesktopNav />
								</Group>
								{showUserMenu && <UserMenu />}
							</Group>
						)
					}
				/>
			}
			navbar={
				user ? (
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
				) : undefined
			}
		>
			{children}
		</BaseAppShell>
	);
}
