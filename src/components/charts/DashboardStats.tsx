"use client";

import { Group, Paper, Stack, Text, ThemeIcon } from "@mantine/core";
import { FaClipboardList, FaSyringe, FaUser } from "react-icons/fa";

interface StatsCardProps {
	title: string;
	value: number;
	icon: React.ReactNode;
	color: string;
	loading?: boolean;
}

function StatsCard({ title, value, icon, color, loading }: StatsCardProps) {
	return (
		<Paper p="md" withBorder>
			<Group>
				<ThemeIcon variant="light" size="xl" color={color}>
					{icon}
				</ThemeIcon>
				<Stack gap={0}>
					<Text size="xl" fw={700}>
						{loading ? "..." : value.toLocaleString("pt-BR")}
					</Text>
					<Text c="dimmed" size="sm">
						{title}
					</Text>
				</Stack>
			</Group>
		</Paper>
	);
}

interface DashboardStatsProps {
	stats: {
		totalPatients: number;
		totalVaccines: number;
		totalVaccinations: number;
	};
	loading?: boolean;
}

export function DashboardStats({ stats, loading }: DashboardStatsProps) {
	return (
		<>
			<StatsCard
				title="Total de Pacientes"
				value={stats.totalPatients}
				icon={<FaUser size={24} />}
				color="blue"
				loading={loading}
			/>
			<StatsCard
				title="Vacinas Cadastradas"
				value={stats.totalVaccines}
				icon={<FaSyringe size={24} />}
				color="green"
				loading={loading}
			/>
			<StatsCard
				title="Vacinações Realizadas"
				value={stats.totalVaccinations}
				icon={<FaClipboardList size={24} />}
				color="violet"
				loading={loading}
			/>
		</>
	);
}
