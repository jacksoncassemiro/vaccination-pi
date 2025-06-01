"use client";

import {
	DashboardStats,
	LoadingScreen,
	PatientsByAgeChart,
	VaccinationByTypeChart,
	VaccinationTrendChart,
} from "@/components";
import { useAuth } from "@/contexts";
import { Alert, SimpleGrid, Stack, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import { FaInfoCircle } from "react-icons/fa";
import {
	getDashboardStats,
	getPatientsByAgeGroup,
	getVaccinationsByMonth,
	getVaccinationsByVaccineType,
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
}

export default function HomePage() {
	const { user, loading: authLoading } = useAuth();
	const [dashboardData, setDashboardData] = useState<DashboardData | null>(
		null
	);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function fetchDashboardData() {
			try {
				setLoading(true);
				setError(null);

				const [stats, vaccinationsByType, vaccinationsByMonth, patientsByAge] =
					await Promise.all([
						getDashboardStats(),
						getVaccinationsByVaccineType(),
						getVaccinationsByMonth(),
						getPatientsByAgeGroup(),
					]);

				setDashboardData({
					stats,
					vaccinationsByType,
					vaccinationsByMonth,
					patientsByAge,
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
	}, [user, authLoading]);

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
			)}

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

			{/* Gráficos */}
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

			<PatientsByAgeChart
				data={dashboardData?.patientsByAge || []}
				loading={loading}
			/>
		</Stack>
	);
}
