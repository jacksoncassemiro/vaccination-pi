"use client";

import { BarChart } from "@mantine/charts";
import { Paper, Text, Title } from "@mantine/core";

interface PatientsByAgeChartProps {
	data: Array<{
		group: string;
		pacientes: number;
	}>;
	loading?: boolean;
}

export function PatientsByAgeChart({ data, loading }: PatientsByAgeChartProps) {
	if (loading) {
		return (
			<Paper p="md" withBorder>
				<Title order={4} mb="md">
					Pacientes por Faixa Etária
				</Title>
				<Text c="dimmed" ta="center" py="xl">
					Carregando dados...
				</Text>
			</Paper>
		);
	}

	if (!data || data.length === 0) {
		return (
			<Paper p="md" withBorder>
				<Title order={4} mb="md">
					Pacientes por Faixa Etária
				</Title>
				<Text c="dimmed" ta="center" py="xl">
					Nenhum dado disponível
				</Text>
			</Paper>
		);
	}

	return (
		<Paper p="md" withBorder>
			<Title order={4} mb="md">
				Pacientes por Faixa Etária
			</Title>
			<BarChart
				h={300}
				data={data}
				dataKey="group"
				series={[{ name: "pacientes", color: "violet.6" }]}
				tickLine="y"
				withLegend
				legendProps={{ verticalAlign: "bottom", height: 50 }}
			/>
		</Paper>
	);
}
