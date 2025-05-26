interface ViaCepResponse {
	cep: string;
	logradouro: string;
	complemento: string;
	bairro: string;
	localidade: string;
	uf: string;
	ibge: string;
	gia: string;
	ddd: string;
	siafi: string;
	erro?: boolean;
}

interface AddressData {
	street: string;
	neighborhood: string;
	city: string;
	state: string;
}

export async function fetchAddressByCep(
	cep: string
): Promise<AddressData | null> {
	const cleanCep = cep.replace(/\D/g, "");
	if (cleanCep.length !== 8) return null;

	try {
		const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
		const data: ViaCepResponse = await response.json();

		if (data.erro) return null;

		return {
			street: data.logradouro || "",
			neighborhood: data.bairro || "",
			city: data.localidade || "",
			state: data.uf || "",
		};
	} catch (error) {
		console.error("Erro ao buscar CEP:", error);
		return null;
	}
}
