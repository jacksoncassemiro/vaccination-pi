"use client";

import { PieChart } from "@mantine/charts";
import { Paper, Text, Title } from "@mantine/core";

interface LocationDistributionChartProps {
	data: Array<{
		name: string;
		value: number;
		color: string;
	}>;
	loading?: boolean;
}

export function LocationDistributionChart({
	data,
	loading,
}: LocationDistributionChartProps) {
	if (loading) {
		return (
			<Paper p="md" withBorder>
				<Title order={4} mb="md">
					Distribuição por Local
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
					Distribuição por Local
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
				Distribuição por Local
			</Title>
			<PieChart
				h={300}
				data={data}
				withLabelsLine
				labelsPosition="outside"
				labelsType="percent"
				withTooltip
				tooltipDataSource="segment"
				mx="auto"
				size={180}
				strokeWidth={1}
			/>
		</Paper>
	);
}
