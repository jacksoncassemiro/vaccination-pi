"use server";

import { getBaseUrl } from "@/utils/getBaseUrl";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function signInWithGoogle() {
	const supabase = await createClient();

	const baseUrl = getBaseUrl();

	console.log("=== DEBUG VARIAVEIS DE AMBIENTE ===");
	console.log("NODE_ENV:", process.env.NODE_ENV);
	console.log("VERCEL_URL:", process.env.VERCEL_URL);
	console.log("NEXT_PUBLIC_SITE_URL:", process.env.NEXT_PUBLIC_SITE_URL);
	console.log("NEXT_PUBLIC_BASE_URL:", process.env.NEXT_PUBLIC_BASE_URL);
	console.log("Base URL final:", baseUrl);
	console.log("===================================");

	const { data, error } = await supabase.auth.signInWithOAuth({
		provider: "google",
		options: {
			redirectTo: `${baseUrl}/auth/callback`,
		},
	});

	if (error) {
		console.error("Erro ao fazer login com Google:", error);
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
