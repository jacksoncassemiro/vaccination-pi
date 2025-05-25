import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export const updateSession = async (request: NextRequest) => {
	const pathname = request.nextUrl.pathname;
	// Crie uma resposta não modificada
	let supabaseResponse = NextResponse.next({
		request,
	});

	const supabase = createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				getAll() {
					return request.cookies.getAll();
				},
				setAll(cookiesToSet) {
					cookiesToSet.forEach(({ name, value }) =>
						request.cookies.set(name, value)
					);
					supabaseResponse = NextResponse.next({
						request,
					});
					cookiesToSet.forEach(({ name, value, options }) =>
						supabaseResponse.cookies.set(name, value, options)
					);
				},
			},
		}
	); // SEMPRE usar getUser() em código server-side como middleware
	// Nunca confiar em getSession() no server - pode ser falsificado
	// https://supabase.com/docs/guides/auth/server-side/nextjs
	const {
		data: { user },
	} = await supabase.auth.getUser();

	// Rotas públicas que não precisam de autenticação
	const publicRoutes = ["/auth", "/auth/callback", "/auth/confirm"];
	const isPublicRoute = publicRoutes.some((route) =>
		pathname.startsWith(route)
	);
	// Se não há usuário válido e não está em uma rota pública, redireciona para login
	if (!user && !isPublicRoute) {
		const redirectUrl = new URL("/auth", request.url);
		return NextResponse.redirect(redirectUrl);
	}

	// Se há usuário válido e tenta acessar a página de auth, redireciona para página inicial
	if (user && pathname === "/auth") {
		const redirectUrl = new URL("/", request.url);
		return NextResponse.redirect(redirectUrl);
	}

	return supabaseResponse;
};
