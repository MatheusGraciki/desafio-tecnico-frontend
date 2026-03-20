import { get } from "@/helper/conexao";
import type { Machine } from "./type";

export async function fetchMachines() {
	const response = await get<Machine[]>("/maquinas");
	return response.data;
}
