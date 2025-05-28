"use client";

import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { Alert, Group, Text } from "@mantine/core";
import { Wifi, WifiOff } from "lucide-react";

interface ConnectionStatusProps {
	showWhenOnline?: boolean;
}

/**
 * Componente que mostra o status de conexão do usuário.
 * Utiliza useSyncExternalStore para monitorar mudanças de conectividade.
 */
export function ConnectionStatus({
	showWhenOnline = false,
}: ConnectionStatusProps) {
	const isOnline = useOnlineStatus();

	if (isOnline && !showWhenOnline) {
		return null;
	}

	return (
		<Alert
			color={isOnline ? "green" : "red"}
			icon={isOnline ? <Wifi size={16} /> : <WifiOff size={16} />}
			variant="light"
		>
			<Group gap="xs">
				<Text size="sm" fw={500}>
					{isOnline ? "✅ Online" : "❌ Desconectado"}
				</Text>
				<Text size="xs" c="dimmed">
					{isOnline
						? "Conectado à internet"
						: "Sem conexão com a internet. Algumas funcionalidades podem estar limitadas."}
				</Text>
			</Group>
		</Alert>
	);
}
