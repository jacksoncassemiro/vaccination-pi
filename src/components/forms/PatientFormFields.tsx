"use client";

import type { PatientFormData } from "@/schemas/patientSchema";
import { Grid, Input, Select, TextInput } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import type { UseFormReturnType } from "@mantine/form";
import { memo } from "react";
import { IMaskInput } from "react-imask";

// Funções helper para formatação dos valores exibidos
const formatCpfForDisplay = (value: string): string => {
	const cleanValue = value.replace(/\D/g, "");
	return cleanValue
		.replace(/(\d{3})(\d)/, "$1.$2")
		.replace(/(\d{3})(\d)/, "$1.$2")
		.replace(/(\d{3})(\d{1,2})/, "$1-$2")
		.replace(/(-\d{2})\d+?$/, "$1");
};

const formatPhoneForDisplay = (value: string): string => {
	const cleanValue = value.replace(/\D/g, "");
	if (cleanValue.length <= 10) {
		return cleanValue
			.replace(/(\d{2})(\d)/, "($1) $2")
			.replace(/(\d{4})(\d)/, "$1-$2")
			.replace(/(-\d{4})\d+?$/, "$1");
	} else {
		return cleanValue
			.replace(/(\d{2})(\d)/, "($1) $2")
			.replace(/(\d{5})(\d)/, "$1-$2")
			.replace(/(-\d{4})\d+?$/, "$1");
	}
};

const formatCepForDisplay = (value: string): string => {
	const cleanValue = value.replace(/\D/g, "");
	return cleanValue.replace(/(\d{5})(\d)/, "$1-$2");
};

interface PatientFormFieldsProps {
	form: UseFormReturnType<PatientFormData>;
	disabled?: boolean;
	onCepChange?: (value: string) => void;
}

const brazilianStates = [
	{ value: "AC", label: "Acre" },
	{ value: "AL", label: "Alagoas" },
	{ value: "AP", label: "Amapá" },
	{ value: "AM", label: "Amazonas" },
	{ value: "BA", label: "Bahia" },
	{ value: "CE", label: "Ceará" },
	{ value: "DF", label: "Distrito Federal" },
	{ value: "ES", label: "Espírito Santo" },
	{ value: "GO", label: "Goiás" },
	{ value: "MA", label: "Maranhão" },
	{ value: "MT", label: "Mato Grosso" },
	{ value: "MS", label: "Mato Grosso do Sul" },
	{ value: "MG", label: "Minas Gerais" },
	{ value: "PA", label: "Pará" },
	{ value: "PB", label: "Paraíba" },
	{ value: "PR", label: "Paraná" },
	{ value: "PE", label: "Pernambuco" },
	{ value: "PI", label: "Piauí" },
	{ value: "RJ", label: "Rio de Janeiro" },
	{ value: "RN", label: "Rio Grande do Norte" },
	{ value: "RS", label: "Rio Grande do Sul" },
	{ value: "RO", label: "Rondônia" },
	{ value: "RR", label: "Roraima" },
	{ value: "SC", label: "Santa Catarina" },
	{ value: "SP", label: "São Paulo" },
	{ value: "SE", label: "Sergipe" },
	{ value: "TO", label: "Tocantins" },
];

export const PatientFormFields = memo(function PatientFormFields({
	form,
	disabled,
	onCepChange,
}: PatientFormFieldsProps) {
	return (
		<>
			<TextInput
				label="Nome Completo"
				placeholder="Digite o nome completo"
				disabled={disabled}
				{...form.getInputProps("full_name")}
			/>
			<Grid gutter="md">
				<Grid.Col span={{ base: 12, sm: 6 }}>
					<Input.Wrapper label="CPF" error={form.errors.cpf}>
						<Input
							error={form.errors.cpf}
							component={IMaskInput}
							mask="000.000.000-00"
							placeholder="Digite o CPF"
							disabled={disabled}
							value={formatCpfForDisplay(form.values.cpf)}
							onAccept={(value) => {
								// Remove a máscara e salva apenas os dígitos
								const cleanValue = value.replace(/\D/g, "");
								form.setFieldValue("cpf", cleanValue);
							}}
						/>
					</Input.Wrapper>
				</Grid.Col>
				<Grid.Col span={{ base: 12, sm: 6 }}>
					<DatePickerInput
						label="Data de Nascimento"
						placeholder="Selecione a data de nascimento"
						valueFormat="DD/MM/YYYY"
						disabled={disabled}
						{...form.getInputProps("birth_date")}
					/>
				</Grid.Col>
			</Grid>
			<Input.Wrapper label="Telefone" error={form.errors.phone}>
				<Input
					error={form.errors.phone}
					component={IMaskInput}
					mask={[{ mask: "(00) 0000-0000" }, { mask: "(00) 00000-0000" }]}
					placeholder="Digite o telefone"
					disabled={disabled}
					value={formatPhoneForDisplay(form.values.phone)}
					onAccept={(value) => {
						// Remove a máscara e salva apenas os dígitos
						const cleanValue = value.replace(/\D/g, "");
						form.setFieldValue("phone", cleanValue);
					}}
				/>
			</Input.Wrapper>
			<Grid gutter="md">
				<Grid.Col span={{ base: 12, sm: 4 }}>
					<Input.Wrapper label="CEP" error={form.errors.cep}>
						<Input
							error={form.errors.cep}
							component={IMaskInput}
							mask="00000-000"
							placeholder="Digite o CEP"
							disabled={disabled}
							value={formatCepForDisplay(form.values.cep)}
							onAccept={(value) => {
								// Remove a máscara e salva apenas os dígitos
								const cleanValue = value.replace(/\D/g, "");
								form.setFieldValue("cep", cleanValue);
								onCepChange?.(cleanValue);
							}}
						/>
					</Input.Wrapper>
				</Grid.Col>
				<Grid.Col span={{ base: 12, sm: 8 }}>
					<TextInput
						label="Rua"
						placeholder="Digite a rua"
						disabled={disabled}
						{...form.getInputProps("street")}
					/>
				</Grid.Col>
			</Grid>
			<Grid gutter="md">
				<Grid.Col span={{ base: 12, sm: 4 }}>
					<TextInput
						label="Número"
						placeholder="Digite o número"
						disabled={disabled}
						{...form.getInputProps("number")}
					/>
				</Grid.Col>
				<Grid.Col span={{ base: 12, sm: 8 }}>
					<TextInput
						label="Complemento"
						placeholder="Digite o complemento (opcional)"
						disabled={disabled}
						{...form.getInputProps("complement")}
					/>
				</Grid.Col>
			</Grid>
			<Grid gutter="md">
				<Grid.Col span={{ base: 12, sm: 4 }}>
					<TextInput
						label="Bairro"
						placeholder="Digite o bairro"
						disabled={disabled}
						{...form.getInputProps("neighborhood")}
					/>
				</Grid.Col>
				<Grid.Col span={{ base: 12, sm: 4 }}>
					<TextInput
						label="Cidade"
						placeholder="Digite a cidade"
						disabled={disabled}
						{...form.getInputProps("city")}
					/>
				</Grid.Col>
				<Grid.Col span={{ base: 12, sm: 2 }}>
					<Select
						label="Estado"
						placeholder="UF"
						data={brazilianStates}
						searchable
						disabled={disabled}
						{...form.getInputProps("state")}
					/>
				</Grid.Col>
			</Grid>
		</>
	);
});
