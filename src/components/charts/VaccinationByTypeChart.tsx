"use client";

import { PieChart } from "@mantine/charts";
import { Paper, Text, Title } from "@mantine/core";

interface VaccinationByTypeChartProps {
	data: Array<{
		name: string;
		value: number;
		color: string;
	}>;
	loading?: boolean;
}

export function VaccinationByTypeChart({
	data,
	loading,
}: VaccinationByTypeChartProps) {
	if (loading) {
		return (
			<Paper p="md" withBorder>
				<Title order={4} mb="md">
					Distribuição por Tipo de Vacina
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
					Distribuição por Tipo de Vacina
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
				Distribuição por Tipo de Vacina
			</Title>
			<PieChart
				h={300}
				data={data}
				withLabelsLine
				labelsPosition="outside"
				labelsType="value"
				withTooltip
				tooltipDataSource="segment"
				mx="auto"
				size={180}
			/>
		</Paper>
	);
}
