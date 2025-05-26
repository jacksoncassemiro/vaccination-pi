"use client";

import { AppLayout } from "@/components/AppLayout";
import {
	Button,
	Grid,
	Group,
	Input,
	Select,
	Stack,
	TextInput,
	Title,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useForm, zodResolver } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useTransition } from "react";
import { IMaskInput } from "react-imask";
import { z } from "zod";
import { createPatient, getPatientById, updatePatient } from "../actions";

// Esquema de formulário que aceita Date para birth_date e converte para string
const formSchema = z.object({
	full_name: z
		.string()
		.min(2, "Nome deve ter pelo menos 2 caracteres")
		.max(255, "Nome deve ter no máximo 255 caracteres")
		.regex(/^[a-zA-ZÀ-ÿ\s]+$/, "Nome deve conter apenas letras e espaços"),

	cpf: z.string().min(1, "CPF é obrigatório"),

	birth_date: z
		.date({ required_error: "Data de nascimento é obrigatória" })
		.refine((date) => {
			const today = new Date();
			const age = today.getFullYear() - date.getFullYear();
			return age >= 0 && age <= 150;
		}, "Data de nascimento inválida"),

	phone: z.string().min(1, "Telefone é obrigatório"),

	cep: z.string().min(1, "CEP é obrigatório"),

	street: z
		.string()
		.min(1, "Rua é obrigatória")
		.max(255, "Rua deve ter no máximo 255 caracteres"),

	number: z
		.string()
		.min(1, "Número é obrigatório")
		.max(20, "Número deve ter no máximo 20 caracteres"),

	complement: z
		.string()
		.max(255, "Complemento deve ter no máximo 255 caracteres")
		.optional(),

	neighborhood: z
		.string()
		.min(1, "Bairro é obrigatório")
		.max(255, "Bairro deve ter no máximo 255 caracteres"),

	city: z
		.string()
		.min(1, "Cidade é obrigatória")
		.max(255, "Cidade deve ter no máximo 255 caracteres"),

	state: z
		.string()
		.min(2, "Estado é obrigatório")
		.max(2, "Estado deve ter 2 caracteres"),
});

type FormData = z.infer<typeof formSchema>;

// Função para buscar endereço pelo CEP
const fetchAddressByCep = async (cep: string) => {
	const cleanCep = cep.replace(/\D/g, "");
	if (cleanCep.length !== 8) return null;

	try {
		const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
		const data = await response.json();

		if (data.erro) return null;

		return {
			street: data.logradouro || "",
			neighborhood: data.bairro || "",
			city: data.localidade || "",
			state: data.uf || "",
		};
	} catch (error) {
		console.error("Erro ao buscar CEP:", error);
		return null;
	}
};

// Lista de estados brasileiros
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

export default function PatientFormPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const patientId = searchParams.get("id");
	const [isPending, startTransition] = useTransition();

	const form = useForm<FormData>({
		validate: zodResolver(formSchema),
		initialValues: {
			full_name: "",
			cpf: "",
			birth_date: new Date(),
			phone: "",
			cep: "",
			street: "",
			number: "",
			complement: "",
			neighborhood: "",
			city: "",
			state: "",
		},
	});

	const handleCepChange = useCallback(
		async (cep: string) => {
			form.setFieldValue("cep", cep);

			const cleanCep = cep.replace(/\D/g, "");
			if (cleanCep.length === 8) {
				const address = await fetchAddressByCep(cep);
				if (address) {
					form.setValues((prev) => ({
						...prev,
						street: address.street,
						neighborhood: address.neighborhood,
						city: address.city,
						state: address.state,
					}));
					notifications.show({
						title: "Sucesso",
						message: "Endereço preenchido automaticamente!",
						color: "green",
					});
				} else {
					notifications.show({
						title: "Aviso",
						message: "CEP não encontrado. Preencha o endereço manualmente.",
						color: "yellow",
					});
				}
			}
		},
		[form]
	); // Função para carregar dados do paciente
	const loadPatientData = useCallback(
		async (id: string) => {
			try {
				const patientToEdit = await getPatientById(id);
				form.setValues({
					full_name: patientToEdit.full_name,
					cpf: patientToEdit.cpf,
					birth_date: patientToEdit.birth_date
						? new Date(patientToEdit.birth_date)
						: new Date(),
					phone: patientToEdit.phone,
					cep: patientToEdit.cep,
					street: patientToEdit.street,
					number: patientToEdit.number,
					complement: patientToEdit.complement || "",
					neighborhood: patientToEdit.neighborhood,
					city: patientToEdit.city,
					state: patientToEdit.state,
				});
			} catch (error) {
				console.error("Erro ao buscar paciente:", error);
				notifications.show({
					title: "Erro",
					message: "Não foi possível carregar os dados do paciente",
					color: "red",
				});
			}
		},
		[form]
	);

	// Buscar dados do paciente para edição
	useEffect(() => {
		if (patientId) {
			startTransition(() => loadPatientData(patientId));
		}
	}, [patientId, loadPatientData]);

	const handleSubmit = (values: FormData) => {
		startTransition(async () => {
			try {
				const formData = new FormData();
				Object.entries(values).forEach(([key, value]) => {
					if (value instanceof Date) {
						formData.append(key, value.toISOString().split("T")[0]);
					} else if (value !== null && value !== undefined) {
						if (key === "cpf" || key === "phone" || key === "cep") {
							console.log(String(value).replace(/\D/g, ""));
							formData.append(key, String(value).replace(/\D/g, ""));
						} else {
							formData.append(key, String(value));
						}
					}
				});

				if (patientId) {
					await updatePatient(patientId, formData);
					notifications.show({
						title: "Sucesso",
						message: "Paciente atualizado com sucesso!",
						color: "green",
					});
				} else {
					await createPatient(formData);
					notifications.show({
						title: "Sucesso",
						message: "Paciente cadastrado com sucesso!",
						color: "green",
					});
				}
				router.push("/patients");
			} catch (error) {
				console.error("Erro ao salvar paciente:", error);
				notifications.show({
					title: "Erro",
					message:
						error instanceof Error ? error.message : "Erro ao salvar paciente",
					color: "red",
				});
			}
		});
	};

	return (
		<AppLayout>
			<Stack gap="lg" py="md">
				<Group justify="space-between" align="center">
					<Title order={2}>
						{patientId ? "Editar Paciente" : "Novo Paciente"}
					</Title>
					<Button
						variant="outline"
						leftSection={<ArrowLeft size={16} />}
						onClick={() => router.push("/patients")}
					>
						Voltar
					</Button>
				</Group>
				<form onSubmit={form.onSubmit(handleSubmit)}>
					<Stack gap="md">
						{/* Dados Pessoais */}
						<TextInput
							label="Nome Completo"
							placeholder="Digite o nome completo"
							{...form.getInputProps("full_name")}
						/>

						<Grid gutter="md">
							<Grid.Col span={{ base: 12, sm: 6 }}>
								<Input.Wrapper label="CPF" error={form.errors.cpf}>
									<Input
										component={IMaskInput}
										mask="000.000.000-00"
										placeholder="Digite o CPF"
										value={form.values.cpf}
										onAccept={(value: string) =>
											form.setFieldValue("cpf", value)
										}
									/>
								</Input.Wrapper>
							</Grid.Col>{" "}
							<Grid.Col span={{ base: 12, sm: 6 }}>
								<DatePickerInput
									label="Data de Nascimento"
									placeholder="Selecione a data de nascimento"
									valueFormat="DD/MM/YYYY"
									locale="pt-br"
									clearable
									{...form.getInputProps("birth_date")}
								/>
							</Grid.Col>
						</Grid>

						<Input.Wrapper label="Telefone" error={form.errors.phone}>
							<Input
								component={IMaskInput}
								mask="(00) 00000-0000"
								placeholder="Digite o telefone"
								value={form.values.phone}
								onAccept={(value: string) => form.setFieldValue("phone", value)}
							/>
						</Input.Wrapper>

						{/* Endereço */}
						<Grid gutter="md">
							<Grid.Col span={{ base: 12, sm: 4 }}>
								<Input.Wrapper label="CEP" error={form.errors.cep}>
									<Input
										component={IMaskInput}
										mask="00000-000"
										placeholder="Digite o CEP"
										value={form.values.cep}
										onAccept={handleCepChange}
									/>
								</Input.Wrapper>
							</Grid.Col>
							<Grid.Col span={{ base: 12, sm: 8 }}>
								<TextInput
									label="Rua"
									placeholder="Digite a rua"
									{...form.getInputProps("street")}
								/>
							</Grid.Col>
						</Grid>

						<Grid gutter="md">
							<Grid.Col span={{ base: 12, sm: 3 }}>
								<TextInput
									label="Número"
									placeholder="Digite o número"
									{...form.getInputProps("number")}
								/>
							</Grid.Col>
							<Grid.Col span={{ base: 12, sm: 9 }}>
								<TextInput
									label="Complemento"
									placeholder="Digite o complemento (opcional)"
									{...form.getInputProps("complement")}
								/>
							</Grid.Col>
						</Grid>

						<Grid gutter="md">
							<Grid.Col span={{ base: 12, sm: 6 }}>
								<TextInput
									label="Bairro"
									placeholder="Digite o bairro"
									{...form.getInputProps("neighborhood")}
								/>
							</Grid.Col>
							<Grid.Col span={{ base: 12, sm: 4 }}>
								<TextInput
									label="Cidade"
									placeholder="Digite a cidade"
									{...form.getInputProps("city")}
								/>
							</Grid.Col>
							<Grid.Col span={{ base: 12, sm: 2 }}>
								<Select
									label="Estado"
									placeholder="UF"
									data={brazilianStates}
									searchable
									{...form.getInputProps("state")}
								/>
							</Grid.Col>
						</Grid>
					</Stack>
					<Group justify="flex-end" mt="xl">
						<Button type="submit" loading={isPending} size="md">
							{patientId ? "Atualizar" : "Cadastrar"} Paciente
						</Button>
					</Group>
				</form>
			</Stack>
		</AppLayout>
	);
}
