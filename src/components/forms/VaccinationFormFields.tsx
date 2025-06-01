"use client";

import {
	getUserPatients,
	getUserVaccines,
} from "@/app/(authenticated)/vaccinations/actions";
import { type VaccinationFormData } from "@/schemas/vaccinationSchema";
import { Grid, Stack, TextInput, Textarea } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { type UseFormReturnType } from "@mantine/form";
import { useEffect, useState } from "react";
import { SearchableSelect } from "..";

interface VaccinationFormFieldsProps {
	form: UseFormReturnType<VaccinationFormData>;
	disabled?: boolean;
}

export function VaccinationFormFields({
	form,
	disabled,
}: VaccinationFormFieldsProps) {
	const [initialPatients, setInitialPatients] = useState<
		Array<{ value: string; label: string }>
	>([]);
	const [initialVaccines, setInitialVaccines] = useState<
		Array<{ value: string; label: string }>
	>([]);
	const [loading, setLoading] = useState(true);

	// Carregar dados iniciais
	useEffect(() => {
		const fetchInitialData = async () => {
			try {
				const [patientsData, vaccinesData] = await Promise.all([
					getUserPatients("", 10),
					getUserVaccines("", 10),
				]);

				const patientOptions = patientsData.map((patient) => ({
					value: patient.id,
					label: `${patient.full_name} - CPF: ${patient.cpf}`,
				}));

				const vaccineOptions = vaccinesData.map((vaccine) => ({
					value: vaccine.id,
					label: `${vaccine.type} - ${vaccine.manufacturer}`,
				}));

				setInitialPatients(patientOptions);
				setInitialVaccines(vaccineOptions);
			} catch (error) {
				console.error("Erro ao carregar dados iniciais:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchInitialData();
	}, []);

	// Função para buscar pacientes
	const searchPatients = async (searchTerm: string) => {
		const patients = await getUserPatients(searchTerm, 10);
		return patients.map((patient) => ({
			value: patient.id,
			label: `${patient.full_name} - CPF: ${patient.cpf}`,
		}));
	};

	// Função para buscar vacinas
	const searchVaccines = async (searchTerm: string) => {
		const vaccines = await getUserVaccines(searchTerm, 10);
		return vaccines.map((vaccine) => ({
			value: vaccine.id,
			label: `${vaccine.type} - ${vaccine.manufacturer}`,
		}));
	};

	return (
		<Stack gap="md">
			<Grid>
				<Grid.Col span={{ base: 12, sm: 6 }}>
					<SearchableSelect
						label="Paciente"
						placeholder="Busque e selecione o paciente..."
						disabled={disabled || loading}
						onSearch={searchPatients}
						initialData={initialPatients}
						noResultsMessage="Nenhum paciente encontrado..."
						{...form.getInputProps("patient_id")}
					/>
				</Grid.Col>
				<Grid.Col span={{ base: 12, sm: 6 }}>
					<SearchableSelect
						label="Vacina"
						placeholder="Busque e selecione a vacina..."
						disabled={disabled || loading}
						onSearch={searchVaccines}
						initialData={initialVaccines}
						noResultsMessage="Nenhuma vacina encontrada..."
						{...form.getInputProps("vaccine_id")}
					/>
				</Grid.Col>
			</Grid>

			<Grid>
				<Grid.Col span={{ base: 12, sm: 6 }}>
					<DatePickerInput
						label="Data da Dose"
						placeholder="Selecione a data da vacinação"
						valueFormat="DD/MM/YYYY"
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
