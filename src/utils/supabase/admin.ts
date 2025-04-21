import { createClient } from "@supabase/supabase-js";

// Nota: supabaseAdmin usa o SERVICE_ROLE_KEY que você deve usar somente em um contexto seguro do lado do servidor
// pois ele tem privilégios de administrador e substitui as políticas RLS!
export const serviceRoleClient = () => {
	return createClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.SUPABASE_SERVICE_ROLE_KEY!,
		{
			auth: {
				autoRefreshToken: false,
				persistSession: false,
			},
		}
	);
};
