"use client";

import { useSyncExternalStore } from "react";

/**
 * Hook para monitorar o status de conexão online/offline do navegador.
 * Utiliza useSyncExternalStore para sincronizar com a API navigator.onLine.
 *
 * @returns boolean - true se online, false se offline
 */
export function useOnlineStatus(): boolean {
	return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

function getSnapshot(): boolean {
	return navigator.onLine;
}

function getServerSnapshot(): boolean {
	// No servidor, sempre consideramos como online
	return true;
}

function subscribe(callback: () => void): () => void {
	window.addEventListener("online", callback);
	window.addEventListener("offline", callback);

	return () => {
		window.removeEventListener("online", callback);
		window.removeEventListener("offline", callback);
	};
}
