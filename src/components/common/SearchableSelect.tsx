"use client";

import { Loader, Select, type SelectProps } from "@mantine/core";
import { useDebouncedCallback } from "@mantine/hooks";
import { useRef, useState } from "react";

interface SearchableSelectProps
	extends Omit<SelectProps, "onSearchChange" | "searchValue"> {
	onSearch: (
		searchTerm: string
	) => Promise<Array<{ value: string; label: string }>>;
	initialData?: Array<{ value: string; label: string }>;
	noResultsMessage?: string;
	debounceMs?: number;
}

export function SearchableSelect({
	onSearch,
	initialData = [],
	noResultsMessage = "Nenhum resultado encontrado...",
	debounceMs = 300,
	...selectProps
}: SearchableSelectProps) {
	const [options, setOptions] = useState(initialData);
	const [searchTerm, setSearchTerm] = useState("");
	const [searching, setSearching] = useState(false);

	// Ref para armazenar valor anterior do termo de busca
	const prevSearchTerm = useRef("");

	// Callback de busca com debounce
	const debouncedSearch = useDebouncedCallback(async (term: string) => {
		// Só busca se há um termo de pesquisa não vazio
		if (!term.trim()) {
			return;
		}

		setSearching(true);
		try {
			const results = await onSearch(term);
			setOptions(results);
		} catch (error) {
			console.error("Erro ao buscar dados:", error);
		} finally {
			setSearching(false);
		}
	}, debounceMs);

	// Handler para mudanças de busca
	const handleSearchChange = (term: string) => {
		setSearchTerm(term);

		// Se o campo foi limpo, restaura os dados iniciais apenas se o valor anterior não estava vazio
		if (!term.trim()) {
			if (prevSearchTerm.current.trim()) {
				setOptions(initialData);
			}
			prevSearchTerm.current = term;
			return;
		}

		prevSearchTerm.current = term;
		debouncedSearch(term);
	};

	return (
		<Select
			{...selectProps}
			data={options}
			searchable
			searchValue={searchTerm}
			onSearchChange={handleSearchChange}
			nothingFoundMessage={searching ? "Pesquisando..." : noResultsMessage}
			rightSection={searching ? <Loader size="xs" /> : undefined}
			clearable
			allowDeselect
		/>
	);
}
