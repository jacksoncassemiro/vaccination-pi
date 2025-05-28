"use client";

import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { Alert, Group, Text } from "@mantine/core";
import { Wifi, WifiOff } from "lucide-react";
import { memo } from "react";

interface ConnectionStatusProps {
	showWhenOnline?: boolean;
}

/**
 * Componente que mostra o status de conexão do usuário.
 * Utiliza useSyncExternalStore para monitorar mudanças de conectividade.
 * Memoizado para evitar re-renderizações desnecessárias.
 */
export const ConnectionStatus = memo(function ConnectionStatus({
	showWhenOnline = false,
}: ConnectionStatusProps) {
	const isOnline = useOnlineStatus();

	// Se está online e não deve mostrar quando online, não renderiza nada
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
});
