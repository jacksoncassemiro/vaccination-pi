"use client";

import {
	getUserPatients,
	getUserVaccines,
} from "@/app/(authenticated)/vaccinations/actions";
import { type VaccinationFormData } from "@/schemas/vaccinationSchema";
import { Grid, Select, Stack, TextInput, Textarea } from "@mantine/core";
import { type UseFormReturnType } from "@mantine/form";
import { useEffect, useState } from "react";

interface VaccinationFormFieldsProps {
	form: UseFormReturnType<VaccinationFormData>;
	disabled?: boolean;
}

interface Patient {
	id: string;
	full_name: string;
	cpf: string;
}

interface Vaccine {
	id: string;
	type: string;
	manufacturer: string;
}

export function VaccinationFormFields({
	form,
	disabled,
}: VaccinationFormFieldsProps) {
	const [patients, setPatients] = useState<Patient[]>([]);
	const [vaccines, setVaccines] = useState<Vaccine[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [patientsData, vaccinesData] = await Promise.all([
					getUserPatients(),
					getUserVaccines(),
				]);
				setPatients(patientsData);
				setVaccines(vaccinesData);
			} catch (error) {
				console.error("Erro ao carregar dados:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	const patientOptions = patients.map((patient) => ({
		value: patient.id,
		label: `${patient.full_name} - CPF: ${patient.cpf}`,
	}));

	const vaccineOptions = vaccines.map((vaccine) => ({
		value: vaccine.id,
		label: `${vaccine.type} - ${vaccine.manufacturer}`,
	}));

	return (
		<Stack gap="md">
			<Grid>
				<Grid.Col span={{ base: 12, sm: 6 }}>
					<Select
						label="Paciente"
						placeholder="Selecione o paciente..."
						data={patientOptions}
						disabled={disabled || loading}
						searchable
						{...form.getInputProps("patient_id")}
					/>
				</Grid.Col>
				<Grid.Col span={{ base: 12, sm: 6 }}>
					<Select
						label="Vacina"
						placeholder="Selecione a vacina..."
						data={vaccineOptions}
						disabled={disabled || loading}
						searchable
						{...form.getInputProps("vaccine_id")}
					/>
				</Grid.Col>
			</Grid>

			<Grid>
				<Grid.Col span={{ base: 12, sm: 6 }}>
					<TextInput
						label="Data da Dose"
						type="date"
						disabled={disabled}
						{...form.getInputProps("dose_date")}
					/>
				</Grid.Col>
				<Grid.Col span={{ base: 12, sm: 6 }}>
					<TextInput
						label="Lote da Vacina"
						placeholder="Ex: LOT123456"
						disabled={disabled}
						{...form.getInputProps("batch_number")}
					/>
				</Grid.Col>
			</Grid>

			<Grid>
				<Grid.Col span={12}>
					<TextInput
						label="Local de Aplicação"
						placeholder="Ex: UBS Centro, Hospital Municipal..."
						disabled={disabled}
						{...form.getInputProps("location")}
					/>
				</Grid.Col>
			</Grid>

			<Grid>
				<Grid.Col span={12}>
					<Textarea
						label="Observações"
						placeholder="Observações adicionais sobre a vacinação..."
						disabled={disabled}
						rows={3}
						{...form.getInputProps("notes")}
					/>
				</Grid.Col>
			</Grid>
		</Stack>
	);
}
