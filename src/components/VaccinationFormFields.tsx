"use client";

import {
	getUserPatients,
	getUserVaccines,
} from "@/app/(authenticated)/vaccinations/actions";
import { type VaccinationFormData } from "@/schemas/vaccinationSchema";
import {
	Grid,
	Loader,
	Select,
	Stack,
	TextInput,
	Textarea,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { type UseFormReturnType } from "@mantine/form";
import { useDebouncedCallback } from "@mantine/hooks";
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

	// Estados de busca para cada select
	const [patientSearchTerm, setPatientSearchTerm] = useState("");
	const [vaccineSearchTerm, setVaccineSearchTerm] = useState("");

	// Estados de loading para feedback visual
	const [searchingPatients, setSearchingPatients] = useState(false);
	const [searchingVaccines, setSearchingVaccines] = useState(false);

	// Callbacks de busca com debounce
	const debouncedPatientSearch = useDebouncedCallback(
		async (searchTerm: string) => {
			setSearchingPatients(true);
			try {
				const searchResults = await getUserPatients(searchTerm, 10);
				setPatients(searchResults);
			} catch (error) {
				console.error("Erro ao buscar pacientes:", error);
			} finally {
				setSearchingPatients(false);
			}
		},
		300
	);
	const debouncedVaccineSearch = useDebouncedCallback(
		async (searchTerm: string) => {
			setSearchingVaccines(true);
			try {
				const searchResults = await getUserVaccines(searchTerm, 10);
				setVaccines(searchResults);
			} catch (error) {
				console.error("Erro ao buscar vacinas:", error);
			} finally {
				setSearchingVaccines(false);
			}
		},
		300
	);

	// Carregar dados iniciais (primeiros 10 registros)
	useEffect(() => {
		const fetchInitialData = async () => {
			try {
				const [patientsData, vaccinesData] = await Promise.all([
					getUserPatients("", 10), // Buscar os primeiros 10 pacientes
					getUserVaccines("", 10), // Buscar as primeiras 10 vacinas
				]);
				setPatients(patientsData);
				setVaccines(vaccinesData);
			} catch (error) {
				console.error("Erro ao carregar dados iniciais:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchInitialData();
	}, []);

	// Handlers para mudanças de busca
	const handlePatientSearchChange = (searchTerm: string) => {
		setPatientSearchTerm(searchTerm);
		debouncedPatientSearch(searchTerm);
	};

	const handleVaccineSearchChange = (searchTerm: string) => {
		setVaccineSearchTerm(searchTerm);
		debouncedVaccineSearch(searchTerm);
	};

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
						placeholder="Busque e selecione o paciente..."
						data={patientOptions}
						disabled={disabled || loading}
						searchable
						searchValue={patientSearchTerm}
						onSearchChange={handlePatientSearchChange}
						nothingFoundMessage={
							searchingPatients
								? "Pesquisando pacientes..."
								: "Nenhum paciente encontrado..."
						}
						rightSection={searchingPatients ? <Loader size="xs" /> : undefined}
						clearable
						allowDeselect
						{...form.getInputProps("patient_id")}
					/>
				</Grid.Col>
				<Grid.Col span={{ base: 12, sm: 6 }}>
					<Select
						label="Vacina"
						placeholder="Busque e selecione a vacina..."
						data={vaccineOptions}
						disabled={disabled || loading}
						searchable
						searchValue={vaccineSearchTerm}
						onSearchChange={handleVaccineSearchChange}
						nothingFoundMessage={
							searchingVaccines
								? "Pesquisando vacinas..."
								: "Nenhuma vacina encontrada..."
						}
						rightSection={searchingVaccines ? <Loader size="xs" /> : undefined}
						clearable
						allowDeselect
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
