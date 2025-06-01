export const getBaseUrl = (): string => {
	// Em produção no Vercel, usar VERCEL_URL (disponível no servidor)
	if (process.env.VERCEL_URL && process.env.NODE_ENV === "production") {
		return `https://${process.env.VERCEL_URL}`;
	}

	// Para development ou quando VERCEL_URL não está disponível
	if (
		process.env.NODE_ENV === "development" ||
		process.env.NEXT_PUBLIC_VERCEL_ENV === "development"
	) {
		return process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
	}

	// Fallback para SITE_URL (configurável)
	if (process.env.NEXT_PUBLIC_SITE_URL) {
		return process.env.NEXT_PUBLIC_SITE_URL;
	}

	// Fallback para BASE_URL
	if (process.env.NEXT_PUBLIC_BASE_URL) {
		return process.env.NEXT_PUBLIC_BASE_URL;
	}

	// Último fallback
	return "http://localhost:3000";
};
