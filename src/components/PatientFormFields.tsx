import { PatientFormData } from "@/schemas/patientSchema";
import { Grid, Select, TextInput } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { UseFormReturnType } from "@mantine/form";

interface PatientFormFieldsProps {
	form: UseFormReturnType<PatientFormData>;
	disabled?: boolean;
}

export function PatientFormFields({ form, disabled }: PatientFormFieldsProps) {
	return (
		<Grid>
			<Grid.Col span={{ base: 12, md: 6 }}>
				<TextInput
					label="Nome Completo"
					placeholder="Digite o nome completo"
					required
					disabled={disabled}
					{...form.getInputProps("full_name")}
				/>
			</Grid.Col>
			<Grid.Col span={{ base: 12, md: 6 }}>
				<TextInput
					label="CPF"
					placeholder="Digite o CPF"
					required
					disabled={disabled}
					{...form.getInputProps("cpf")}
				/>
			</Grid.Col>
			<Grid.Col span={{ base: 12, md: 6 }}>
				<DatePickerInput
					label="Data de Nascimento"
					placeholder="Selecione a data de nascimento"
					required
					disabled={disabled}
					{...form.getInputProps("birth_date")}
				/>
			</Grid.Col>
			<Grid.Col span={{ base: 12, md: 6 }}>
				<TextInput
					label="Telefone"
					placeholder="(XX) XXXXX-XXXX"
					required
					disabled={disabled}
					{...form.getInputProps("phone")}
				/>
			</Grid.Col>
			<Grid.Col span={{ base: 12, md: 4 }}>
				<TextInput
					label="CEP"
					placeholder="Digite o CEP"
					required
					disabled={disabled}
					{...form.getInputProps("cep")}
				/>
			</Grid.Col>
			<Grid.Col span={{ base: 12, md: 8 }}>
				<TextInput
					label="Rua"
					placeholder="Digite a rua"
					required
					disabled={disabled}
					{...form.getInputProps("street")}
				/>
			</Grid.Col>
			<Grid.Col span={{ base: 12, md: 4 }}>
				<TextInput
					label="Número"
					placeholder="Digite o número"
					required
					disabled={disabled}
					{...form.getInputProps("number")}
				/>
			</Grid.Col>
			<Grid.Col span={{ base: 12, md: 8 }}>
				<TextInput
					label="Complemento"
					placeholder="Digite o complemento (opcional)"
					disabled={disabled}
					{...form.getInputProps("complement")}
				/>
			</Grid.Col>
			<Grid.Col span={{ base: 12, md: 6 }}>
				<TextInput
					label="Bairro"
					placeholder="Digite o bairro"
					required
					disabled={disabled}
					{...form.getInputProps("neighborhood")}
				/>
			</Grid.Col>
			<Grid.Col span={{ base: 12, md: 4 }}>
				<TextInput
					label="Cidade"
					placeholder="Digite a cidade"
					required
					disabled={disabled}
					{...form.getInputProps("city")}
				/>
			</Grid.Col>
			<Grid.Col span={{ base: 12, md: 2 }}>
				<Select
					label="Estado"
					placeholder="UF"
					data={[
						"AC",
						"AL",
						"AP",
						"AM",
						"BA",
						"CE",
						"DF",
						"ES",
						"GO",
						"MA",
						"MT",
						"MS",
						"MG",
						"PA",
						"PB",
						"PR",
						"PE",
						"PI",
						"RJ",
						"RN",
						"RS",
						"RO",
						"RR",
						"SC",
						"SP",
						"SE",
						"TO",
					]}
					required
					disabled={disabled}
					{...form.getInputProps("state")}
				/>
			</Grid.Col>
		</Grid>
	);
}
