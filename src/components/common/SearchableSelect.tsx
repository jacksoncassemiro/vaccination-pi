"use client";

import { Loader, Select, type SelectProps } from "@mantine/core";
import { useDebouncedCallback } from "@mantine/hooks";
import { useEffect, useState } from "react";

interface SearchableSelectProps
	extends Omit<SelectProps, "onSearchChange" | "onChange"> {
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
	const [data, setData] = useState(initialData);
	const [loading, setLoading] = useState(false);

	// Carrega os dados iniciais quando o componente monta ou quando initialData muda
	useEffect(() => {
		setData(initialData);
	}, [initialData]);

	// Garantir que o valor selecionado esteja sempre nos dados
	useEffect(() => {
		if (value && !data.find((item) => item.value === value)) {
			// Se o valor existe mas não está nos dados atuais, adicionar os dados iniciais
			if (initialData.find((item) => item.value === value)) {
				setData((prev) => {
					const exists = prev.find((item) => item.value === value);
					if (!exists) {
						return [
							...initialData,
							...prev.filter(
								(item) =>
									!initialData.find((initial) => initial.value === item.value)
							),
						];
					}
					return prev;
				});
			}
		}
	}, [value, data, initialData]);

	// Função de busca com debounce
	const debouncedSearch = useDebouncedCallback(async (term: string) => {
		if (!term.trim()) {
			// Se não há termo de busca, retorna aos dados iniciais
			setData(initialData);
			setLoading(false);
			return;
		}

		setLoading(true);
		try {
			const results = await onSearch(term);
			// Garantir que o valor atual sempre esteja presente nos resultados
			if (value) {
				const currentItem =
					data.find((item) => item.value === value) ||
					initialData.find((item) => item.value === value);
				if (currentItem && !results.find((item) => item.value === value)) {
					results.unshift(currentItem);
				}
			}
			setData(results);
		} catch (error) {
			console.error("Erro ao buscar dados:", error);
			setData(initialData); // Em caso de erro, volta aos dados iniciais
		} finally {
			setLoading(false);
		}
	}, debounceMs);

	// Handler para mudanças no valor de busca - SEM estado controlado
	const handleSearchChange = (searchValue: string) => {
		debouncedSearch(searchValue);
	};

	// Handler para mudanças no valor selecionado
	const handleChange = (newValue: string | null) => {
		if (onChange) {
			onChange(newValue);
		}
	};

	// Handler quando o dropdown é aberto
	const handleDropdownOpen = () => {
		// Se não há dados ou apenas dados iniciais, garante que os dados iniciais estejam carregados
		if (data.length === 0 || data === initialData) {
			setData(initialData);
		}
	};

	return (
		<Select
			{...selectProps}
			data={data}
			value={value}
			onChange={handleChange}
			searchable
			onSearchChange={handleSearchChange}
			onDropdownOpen={handleDropdownOpen}
			nothingFoundMessage={loading ? "Pesquisando..." : noResultsMessage}
			rightSection={loading ? <Loader size="xs" /> : undefined}
			clearable
			allowDeselect
		/>
	);
}
