"use client";

import { useSyncExternalStore } from "react";

interface WindowSize {
	width: number;
	height: number;
}

/**
 * Hook para monitorar o tamanho da janela usando useSyncExternalStore.
 * Útil para layouts responsivos e componentes que dependem do tamanho da tela.
 *
 * @returns WindowSize com width e height atuais
 */
export function useWindowSize(): WindowSize {
	return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

function getSnapshot(): WindowSize {
	return {
		width: window.innerWidth,
		height: window.innerHeight,
	};
}

function getServerSnapshot(): WindowSize {
	// No servidor, retorna tamanhos padrão
	return {
		width: 1024,
		height: 768,
	};
}

function subscribe(callback: () => void): () => void {
	window.addEventListener("resize", callback);

	return () => {
		window.removeEventListener("resize", callback);
	};
}
