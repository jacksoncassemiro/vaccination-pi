"use client";

import { type VaccineFormData } from "@/schemas/vaccineSchema";
import { Grid, Stack, TextInput } from "@mantine/core";
import { type UseFormReturnType } from "@mantine/form";

interface VaccineFormFieldsProps {
	form: UseFormReturnType<VaccineFormData>;
	disabled?: boolean;
}

export function VaccineFormFields({ form, disabled }: VaccineFormFieldsProps) {
	return (
		<Stack gap="md">
			{/* Informações da Vacina */}{" "}
			<Grid>
				<Grid.Col span={{ base: 12, sm: 6 }}>
					<TextInput
						label="Tipo da Vacina"
						placeholder="Ex: COVID-19, Hepatite B, Influenza..."
						disabled={disabled}
						{...form.getInputProps("type")}
					/>
				</Grid.Col>
				<Grid.Col span={{ base: 12, sm: 6 }}>
					<TextInput
						label="Fabricante"
						placeholder="Ex: Pfizer, AstraZeneca, Butantan..."
						disabled={disabled}
						{...form.getInputProps("manufacturer")}
					/>
				</Grid.Col>
			</Grid>
		</Stack>
	);
}
