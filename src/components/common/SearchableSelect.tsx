"use client";

import { Loader, Select, type SelectProps } from "@mantine/core";
import { useDebouncedCallback } from "@mantine/hooks";
import { useEffect, useState } from "react";

interface SearchableSelectProps
	extends Omit<SelectProps, "onSearchChange" | "searchValue" | "onChange"> {
	onSearch: (
		searchTerm: string
	) => Promise<Array<{ value: string; label: string }>>;
	initialData?: Array<{ value: string; label: string }>;
	noResultsMessage?: string;
	debounceMs?: number;
	onChange?: (value: string | null) => void;
}

export function SearchableSelect({
	onSearch,
	initialData = [],
	noResultsMessage = "Nenhum resultado encontrado...",
	debounceMs = 300,
	value,
	onChange,
	...selectProps
}: SearchableSelectProps) {
	const [options, setOptions] = useState(initialData);
	const [searchTerm, setSearchTerm] = useState("");
	const [searching, setSearching] = useState(false); // Efeito para inicializar as opções
	useEffect(() => {
		setOptions(initialData);
	}, [initialData]);

	// Efeito separado para garantir que o valor selecionado esteja visível
	useEffect(() => {
		if (value) {
			setOptions((currentOptions) => {
				// Verificar se o valor já existe nas opções atuais
				const valueExists = currentOptions.some(
					(option) => option.value === value
				);

				if (!valueExists) {
					// Procurar nos dados iniciais primeiro
					const itemInInitial = initialData.find(
						(option) => option.value === value
					);

					if (itemInInitial) {
						// Se encontrou nos dados iniciais, retornar os dados iniciais
						return initialData;
					} else {
						// Se não encontrou, criar um item temporário
						const selectedItem = { value, label: value };
						return [selectedItem, ...initialData];
					}
				}

				return currentOptions;
			});
		}
	}, [value, initialData]);

	// Callback de busca com debounce
	const debouncedSearch = useDebouncedCallback(async (term: string) => {
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
	}, debounceMs); // Handler para mudanças de busca
	const handleSearchChange = (term: string) => {
		setSearchTerm(term);

		// Se o campo foi limpo (onBlur), não fazer nada
		// As opções já estão corretas pelo useEffect que gerencia o valor selecionado
		if (!term.trim()) {
			return;
		}

		// Fazer a busca apenas se há termo de busca
		debouncedSearch(term);
	}; // Handler personalizado para mudanças de valor
	const handleValueChange = (newValue: string | null) => {
		// Limpar o termo de busca sempre que o valor muda
		setSearchTerm("");

		// O useEffect já cuida de garantir que o valor esteja nas opções
		if (onChange) {
			onChange(newValue);
		}
	};

	return (
		<Select
			{...selectProps}
			value={value}
			onChange={handleValueChange}
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
