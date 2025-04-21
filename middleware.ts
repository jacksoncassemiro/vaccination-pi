import { type NextRequest } from "next/server";
import { updateSession } from "@/utils";

export async function middleware(request: NextRequest) {
	return await updateSession(request);
}

export const config = {
	matcher: [
		/*
		 * Corresponde a todos os caminhos de solicitação, exceto:
		 * - _next/static (arquivos estáticos)
		 * - _next/image (arquivos de otimização de imagem)
		 * - favicon.ico (arquivo favicon)
		 * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
		 * Sinta-se à vontade para modificar este padrão para incluir mais caminhos.
		 */
		"/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
	],
};
