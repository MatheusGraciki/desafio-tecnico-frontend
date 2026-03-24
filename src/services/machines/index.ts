import { get, post } from "@/helper/conexao";
import type { Machine } from "./type";




export async function fetchMachines() {
	const response = await get<Machine[]>("/maquinas");
	return response.data;
}


export async function postUpdateMachine(
	id: Machine["id"],
	payload: UpdateMachinePayload,
) {
	const path = `/maquinas/${encodeURIComponent(String(id))}`;
	const response = await post(path, payload);
	return response.data;
}


export const updateMachine = postUpdateMachine;
