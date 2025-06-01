"use client";

import { getPatients } from "@/app/(authenticated)/patients/actions";
import {
	getUserVaccines,
	type PeriodFilter,
} from "@/app/(authenticated)/vaccinations/actions";
import { Button, Group, Paper, Select, Stack, Text } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useState } from "react";
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
	loading,
}: DashboardFiltersProps) {
	// Estado local para os filtros (não aplicados ainda)
	const [localFilters, setLocalFilters] =
		useState<DashboardFilterValues>(filters);

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
	// Verificar se há mudanças nos filtros
	const hasChanges = JSON.stringify(localFilters) !== JSON.stringify(filters); // Função para buscar tipos de vacina
	const searchVaccines = async (searchTerm: string) => {
		try {
			const vaccines = await getUserVaccines(searchTerm);
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
			const response = await getPatients({ search: searchTerm, limit: 20 });
			return response.data.map((patient) => ({
				value: patient.id,
				label: `${patient.full_name} - ${patient.cpf}`,
			}));
		} catch (error) {
			console.error("Erro ao buscar pacientes:", error);
			return [];
		}
	};

	return (
		<Paper p="md" withBorder>
			<Stack gap="md">
				<Group justify="space-between" align="center">
					<Text fw={500} size="lg">
						<FaFilter style={{ marginRight: "8px" }} />
						Filtros do Dashboard
					</Text>
				</Group>{" "}
				<Group grow>
					<Select
						label="Período"
						data={PERIOD_OPTIONS}
						value={localFilters.period}
						onChange={(value) =>
							handleFilterChange("period", value as PeriodFilter)
						}
						disabled={loading}
					/>

					<Select
						label="Faixa Etária"
						data={AGE_GROUP_OPTIONS}
						value={localFilters.ageGroup || "all"}
						onChange={(value) => handleFilterChange("ageGroup", value)}
						disabled={loading}
					/>
				</Group>
				<Group grow>
					<SearchableSelect
						label="Tipo de Vacina"
						placeholder="Buscar tipo de vacina..."
						value={localFilters.vaccineType}
						onChange={(value) => handleFilterChange("vaccineType", value)}
						onSearch={searchVaccines}
						disabled={loading}
						initialData={[]}
						clearable
					/>

					<SearchableSelect
						label="Paciente"
						placeholder="Buscar paciente..."
						value={localFilters.patientId}
						onChange={(value) => handleFilterChange("patientId", value)}
						onSearch={searchPatients}
						disabled={loading}
						initialData={[]}
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
							disabled={loading}
							maxDate={new Date()}
						/>
						<DatePickerInput
							label="Data final"
							placeholder="Selecione a data final"
							valueFormat="DD/MM/YYYY"
							value={localFilters.customEndDate}
							onChange={(date) => handleFilterChange("customEndDate", date)}
							disabled={loading}
							maxDate={new Date()}
							minDate={localFilters.customStartDate}
						/>
					</Group>
				)}
				<Group justify="space-between">
					<Button
						variant="subtle"
						onClick={handleReset}
						disabled={loading}
						size="sm"
					>
						Limpar filtros
					</Button>

					<Button
						onClick={handleApplyFilters}
						disabled={loading || !hasChanges}
						size="sm"
						variant="filled"
					>
						{loading ? "Aplicando..." : "Aplicar Filtros"}
					</Button>
				</Group>
			</Stack>
		</Paper>
	);
}

export default DashboardFilters;
