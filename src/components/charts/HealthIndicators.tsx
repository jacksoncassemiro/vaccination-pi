"use client";

import {
	Group,
	Paper,
	SimpleGrid,
	Stack,
	Text,
	ThemeIcon,
} from "@mantine/core";
import {
	FaArrowDown,
	FaArrowUp,
	FaCalendarCheck,
	FaChartLine,
	FaClock,
	FaPercent,
	FaUsers,
} from "react-icons/fa";

interface AdvancedStatsCardProps {
	title: string;
	value: string | number;
	subtitle?: string;
	icon: React.ReactNode;
	color: string;
	trend?: {
		value: number;
		isPositive: boolean;
		label: string;
	};
	loading?: boolean;
}

function AdvancedStatsCard({
	title,
	value,
	subtitle,
	icon,
	color,
	trend,
	loading,
}: AdvancedStatsCardProps) {
	const formatValue = (val: string | number) => {
		if (typeof val === "number") {
			if (val % 1 !== 0) {
				return val.toFixed(1);
			}
			return val.toLocaleString("pt-BR");
		}
		return val;
	};

	return (
		<Paper p="md" withBorder>
			<Group justify="space-between" mb="xs">
				<ThemeIcon variant="light" size="lg" color={color}>
					{icon}
				</ThemeIcon>
				{trend && (
					<Group gap={4}>
						<ThemeIcon
							size="sm"
							variant="light"
							color={trend.isPositive ? "green" : "red"}
						>
							{trend.isPositive ? (
								<FaArrowUp size={12} />
							) : (
								<FaArrowDown size={12} />
							)}
						</ThemeIcon>
						<Text size="xs" c={trend.isPositive ? "green" : "red"} fw={500}>
							{Math.abs(trend.value).toFixed(1)}%
						</Text>
					</Group>
				)}
			</Group>

			<Stack gap={2}>
				<Text size="xl" fw={700}>
					{loading ? "..." : formatValue(value)}
				</Text>
				<Text c="dimmed" size="sm">
					{title}
				</Text>
				{subtitle && (
					<Text c="dimmed" size="xs">
						{subtitle}
					</Text>
				)}
				{trend && (
					<Text c="dimmed" size="xs">
						{trend.label}
					</Text>
				)}
			</Stack>
		</Paper>
	);
}

interface HealthIndicatorsProps {
	indicators: {
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
	loading?: boolean;
}

export function HealthIndicators({
	indicators,
	loading,
}: HealthIndicatorsProps) {
	if (!indicators && !loading) {
		return (
			<Paper p="md" withBorder>
				<Text c="dimmed" ta="center">
					Nenhum dado disponível
				</Text>
			</Paper>
		);
	}

	const stats = indicators || {
		vaccinations7Days: 0,
		vaccinations30Days: 0,
		activePatients: 0,
		inactivePatients: 0,
		vaccinationRate: 0,
		trends: {
			weeklyGrowth: 0,
			monthlyTotal: 0,
		},
	};

	return (
		<Stack gap="md">
			<Text fw={500} size="lg">
				Indicadores de Saúde
			</Text>

			<SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
				<AdvancedStatsCard
					title="Vacinações (7 dias)"
					value={stats.vaccinations7Days}
					icon={<FaCalendarCheck size={20} />}
					color="blue"
					trend={{
						value: stats.trends.weeklyGrowth,
						isPositive: stats.trends.weeklyGrowth >= 0,
						label: "vs. semana anterior",
					}}
					loading={loading}
				/>{" "}
				<AdvancedStatsCard
					title="Vacinações (30 dias)"
					value={stats.vaccinations30Days}
					icon={<FaChartLine size={20} />}
					color="green"
					subtitle="Total no último mês"
					loading={loading}
				/>
				<AdvancedStatsCard
					title="Pacientes Ativos"
					value={stats.activePatients}
					subtitle="Vacinados nos últimos 6 meses"
					icon={<FaUsers size={20} />}
					color="violet"
					loading={loading}
				/>
				<AdvancedStatsCard
					title="Taxa de Vacinação"
					value={`${stats.vaccinationRate.toFixed(1)}%`}
					subtitle="Pacientes ativos / Total"
					icon={<FaPercent size={20} />}
					color="orange"
					loading={loading}
				/>
			</SimpleGrid>

			<SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
				<AdvancedStatsCard
					title="Pacientes Inativos"
					value={stats.inactivePatients}
					subtitle="Sem vacinação recente"
					icon={<FaClock size={20} />}
					color="red"
					loading={loading}
				/>

				<AdvancedStatsCard
					title="Média Diária (30d)"
					value={(stats.vaccinations30Days / 30).toFixed(1)}
					subtitle="Vacinações por dia"
					icon={<FaCalendarCheck size={20} />}
					color="teal"
					loading={loading}
				/>
			</SimpleGrid>
		</Stack>
	);
}
