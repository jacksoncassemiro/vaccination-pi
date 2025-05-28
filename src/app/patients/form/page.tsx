"use client";

import { AppLayout } from "@/components/AppLayout";
import { PatientFormFields } from "@/components/PatientFormFields";
import { fetchAddressByCep } from "@/lib/viaCep";
import { patientSchema, type PatientFormData } from "@/schemas/patientSchema";
import { Button, Group, Stack, Title } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useDebouncedCallback } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";
import { createPatient, getPatientById, updatePatient } from "../actions";

export default function PatientFormPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const patientId = searchParams.get("id");
	const [isPending, startTransition] = useTransition();
	const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);
	const form = useForm<PatientFormData>({
		validate: zodResolver(patientSchema),
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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [patientId]); // Apenas depender de patientId
	// Função para buscar endereço com debounce
	const debouncedFetchAddress = useDebouncedCallback(
		async (acceptedCepValue: string) => {
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
							form.setValues((prev: Partial<PatientFormData>) => ({
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
		300 // Reduzido de 500ms para 300ms para melhor responsividade
	);

	const handleCepChange = useCallback(
		(acceptedCepValue: string) => {
			// Apenas chamar o debounce, o valor já é atualizado pelo form
			debouncedFetchAddress(acceptedCepValue);
		},
		[debouncedFetchAddress]
	);
	const handleSubmit = (values: PatientFormData) => {
		startTransition(async () => {
			try {
				const formDataToSubmit = new globalThis.FormData();
				Object.entries(values).forEach(([key, value]) => {
					if (value instanceof Date) {
						formDataToSubmit.append(key, value.toISOString().split("T")[0]);
					} else if (value !== null && value !== undefined) {
						formDataToSubmit.append(key, String(value));
					}
				});

				console.log(
					"Enviando dados:",
					Object.fromEntries(formDataToSubmit.entries())
				);

				if (patientId) {
					const result = await updatePatient(patientId, formDataToSubmit);
					console.log("Resultado updatePatient:", result);

					if (result.success) {
						notifications.show({
							title: "Sucesso",
							message: "Paciente atualizado com sucesso!",
							color: "green",
						});
						router.push("/patients");
					} else {
						console.log("Erro capturado na atualização:", result.error);
						notifications.show({
							title: "Erro",
							message: result.error || "Erro ao atualizar paciente",
							color: "red",
						});
					}
				} else {
					const result = await createPatient(formDataToSubmit);
					console.log("Resultado createPatient:", result);

					if (result.success) {
						notifications.show({
							title: "Sucesso",
							message: "Paciente cadastrado com sucesso!",
							color: "green",
						});
						router.push("/patients");
					} else {
						console.log("Erro capturado na criação:", result.error);
						notifications.show({
							title: "Erro",
							message: result.error || "Erro ao cadastrar paciente",
							color: "red",
						});
					}
				}
			} catch (error) {
				console.error("Erro no catch do handleSubmit:", error);
				notifications.show({
					title: "Erro",
					message: "Erro inesperado ao salvar paciente",
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
				</Group>{" "}
				<form onSubmit={form.onSubmit(handleSubmit)}>
					<Stack gap="md">
						<PatientFormFields
							form={form}
							disabled={isPending}
							onCepChange={handleCepChange}
						/>
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
