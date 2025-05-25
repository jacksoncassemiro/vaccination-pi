"use client";

import { AppLayout } from "@/components/AppLayout";
import { patientSchema } from "@/schemas/patientSchema";
import { Button, Group, Input, Stack, TextInput, Title } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm, zodResolver } from "@mantine/form";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useTransition } from "react";
import { IMaskInput } from "react-imask";
import { z } from "zod";
import { createPatient, getPatients, updatePatient } from "../actions";

// Esquema de formulário que aceita Date para birth_date
const formSchema = patientSchema.extend({
	birth_date: z
		.date({ required_error: "Data de nascimento é obrigatória" })
		.refine((date) => {
			const today = new Date();
			const age = today.getFullYear() - date.getFullYear();
			return age >= 0 && age <= 150;
		}, "Data de nascimento inválida"),
});

type FormData = z.infer<typeof formSchema>;

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

	// Buscar dados do paciente para edição
	useEffect(() => {
		if (patientId) {
			startTransition(async () => {
				try {
					const response = await getPatients({ search: patientId });
					const patientToEdit = response.data.find((p) => p.id === patientId);
					if (patientToEdit) {
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
					}
				} catch (error) {
					console.error("Erro ao buscar paciente:", error);
				}
			});
		}
	}, [patientId, form]);

	const handleSubmit = (values: FormData) => {
		startTransition(async () => {
			try {
				const formData = new FormData();
				Object.entries(values).forEach(([key, value]) => {
					if (value instanceof Date) {
						formData.append(key, value.toISOString().split("T")[0]);
					} else if (value !== null && value !== undefined) {
						formData.append(key, String(value));
					}
				});

				if (patientId) {
					await updatePatient(patientId, formData);
				} else {
					await createPatient(formData);
				}
				router.push("/patients");
			} catch (error) {
				console.error("Erro ao salvar paciente:", error);
			}
		});
	};

	return (
		<AppLayout>
			<Stack gap="lg" py="md">
				<Title order={2}>
					{patientId ? "Editar Paciente" : "Novo Paciente"}
				</Title>
				<form onSubmit={form.onSubmit(handleSubmit)}>
					<Stack>
						<TextInput
							label="Nome Completo"
							placeholder="Digite o nome completo"
							{...form.getInputProps("full_name")}
						/>

						<Input.Wrapper label="CPF" error={form.errors.cpf}>
							<Input
								component={IMaskInput}
								mask="000.000.000-00"
								placeholder="Digite o CPF"
								value={form.values.cpf}
								onAccept={(value: string) => form.setFieldValue("cpf", value)}
							/>
						</Input.Wrapper>

						<DateInput
							label="Data de Nascimento"
							placeholder="Selecione a data de nascimento"
							valueFormat="DD/MM/YYYY"
							{...form.getInputProps("birth_date")}
						/>

						<Input.Wrapper label="Telefone" error={form.errors.phone}>
							<Input
								component={IMaskInput}
								mask="(00) 00000-0000"
								placeholder="Digite o telefone"
								value={form.values.phone}
								onAccept={(value: string) => form.setFieldValue("phone", value)}
							/>
						</Input.Wrapper>

						<Input.Wrapper label="CEP" error={form.errors.cep}>
							<Input
								component={IMaskInput}
								mask="00000-000"
								placeholder="Digite o CEP"
								value={form.values.cep}
								onAccept={(value: string) => form.setFieldValue("cep", value)}
							/>
						</Input.Wrapper>

						<TextInput
							label="Rua"
							placeholder="Digite a rua"
							{...form.getInputProps("street")}
						/>
						<TextInput
							label="Número"
							placeholder="Digite o número"
							{...form.getInputProps("number")}
						/>
						<TextInput
							label="Complemento"
							placeholder="Digite o complemento"
							{...form.getInputProps("complement")}
						/>
						<TextInput
							label="Bairro"
							placeholder="Digite o bairro"
							{...form.getInputProps("neighborhood")}
						/>
						<TextInput
							label="Cidade"
							placeholder="Digite a cidade"
							{...form.getInputProps("city")}
						/>
						<TextInput
							label="Estado"
							placeholder="Digite o estado"
							{...form.getInputProps("state")}
						/>
					</Stack>
					<Group justify="flex-end" mt="md">
						<Button type="submit" loading={isPending}>
							Salvar
						</Button>
					</Group>
				</form>
			</Stack>
		</AppLayout>
	);
}
