"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function signInWithGoogle() {
	const supabase = await createClient();

	const { data, error } = await supabase.auth.signInWithOAuth({
		provider: "google",
		options: {
			redirectTo: `${
				process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
			}/auth/callback`,
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
