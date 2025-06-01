import { NextResponse } from "next/server";
// The client you created from the Server-Side Auth instructions
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
	const { searchParams, origin } = new URL(request.url);
	const code = searchParams.get("code");
	// if "next" is in param, use it as the redirect URL
	const next = searchParams.get("next") ?? "/";

	if (code) {
		const supabase = await createClient();
		const { error } = await supabase.auth.exchangeCodeForSession(code);

		if (!error) {
			const forwardedHost = request.headers.get("x-forwarded-host"); // original origin before load balancer
			const isLocalEnv = process.env.NODE_ENV === "development";
			const isLocalhost = origin.includes("localhost");

			if (isLocalhost || isLocalEnv) {
				// Forçar HTTP para localhost (desenvolvimento ou produção local)
				let redirectUrl = origin;
				if (origin.startsWith("https://localhost")) {
					redirectUrl = origin.replace("https://", "http://");
				}

				return NextResponse.redirect(`${redirectUrl}${next}`);
			} else if (forwardedHost) {
				return NextResponse.redirect(`https://${forwardedHost}${next}`);
			} else {
				return NextResponse.redirect(`${origin}${next}`);
			}
		}
	}
	// return the user to an error page with instructions
	return NextResponse.redirect(
		`${origin}/auth?error=${encodeURIComponent(
			"Não foi possível logar no provedor selecionado."
		)}`
	);
}
