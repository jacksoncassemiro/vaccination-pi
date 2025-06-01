"use client";

import { useSyncExternalStore } from "react";

/**
 * Store para gerenciar o estado de busca com debounce.
 * Utiliza useSyncExternalStore para sincronizar o estado de busca.
 */
class SearchStore {
	private searchTerm = "";
	private debouncedSearchTerm = "";
	private listeners = new Set<() => void>();
	private debounceTimeout: NodeJS.Timeout | null = null;

	subscribe = (callback: () => void): (() => void) => {
		this.listeners.add(callback);

		return () => {
			this.listeners.delete(callback);
		};
	};

	getSnapshot = () => {
		return {
			searchTerm: this.searchTerm,
			debouncedSearchTerm: this.debouncedSearchTerm,
		};
	};

	getServerSnapshot = () => {
		return {
			searchTerm: "",
			debouncedSearchTerm: "",
		};
	};

	setSearchTerm = (term: string): void => {
		this.searchTerm = term;
		this.notifyListeners();

		// Debounce para o termo de busca
		if (this.debounceTimeout) {
			clearTimeout(this.debounceTimeout);
		}

		this.debounceTimeout = setTimeout(() => {
			this.debouncedSearchTerm = term;
			this.notifyListeners();
		}, 300);
	};

	private notifyListeners = (): void => {
		this.listeners.forEach((callback) => callback());
	};
}

const searchStore = new SearchStore();

/**
 * Hook para gerenciar estado de busca com debounce usando useSyncExternalStore.
 *
 * @returns Objeto com searchTerm, debouncedSearchTerm e setSearchTerm
 */
export function useSearchWithDebounce() {
	const { searchTerm, debouncedSearchTerm } = useSyncExternalStore(
		searchStore.subscribe,
		searchStore.getSnapshot,
		searchStore.getServerSnapshot
	);

	return {
		searchTerm,
		debouncedSearchTerm,
		setSearchTerm: searchStore.setSearchTerm,
	};
}
