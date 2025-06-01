"use client";

import { getPatients } from "@/app/(authenticated)/patients/actions";
import {
	getUserVaccines,
	type PeriodFilter,
} from "@/app/(authenticated)/vaccinations/actions";
import { Button, Group, Paper, Select, Stack, Text } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useEffect, useState } from "react";
import { FaFilter } from "react-icons/fa";
import { SearchableSelect } from "../common/SearchableSelect";

interface DashboardFiltersProps {
	filters: DashboardFilterValues;
	onFiltersChange: (filters: DashboardFilterValues) => void;
	loading?: boolean;
}

export interface DashboardFilterValues {
	period: PeriodFilter;
	vaccineType?: string;
	ageGroup?: string;
	patientId?: string;
	customStartDate?: Date;
	customEndDate?: Date;
}

const PERIOD_OPTIONS = [
	{ value: "day", label: "Hoje" },
	{ value: "week", label: "Última semana" },
	{ value: "month", label: "Último mês" },
	{ value: "semester", label: "Último semestre" },
	{ value: "year", label: "Último ano" },
	{ value: "custom", label: "Período customizado" },
];

const AGE_GROUP_OPTIONS = [
	{ value: "all", label: "Todas as idades" },
	{ value: "0-17", label: "0-17 anos" },
	{ value: "18-29", label: "18-29 anos" },
	{ value: "30-39", label: "30-39 anos" },
	{ value: "40-49", label: "40-49 anos" },
	{ value: "50-59", label: "50-59 anos" },
	{ value: "60+", label: "60+ anos" },
];

export function DashboardFilters({
	filters,
	onFiltersChange,
	loading: filtersLoading,
}: DashboardFiltersProps) {
	const [localFilters, setLocalFilters] =
		useState<DashboardFilterValues>(filters);
	const [initialVaccines, setInitialVaccines] = useState<
		Array<{ value: string; label: string }>
	>([]);
	const [initialPatients, setInitialPatients] = useState<
		Array<{ value: string; label: string }>
	>([]);
	const [dataLoading, setDataLoading] = useState(true);

	// Carregar dados iniciais
	useEffect(() => {
		const fetchInitialData = async () => {
			try {
				const [vaccinesData, patientsData] = await Promise.all([
					getUserVaccines("", 10),
					getPatients({ search: "", limit: 10 }),
				]);

				const vaccineOptions = vaccinesData.map((vaccine) => ({
					value: vaccine.id,
					label: `${vaccine.type} - ${vaccine.manufacturer}`,
				}));

				const patientOptions = patientsData.data.map((patient) => ({
					value: patient.id,
					label: `${patient.full_name} - CPF: ${patient.cpf}`,
				}));

				setInitialVaccines(vaccineOptions);
				setInitialPatients(patientOptions);
			} catch (error) {
				console.error("Erro ao carregar dados iniciais:", error);
			} finally {
				setDataLoading(false);
			}
		};

		fetchInitialData();
	}, []);

	const handleFilterChange = (
		key: keyof DashboardFilterValues,
		value: string | Date | null
	) => {
		setLocalFilters((prev) => ({ ...prev, [key]: value }));
	};

	const handleApplyFilters = () => {
		onFiltersChange(localFilters);
	};

	const handleReset = () => {
		const resetFilters: DashboardFilterValues = {
			period: "month",
			vaccineType: undefined,
			ageGroup: undefined,
			patientId: undefined,
			customStartDate: undefined,
			customEndDate: undefined,
		};
		setLocalFilters(resetFilters);
		onFiltersChange(resetFilters);
	};

	// Função para buscar tipos de vacina
	const searchVaccines = async (searchTerm: string) => {
		try {
			const vaccines = await getUserVaccines(searchTerm, 10);
			return vaccines.map((vaccine) => ({
				value: vaccine.id,
				label: `${vaccine.type} - ${vaccine.manufacturer}`,
			}));
		} catch (error) {
			console.error("Erro ao buscar vacinas:", error);
			return [];
		}
	};

	// Função para buscar pacientes
	const searchPatients = async (searchTerm: string) => {
		try {
			const response = await getPatients({ search: searchTerm, limit: 10 });
			return response.data.map((patient) => ({
				value: patient.id,
				label: `${patient.full_name} - CPF: ${patient.cpf}`,
			}));
		} catch (error) {
			console.error("Erro ao buscar pacientes:", error);
			return [];
		}
	};

	// Verificar se há mudanças nos filtros
	const hasChanges = JSON.stringify(localFilters) !== JSON.stringify(filters);

	// Determinar o estado de loading (dados iniciais ou filtros)
	const isLoading = filtersLoading || dataLoading;

	return (
		<Paper p="md" withBorder>
			<Stack gap="md">
				<Group justify="flex-start" gap="xs" align="center">
					<FaFilter />
					<Text fw={500} size="lg">
						Filtros
					</Text>
				</Group>

				<Group grow>
					<Select
						label="Período"
						data={PERIOD_OPTIONS}
						value={localFilters.period}
						onChange={(value) =>
							handleFilterChange("period", value as PeriodFilter)
						}
						disabled={isLoading}
					/>

					<Select
						label="Faixa Etária"
						data={AGE_GROUP_OPTIONS}
						value={localFilters.ageGroup || "all"}
						onChange={(value) => handleFilterChange("ageGroup", value)}
						disabled={isLoading}
					/>
				</Group>

				<Group grow>
					<SearchableSelect
						label="Tipo de Vacina"
						placeholder="Buscar tipo de vacina..."
						value={localFilters.vaccineType}
						onChange={(value) => handleFilterChange("vaccineType", value)}
						onSearch={searchVaccines}
						disabled={isLoading}
						initialData={initialVaccines}
						clearable
					/>
					<SearchableSelect
						label="Paciente"
						placeholder="Buscar paciente..."
						value={localFilters.patientId}
						onChange={(value) => handleFilterChange("patientId", value)}
						onSearch={searchPatients}
						disabled={isLoading}
						initialData={initialPatients}
						clearable
					/>
				</Group>

				{localFilters.period === "custom" && (
					<Group grow>
						<DatePickerInput
							label="Data inicial"
							placeholder="Selecione a data inicial"
							valueFormat="DD/MM/YYYY"
							value={localFilters.customStartDate}
							onChange={(date) => handleFilterChange("customStartDate", date)}
							disabled={isLoading}
							maxDate={new Date()}
						/>
						<DatePickerInput
							label="Data final"
							placeholder="Selecione a data final"
							valueFormat="DD/MM/YYYY"
							value={localFilters.customEndDate}
							onChange={(date) => handleFilterChange("customEndDate", date)}
							disabled={isLoading}
							maxDate={new Date()}
							minDate={localFilters.customStartDate}
						/>
					</Group>
				)}

				<Group justify="space-between">
					<Button
						variant="subtle"
						onClick={handleReset}
						disabled={isLoading}
						size="sm"
					>
						Limpar filtros
					</Button>

					<Button
						onClick={handleApplyFilters}
						disabled={isLoading || !hasChanges}
						size="sm"
						variant="filled"
					>
						{filtersLoading ? "Aplicando..." : "Aplicar Filtros"}
					</Button>
				</Group>
			</Stack>
		</Paper>
	);
}

export default DashboardFilters;
