"use client";

import { BarChart } from "@mantine/charts";
import { Paper, Text, Title } from "@mantine/core";

interface HourlyDistributionChartProps {
	data: Array<{
		hour: string;
		vacinações: number;
	}>;
	loading?: boolean;
}

export function HourlyDistributionChart({
	data,
	loading,
}: HourlyDistributionChartProps) {
	if (loading) {
		return (
			<Paper p="md" withBorder>
				<Title order={4} mb="md">
					Distribuição por Horário
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
					Distribuição por Horário
				</Title>
				<Text c="dimmed" ta="center" py="xl">
					Nenhum dado disponível
				</Text>
			</Paper>
		);
	}

	// Filtrar apenas horários com dados para melhor visualização
	const filteredData = data.filter((item) => item.vacinações > 0);

	return (
		<Paper p="md" withBorder>
			<Title order={4} mb="md">
				Distribuição por Horário
			</Title>
			<BarChart
				h={300}
				data={filteredData.length > 0 ? filteredData : data}
				dataKey="hour"
				series={[
					{
						name: "vacinações",
						color: "indigo.6",
					},
				]}
				tickLine="xy"
				gridAxis="y"
				withTooltip
				withLegend
				legendProps={{ verticalAlign: "bottom", height: 50 }}
			/>
		</Paper>
	);
}
