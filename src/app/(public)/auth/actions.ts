"use server";

import { getBaseUrl } from "@/utils/getBaseUrl";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function signInWithGoogle() {
	const supabase = await createClient();

	const baseUrl = getBaseUrl();

	const { data, error } = await supabase.auth.signInWithOAuth({
		provider: "google",
		options: {
			redirectTo: `${baseUrl}/auth/callback`,
		},
	});

	if (error) {
		redirect("/auth?error=login_failed");
	}

	if (data.url) {
		redirect(data.url);
	}
}

export async function signOut() {
	const supabase = await createClient();

	const { error } = await supabase.auth.signOut();

	if (error) {
		console.error("Erro ao fazer logout:", error);
		redirect("/?error=logout_failed");
	}

	redirect("/auth");
}
