"use client";

import { AreaChart } from "@mantine/charts";
import { Paper, Text, Title } from "@mantine/core";

interface VaccinationTrendChartProps {
	data: Array<{
		month: string;
		vacinações: number;
	}>;
	loading?: boolean;
}

export function VaccinationTrendChart({
	data,
	loading,
}: VaccinationTrendChartProps) {
	if (loading) {
		return (
			<Paper p="md" withBorder>
				<Title order={4} mb="md">
					Tendência de Vacinações (12 meses)
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
					Tendência de Vacinações (12 meses)
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
				Tendência de Vacinações (12 meses)
			</Title>
			<AreaChart
				h={300}
				data={data}
				dataKey="month"
				series={[{ name: "vacinações", color: "blue.6" }]}
				curveType="natural"
				connectNulls={false}
				withLegend
				legendProps={{ verticalAlign: "bottom", height: 50 }}
			/>
		</Paper>
	);
}
