import type { PatientFormData } from "@/schemas/patientSchema";
import { Grid, Input, Select, TextInput } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import type { UseFormReturnType } from "@mantine/form";
import { IMaskInput } from "react-imask";

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

export function PatientFormFields({
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
							component={IMaskInput}
							mask="000.000.000-00"
							placeholder="Digite o CPF"
							disabled={disabled}
							{...form.getInputProps("cpf")}
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
					component={IMaskInput}
					mask={[{ mask: "(00) 0000-0000" }, { mask: "(00) 00000-0000" }]}
					placeholder="Digite o telefone"
					disabled={disabled}
					{...form.getInputProps("phone")}
				/>
			</Input.Wrapper>
			<Grid gutter="md">
				<Grid.Col span={{ base: 12, sm: 4 }}>
					<Input.Wrapper label="CEP" error={form.errors.cep}>
						<Input
							component={IMaskInput}
							mask="00000-000"
							placeholder="Digite o CEP"
							disabled={disabled}
							onAccept={(value) => onCepChange?.(String(value))}
							{...form.getInputProps("cep")}
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
}
