"use client";

import { AppLayout } from "@/components/AppLayout";
import { VaccineFormFields } from "@/components/VaccineFormFields";
import { vaccineSchema, type VaccineFormData } from "@/schemas/vaccineSchema";
import { Button, Group, Stack, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { ArrowLeft } from "lucide-react";
import { zodResolver } from "mantine-form-zod-resolver";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useTransition } from "react";
import { createVaccine, getVaccineById, updateVaccine } from "../actions";

export default function VaccineFormPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const vaccineId = searchParams.get("id");
	const [isPending, startTransition] = useTransition();

	const form = useForm<VaccineFormData>({
		validate: zodResolver(vaccineSchema),
		initialValues: {
			type: "",
			manufacturer: "",
		},
	});
	// Efeito para carregar dados da vacina
	useEffect(() => {
		if (vaccineId) {
			const fetchData = async () => {
				try {
					const vaccineToEdit = await getVaccineById(vaccineId);

					form.setValues({
						type: vaccineToEdit.type || "",
						manufacturer: vaccineToEdit.manufacturer || "",
					});
				} catch (error) {
					console.error("Erro ao carregar vacina:", error);
					notifications.show({
						title: "Erro",
						message: "Não foi possível carregar os dados da vacina.",
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
	}, [vaccineId]); // Apenas depender de vaccineId
	const handleSubmit = (values: VaccineFormData) => {
		startTransition(async () => {
			try {
				const formData = new FormData();
				formData.append("type", values.type);
				formData.append("manufacturer", values.manufacturer);

				if (vaccineId) {
					const result = await updateVaccine(vaccineId, formData);

					if (result.success) {
						notifications.show({
							title: "Sucesso",
							message: "Vacina atualizada com sucesso!",
							color: "green",
						});
						router.push("/vaccines");
					} else {
						notifications.show({
							title: "Erro",
							message: result.error || "Erro ao atualizar vacina",
							color: "red",
						});
					}
				} else {
					const result = await createVaccine(formData);

					if (result.success) {
						notifications.show({
							title: "Sucesso",
							message: "Vacina criada com sucesso!",
							color: "green",
						});
						router.push("/vaccines");
					} else {
						notifications.show({
							title: "Erro",
							message: result.error || "Erro ao criar vacina",
							color: "red",
						});
					}
				}
			} catch (error) {
				console.error("Erro no catch do handleSubmit:", error);
				notifications.show({
					title: "Erro",
					message: "Erro inesperado ao salvar vacina",
					color: "red",
				});
			}
		});
	};

	const handleBack = () => {
		router.push("/vaccines");
	};

	const isEditing = !!vaccineId;
	const pageTitle = isEditing ? "Editar Vacina" : "Nova Vacina";
	return (
		<AppLayout>
			<Stack gap="lg" py="md">
				<Group justify="space-between" align="center">
					<Title order={2}>{pageTitle}</Title>
					<Button
						variant="outline"
						leftSection={<ArrowLeft size={16} />}
						onClick={handleBack}
					>
						Voltar
					</Button>
				</Group>

				<form onSubmit={form.onSubmit(handleSubmit)}>
					<Stack gap="md">
						<VaccineFormFields form={form} disabled={isPending} />
					</Stack>
					<Group justify="flex-end" mt="xl">
						<Button type="submit" loading={isPending} size="md">
							{isEditing ? "Atualizar" : "Cadastrar"} Vacina
						</Button>
					</Group>
				</form>
			</Stack>
		</AppLayout>
	);
}
