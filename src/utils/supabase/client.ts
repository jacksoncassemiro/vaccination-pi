import { createBrowserClient } from "@supabase/ssr";

export const browserClient = () => {
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

	if (!supabaseUrl || !supabaseAnonKey) {
		throw new Error(
			"Variáveis de ambiente do Supabase não configuradas. Verifique NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY"
		);
	}

	return createBrowserClient(supabaseUrl, supabaseAnonKey, {
		auth: {
			persistSession: true,
			detectSessionInUrl: true,
		},
	});
};
