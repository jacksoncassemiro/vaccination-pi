"use client";

import { VaccinationFormFields } from "@/components";
import {
	vaccinationSchema,
	type VaccinationFormData,
} from "@/schemas/vaccinationSchema";
import { Button, Group, Stack, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { zodResolver } from "mantine-form-zod-resolver";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useTransition } from "react";
import { FaArrowLeft } from "react-icons/fa";
import {
	createVaccination,
	getVaccinationById,
	updateVaccination,
} from "../actions";

export default function VaccinationFormPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const vaccinationId = searchParams.get("id");
	const [isPending, startTransition] = useTransition();
	const form = useForm<VaccinationFormData>({
		validate: zodResolver(vaccinationSchema),
		initialValues: {
			patient_id: "",
			vaccine_id: "",
			dose_date: new Date(), // Usar data atual como padrão
			batch_number: "",
			location: "",
			notes: "",
		},
	});

	// Efeito para carregar dados da vacinação
	useEffect(() => {
		if (vaccinationId) {
			const fetchData = async () => {
				try {
					const vaccinationToEdit = await getVaccinationById(vaccinationId);
					form.setValues({
						patient_id: vaccinationToEdit.patient_id || "",
						vaccine_id: vaccinationToEdit.vaccine_id || "",
						dose_date: vaccinationToEdit.dose_date
							? new Date(vaccinationToEdit.dose_date)
							: new Date(),
						batch_number: vaccinationToEdit.batch_number || "",
						location: vaccinationToEdit.location || "",
						notes: vaccinationToEdit.notes || "",
					});
				} catch (error) {
					console.error("Erro ao carregar vacinação:", error);
					notifications.show({
						title: "Erro",
						message: "Não foi possível carregar os dados da vacinação.",
						color: "red",
					});
				}
			};

			startTransition(() => {
				fetchData();
			});
		} else {
			// Modo de criação: resetar para valores iniciais
			form.reset();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [vaccinationId]); // Apenas depender de vaccinationId

	const handleSubmit = (values: VaccinationFormData) => {
		startTransition(async () => {
			try {
				const formData = new FormData();
				formData.append("patient_id", values.patient_id);
				formData.append("vaccine_id", values.vaccine_id);
				formData.append(
					"dose_date",
					values.dose_date.toISOString().split("T")[0]
				);
				formData.append("batch_number", values.batch_number);
				formData.append("location", values.location);
				if (values.notes) {
					formData.append("notes", values.notes);
				}

				if (vaccinationId) {
					const result = await updateVaccination(vaccinationId, formData);

					if (result.success) {
						notifications.show({
							title: "Sucesso",
							message: "Vacinação atualizada com sucesso!",
							color: "green",
						});
						router.push("/vaccinations");
					} else {
						notifications.show({
							title: "Erro",
							message: result.error || "Erro ao atualizar vacinação",
							color: "red",
						});
					}
				} else {
					const result = await createVaccination(formData);

					if (result.success) {
						notifications.show({
							title: "Sucesso",
							message: "Vacinação registrada com sucesso!",
							color: "green",
						});
						router.push("/vaccinations");
					} else {
						notifications.show({
							title: "Erro",
							message: result.error || "Erro ao registrar vacinação",
							color: "red",
						});
					}
				}
			} catch (error) {
				console.error("Erro no catch do handleSubmit:", error);
				notifications.show({
					title: "Erro",
					message: "Erro inesperado ao salvar vacinação",
					color: "red",
				});
			}
		});
	};

	const handleBack = () => {
		router.push("/vaccinations");
	};

	const isEditing = !!vaccinationId;
	const pageTitle = isEditing ? "Editar Vacinação" : "Nova Vacinação";

	return (
		<Stack gap="lg" py="md">
			<Group justify="space-between" align="center">
				<Title order={2}>{pageTitle}</Title>
				<Button
					variant="outline"
					leftSection={<FaArrowLeft size={16} />}
					onClick={handleBack}
				>
					Voltar
				</Button>
			</Group>

			<form onSubmit={form.onSubmit(handleSubmit)}>
				<Stack gap="md">
					<VaccinationFormFields form={form} disabled={isPending} />
				</Stack>
				<Group justify="flex-end" mt="xl">
					<Button type="submit" loading={isPending} size="md">
						{isEditing ? "Atualizar" : "Cadastrar"}
					</Button>
				</Group>
			</form>
		</Stack>
	);
}
