"use client";

import { useDebouncedCallback } from "@mantine/hooks";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

interface CrudPageConfig<T> {
	initialData: {
		data: T[];
		count: number;
		page: number;
		limit: number;
		totalPages: number;
	};
	fetchData: (params: {
		search: string;
		page: number;
		limit: number;
	}) => Promise<{
		data: T[];
		count: number;
		page: number;
		limit: number;
		totalPages: number;
	}>;
	deleteItem: (id: string) => Promise<{ success: boolean }>;
	formRoute: string;
	errorMessage: string;
}

export function useCrudPage<T extends { id: string }>({
	initialData,
	fetchData,
	deleteItem,
	formRoute,
	errorMessage,
}: CrudPageConfig<T>) {
	const [search, setSearch] = useState("");
	const [debouncedSearch, setDebouncedSearch] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [data, setData] = useState(initialData);
	const [isPending, startTransition] = useTransition();
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	// Debounce para a busca
	const debouncedSetSearch = useDebouncedCallback((value: string) => {
		setDebouncedSearch(value);
		setCurrentPage(1); // Reset para primeira página ao buscar
	}, 300);

	// Efeito para buscar dados quando debouncedSearch ou página mudam
	useEffect(() => {
		startTransition(async () => {
			try {
				const response = await fetchData({
					search: debouncedSearch,
					page: currentPage,
					limit: 10,
				});
				setData(response);
				setError(null);
			} catch {
				setError(errorMessage);
			}
		});
	}, [debouncedSearch, currentPage, fetchData, errorMessage]);

	// Handler para adicionar novo item
	const handleAdd = () => {
		router.push(formRoute);
	};

	// Handler para editar item
	const handleEdit = (item: T) => {
		router.push(`${formRoute}?id=${item.id}`);
	};
	// Handler para deletar item
	const handleDelete = async (id: string) => {
		try {
			const result = await deleteItem(id);
			if (!result.success) {
				setError("Erro ao excluir item. Tente novamente.");
				return;
			} // Recarregar dados após exclusão
			const response = await fetchData({
				search: debouncedSearch,
				page: currentPage,
				limit: 10,
			});
			setData(response);
		} catch {
			setError("Erro ao excluir item. Tente novamente.");
		}
	};

	// Handler para mudança de página
	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};
	// Handler para mudança de busca
	const handleSearchChange = (searchTerm: string) => {
		setSearch(searchTerm); // Atualiza imediatamente o valor visual
		debouncedSetSearch(searchTerm); // Aplica o debounce para a busca real
	};

	return {
		// Estados
		search,
		currentPage,
		data,
		isPending,
		error,

		// Handlers
		handleAdd,
		handleEdit,
		handleDelete,
		handlePageChange,
		handleSearchChange,
	};
}
