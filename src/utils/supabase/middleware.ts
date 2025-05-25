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
	);

	// Isso atualizará a sessão se expirar - necessário para componentes do servidor
	// https://supabase.com/docs/guides/auth/server-side/nextjs
	const user = await supabase.auth.getUser();
	// Rotas públicas que não precisam de autenticação
	const publicRoutes = ["/auth", "/auth/callback", "/auth/confirm"];
	const isPublicRoute = publicRoutes.some((route) =>
		pathname.startsWith(route)
	);

	// Se o usuário não está logado e não está em uma rota pública, redireciona para login
	if (user.error && !isPublicRoute) {
		const redirectUrl = new URL("/auth", request.url);
		return NextResponse.redirect(redirectUrl);
	}

	// Se o usuário está logado e tenta acessar a página de auth, redireciona para página inicial
	if (!user.error && pathname === "/auth") {
		const redirectUrl = new URL("/", request.url);
		return NextResponse.redirect(redirectUrl);
	}

	return supabaseResponse;
};
