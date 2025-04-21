import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const serverClient = async () => {
	const cookieStore = await cookies();

	return createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				getAll() {
					return cookieStore.getAll();
				},
				setAll(cookiesToSet) {
					try {
						cookiesToSet.forEach(({ name, value, options }) => {
							cookieStore.set(name, value, options);
						});
						// eslint-disable-next-line @typescript-eslint/no-unused-vars
					} catch (error) {
						// O método `set` foi chamado de um Server Component.
						// Isso pode ser ignorado se você tiver middleware atualizando
						// sessões de usuário.
					}
				},
			},
		}
	);
};
