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
import { DatePickerInput } from "@mantine/dates"; // Mantido como DatePickerInput
import { useForm, zodResolver } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react"; // Adicionado useState
import { IMaskInput } from "react-imask";
import { z } from "zod";
import { createPatient, getPatientById, updatePatient } from "../actions";

// Esquema de formulário que aceita Date para birth_date
const formSchema = z.object({
	full_name: z
		.string()
		.min(2, "Nome deve ter pelo menos 2 caracteres")
		.max(255, "Nome deve ter no máximo 255 caracteres")
		.regex(/^[a-zA-ZÀ-ÿ\s]+$/, "Nome deve conter apenas letras e espaços"),

	cpf: z.string().min(1, "CPF é obrigatório"),
	birth_date: z.coerce
		.date({
			errorMap: (issue, { defaultError }) => ({
				message:
					issue.code === "invalid_date"
						? "Data de nascimento inválida"
						: defaultError,
			}),
		})
		.refine((date) => {
			const today = new Date();
			// Garante que 'date' seja um objeto Date válido antes de chamar getFullYear()
			if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
				return false;
			}
			const birthYear = date.getFullYear();
			const currentYear = today.getFullYear();
			let age = currentYear - birthYear;
			const monthDiff = today.getMonth() - date.getMonth();
			if (
				monthDiff < 0 ||
				(monthDiff === 0 && today.getDate() < date.getDate())
			) {
				age--;
			}
			return age >= 0 && age <= 150;
		}, "Data de nascimento inválida ou idade fora do permitido (0-150 anos)"),

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

// Função para buscar endereço pelo CEP (sem alterações)
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
	const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);

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

	// Efeito para carregar dados do paciente
	useEffect(() => {
		if (patientId) {
			setIsInitialLoadComplete(false); // Resetar flag antes de carregar
			const fetchData = async () => {
				try {
					const patientToEdit = await getPatientById(patientId);
					let birthDateForForm: Date = new Date();
					if (patientToEdit.birth_date) {
						const parsedDate = new Date(patientToEdit.birth_date);
						if (!Number.isNaN(parsedDate.getTime())) {
							birthDateForForm = parsedDate;
						} else {
							console.warn(
								`Data de nascimento inválida recebida: ${patientToEdit.birth_date}`
							);
						}
					}

					form.setValues({
						full_name: patientToEdit.full_name || "",
						cpf: patientToEdit.cpf || "",
						birth_date: birthDateForForm,
						phone: patientToEdit.phone || "",
						cep: patientToEdit.cep || "",
						street: patientToEdit.street || "",
						number: patientToEdit.number || "",
						complement: patientToEdit.complement || "",
						neighborhood: patientToEdit.neighborhood || "",
						city: patientToEdit.city || "",
						state: patientToEdit.state || "",
					});
					setIsInitialLoadComplete(true);
				} catch (error) {
					console.error("Erro ao buscar paciente:", error);
					notifications.show({
						title: "Erro",
						message: "Não foi possível carregar os dados do paciente.",
						color: "red",
					});
					setIsInitialLoadComplete(true); // Permite que o formulário seja usado mesmo com erro
				}
			};
			startTransition(() => {
				fetchData();
			});
		} else {
			// Modo de criação: resetar para valores iniciais e marcar como completo
			form.reset();
			setIsInitialLoadComplete(true);
		}
	}, [patientId, form]); // Depender de `form` (estável) e `patientId`

	const handleCepChange = useCallback(
		async (acceptedCepValue: string) => {
			const currentCepInForm = form.values.cep;
			if (currentCepInForm !== acceptedCepValue) {
				form.setFieldValue("cep", acceptedCepValue);
			}

			if (isInitialLoadComplete) {
				const cleanCep = acceptedCepValue.replace(/\D/g, "");
				if (cleanCep.length === 8) {
					const address = await fetchAddressByCep(acceptedCepValue);
					if (address) {
						if (
							form.values.street !== address.street ||
							form.values.neighborhood !== address.neighborhood ||
							form.values.city !== address.city ||
							form.values.state !== address.state
						) {
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
						}
					} else {
						notifications.show({
							title: "Aviso",
							message: "CEP não encontrado. Preencha o endereço manualmente.",
							color: "yellow",
						});
					}
				}
			}
		},
		[form, isInitialLoadComplete]
	);

	const handleSubmit = (values: FormData) => {
		startTransition(async () => {
			try {
				const formDataToSubmit = new FormData();
				Object.entries(values).forEach(([key, value]) => {
					if (value instanceof Date) {
						formDataToSubmit.append(key, value.toISOString().split("T")[0]);
					} else if (value !== null && value !== undefined) {
						// Remover máscaras de CPF, Telefone, CEP antes de enviar
						if (key === "cpf" || key === "phone" || key === "cep") {
							formDataToSubmit.append(key, String(value).replace(/\D/g, ""));
						} else {
							formDataToSubmit.append(key, String(value));
						}
					}
				});

				if (patientId) {
					await updatePatient(patientId, formDataToSubmit);
					notifications.show({
						title: "Sucesso",
						message: "Paciente atualizado com sucesso!",
						color: "green",
					});
				} else {
					await createPatient(formDataToSubmit);
					notifications.show({
						title: "Sucesso",
						message: "Paciente cadastrado com sucesso!",
						color: "green",
					});
				}
				router.push("/patients");
			} catch (error) {
				console.error("Erro ao salvar paciente:", error);
				const errorMessage =
					error instanceof Error ? error.message : "Erro ao salvar paciente";
				// Tentar extrair mensagens de erro do Zod se for um erro de validação da action
				let finalMessage = errorMessage;
				if (typeof error === "object" && error !== null && "message" in error) {
					try {
						const parsedError = JSON.parse(error.message as string);
						if (Array.isArray(parsedError) && parsedError.length > 0) {
							finalMessage = parsedError
								.map((e: { message: string }) => e.message)
								.join(", ");
						}
					} catch {
						// Não era um JSON de erro do Zod, mantém a mensagem original
					}
				}
				notifications.show({
					title: "Erro",
					message: finalMessage,
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
						<TextInput
							label="Nome Completo"
							placeholder="Digite o nome completo"
							disabled={isPending}
							{...form.getInputProps("full_name")}
						/>
						<Grid gutter="md">
							<Grid.Col span={{ base: 12, sm: 6 }}>
								<Input.Wrapper label="CPF" error={form.errors.cpf}>
									<Input
										component={IMaskInput}
										mask="000.000.000-00"
										placeholder="Digite o CPF"
										disabled={isPending}
										{...form.getInputProps("cpf")}
									/>
								</Input.Wrapper>
							</Grid.Col>
							<Grid.Col span={{ base: 12, sm: 6 }}>
								<DatePickerInput
									label="Data de Nascimento"
									placeholder="Selecione a data"
									valueFormat="DD/MM/YYYY"
									locale="pt-br"
									clearable
									disabled={isPending}
									{...form.getInputProps("birth_date")}
								/>
							</Grid.Col>
						</Grid>
						<Input.Wrapper label="Telefone" error={form.errors.phone}>
							<Input
								component={IMaskInput}
								mask={[{ mask: "(00) 0000-0000" }, { mask: "(00) 00000-0000" }]}
								placeholder="Digite o telefone"
								disabled={isPending}
								{...form.getInputProps("phone")}
							/>
						</Input.Wrapper>{" "}
						<Grid gutter="md">
							<Grid.Col span={{ base: 12, sm: 4 }}>
								<Input.Wrapper label="CEP" error={form.errors.cep}>
									<Input
										component={IMaskInput}
										mask="00000-000"
										placeholder="Digite o CEP"
										disabled={isPending}
										onAccept={(value) => handleCepChange(String(value))}
										{...form.getInputProps("cep")}
									/>
								</Input.Wrapper>
							</Grid.Col>
							<Grid.Col span={{ base: 12, sm: 8 }}>
								<TextInput
									label="Rua"
									placeholder="Digite a rua"
									disabled={isPending}
									{...form.getInputProps("street")}
								/>
							</Grid.Col>
						</Grid>
						<Grid gutter="md">
							<Grid.Col span={{ base: 12, sm: 3 }}>
								<TextInput
									label="Número"
									placeholder="Digite o número"
									disabled={isPending}
									{...form.getInputProps("number")}
								/>
							</Grid.Col>
							<Grid.Col span={{ base: 12, sm: 9 }}>
								<TextInput
									label="Complemento"
									placeholder="Digite o complemento (opcional)"
									disabled={isPending}
									{...form.getInputProps("complement")}
								/>
							</Grid.Col>
						</Grid>
						<Grid gutter="md">
							<Grid.Col span={{ base: 12, sm: 6 }}>
								<TextInput
									label="Bairro"
									placeholder="Digite o bairro"
									disabled={isPending}
									{...form.getInputProps("neighborhood")}
								/>
							</Grid.Col>
							<Grid.Col span={{ base: 12, sm: 4 }}>
								<TextInput
									label="Cidade"
									placeholder="Digite a cidade"
									disabled={isPending}
									{...form.getInputProps("city")}
								/>
							</Grid.Col>
							<Grid.Col span={{ base: 12, sm: 2 }}>
								<Select
									label="Estado"
									placeholder="UF"
									data={brazilianStates}
									searchable
									disabled={isPending}
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
