"use client";

import {
	DashboardFilters,
	DashboardStats,
	HealthIndicators,
	HourlyDistributionChart,
	LoadingScreen,
	LocationDistributionChart,
	PatientsByAgeChart,
	VaccinationByTypeChart,
	VaccinationTrendChart,
	WeeklyTrendsChart,
} from "@/components";
import type { DashboardFilterValues } from "@/components/charts/DashboardFilters";
import { useAuth } from "@/contexts";
import { Alert, SimpleGrid, Stack, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import { FaInfoCircle } from "react-icons/fa";
import {
	getDashboardDataWithFilters,
	getDashboardStats,
	getHealthIndicators,
	getPatientsByAgeGroup,
	getVaccinationsByHour,
	getVaccinationsByLocation,
	getVaccinationsByMonth,
	getVaccinationsByVaccineType,
	getWeeklyTrends,
} from "./vaccinations/actions";

interface DashboardData {
	stats: {
		totalPatients: number;
		totalVaccines: number;
		totalVaccinations: number;
	};
	vaccinationsByType: Array<{ name: string; value: number; color: string }>;
	vaccinationsByMonth: Array<{ month: string; vacinações: number }>;
	patientsByAge: Array<{ group: string; pacientes: number }>;
	healthIndicators: {
		vaccinations7Days: number;
		vaccinations30Days: number;
		activePatients: number;
		inactivePatients: number;
		vaccinationRate: number;
		trends: {
			weeklyGrowth: number;
			monthlyTotal: number;
		};
	} | null;
	weeklyTrends: Array<{ semana: string; vacinações: number }>;
	hourlyDistribution: Array<{ hour: string; vacinações: number }>;
	locationDistribution: Array<{ name: string; value: number; color: string }>;
}

export default function HomePage() {
	const { user, loading: authLoading } = useAuth();
	const [dashboardData, setDashboardData] = useState<DashboardData | null>(
		null
	);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [filters, setFilters] = useState<DashboardFilterValues>({
		period: "month",
	});

	useEffect(() => {
		async function fetchDashboardData() {
			try {
				setLoading(true);
				setError(null);
				const [
					stats,
					vaccinationsByType,
					vaccinationsByMonth,
					patientsByAge,
					healthIndicators,
					weeklyTrends,
					hourlyDistribution,
					locationDistribution,
				] = await Promise.all([
					getDashboardStats(),
					getVaccinationsByVaccineType(),
					getVaccinationsByMonth(),
					getPatientsByAgeGroup(),
					getHealthIndicators(),
					getWeeklyTrends(),
					getVaccinationsByHour(filters.period),
					getVaccinationsByLocation(filters.period),
				]);
				setDashboardData({
					stats,
					vaccinationsByType,
					vaccinationsByMonth,
					patientsByAge,
					healthIndicators,
					weeklyTrends,
					hourlyDistribution,
					locationDistribution,
				});
			} catch (err) {
				console.error("Erro ao carregar dados do dashboard:", err);
				setError(
					"Erro ao carregar dados do dashboard. Tente novamente mais tarde."
				);
			} finally {
				setLoading(false);
			}
		}

		if (user && !authLoading) {
			fetchDashboardData();
		}
	}, [user, authLoading, filters.period]);
	const handleFiltersChange = async (newFilters: DashboardFilterValues) => {
		setFilters(newFilters);

		// Se há filtros específicos (além de período), usar getDashboardDataWithFilters
		const hasSpecificFilters =
			newFilters.vaccineType || newFilters.ageGroup || newFilters.patientId;

		try {
			setLoading(true);
			if (hasSpecificFilters) {
				// Usar filtros avançados - recarregar dados específicos com filtros
				await getDashboardDataWithFilters(
					newFilters.period,
					newFilters.vaccineType,
					newFilters.ageGroup,
					newFilters.patientId,
					newFilters.customStartDate?.toISOString(),
					newFilters.customEndDate?.toISOString()
				);

				// Atualizar apenas os dados que podem ser filtrados
				setDashboardData((prev) =>
					prev
						? {
								...prev,
								// Manter stats gerais, mas atualizar dados filtráveis
								// Note: A função getDashboardDataWithFilters deve retornar dados processados
								hourlyDistribution: [], // Será implementado na próxima versão
								locationDistribution: [], // Será implementado na próxima versão
						  }
						: null
				);
			} else {
				// Apenas período mudou - recarregar dados dependentes de período
				const [hourlyDistribution, locationDistribution] = await Promise.all([
					getVaccinationsByHour(newFilters.period),
					getVaccinationsByLocation(newFilters.period),
				]);

				setDashboardData((prev) =>
					prev
						? {
								...prev,
								hourlyDistribution,
								locationDistribution,
						  }
						: null
				);
			}
		} catch (err) {
			console.error("Erro ao aplicar filtros:", err);
		} finally {
			setLoading(false);
		}
	};

	if (authLoading) {
		return <LoadingScreen />;
	}

	if (error) {
		return (
			<Stack gap="lg" py="xl">
				<Alert
					icon={<FaInfoCircle size={16} />}
					title="Erro ao carregar dashboard"
					color="red"
				>
					{error}
				</Alert>
			</Stack>
		);
	}
	return (
		<Stack gap="lg" py="xl">
			<Title order={2}>Dashboard</Title>
			{user && (
				<Alert
					icon={<FaInfoCircle size={16} />}
					title="Bem-vindo!"
					color="blue"
					variant="light"
				>
					Olá, {user.user_metadata?.full_name || user.email}! Aqui está um
					resumo dos seus dados de vacinação.
				</Alert>
			)}{" "}
			{/* Filtros Avançados */}
			<DashboardFilters
				filters={filters}
				onFiltersChange={handleFiltersChange}
				loading={loading}
			/>
			{/* Indicadores de Saúde */}
			<HealthIndicators
				indicators={dashboardData?.healthIndicators || null}
				loading={loading}
			/>
			{/* Cards de Estatísticas */}
			<SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
				<DashboardStats
					stats={
						dashboardData?.stats || {
							totalPatients: 0,
							totalVaccines: 0,
							totalVaccinations: 0,
						}
					}
					loading={loading}
				/>
			</SimpleGrid>
			{/* Gráficos Principais */}
			<SimpleGrid cols={{ base: 1, lg: 2 }} spacing="md">
				<VaccinationTrendChart
					data={dashboardData?.vaccinationsByMonth || []}
					loading={loading}
				/>
				<VaccinationByTypeChart
					data={dashboardData?.vaccinationsByType || []}
					loading={loading}
				/>
			</SimpleGrid>
			{/* Gráficos de Distribuição */}
			<SimpleGrid cols={{ base: 1, lg: 2 }} spacing="md">
				<WeeklyTrendsChart
					data={dashboardData?.weeklyTrends || []}
					loading={loading}
				/>
				<LocationDistributionChart
					data={dashboardData?.locationDistribution || []}
					loading={loading}
				/>
			</SimpleGrid>
			{/* Gráficos de Análise Temporal */}
			<SimpleGrid cols={{ base: 1, lg: 2 }} spacing="md">
				<HourlyDistributionChart
					data={dashboardData?.hourlyDistribution || []}
					loading={loading}
				/>
				<PatientsByAgeChart
					data={dashboardData?.patientsByAge || []}
					loading={loading}
				/>
			</SimpleGrid>
		</Stack>
	);
}
