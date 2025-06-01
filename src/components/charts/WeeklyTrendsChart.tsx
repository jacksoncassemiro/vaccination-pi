"use client";

import { LineChart } from "@mantine/charts";
import { Paper, Text, Title } from "@mantine/core";

interface WeeklyTrendsChartProps {
	data: Array<{
		semana: string;
		vacinações: number;
	}>;
	loading?: boolean;
}

export function WeeklyTrendsChart({ data, loading }: WeeklyTrendsChartProps) {
	if (loading) {
		return (
			<Paper p="md" withBorder>
				<Title order={4} mb="md">
					Tendências Semanais (12 semanas)
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
					Tendências Semanais (12 semanas)
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
				Tendências Semanais (12 semanas)
			</Title>{" "}
			<LineChart
				h={300}
				data={data}
				dataKey="semana"
				series={[
					{
						name: "vacinações",
						color: "teal.6",
					},
				]}
				curveType="monotone"
				connectNulls={false}
				withLegend
				withDots
				legendProps={{ verticalAlign: "bottom", height: 50 }}
				gridAxis="xy"
				tickLine="xy"
			/>
		</Paper>
	);
}
