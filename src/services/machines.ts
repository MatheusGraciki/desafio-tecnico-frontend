import { get } from "@/helper/conexao";

export interface Machine {
	id?: string | number;
	[key: string]: unknown;
}

export async function fetchMachines() {
	const response = await get<Machine[]>("/maquinas");
	return response.data;
}
