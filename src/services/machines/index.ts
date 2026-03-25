import { ApiError } from "@/helper/apiError";
import { get, post } from "@/helper/conexao";
import type { Machine, UpdateMachinePayload } from "./type";

export async function fetchMachines() {
	try {
		const response = await get<Machine[]>("/maquinas");
		return response.data;
	} catch {
		throw new ApiError("Não foi possível carregar as máquinas.");
	}
}

export async function postUpdateMachine(
	id: Machine["id"],
	payload: UpdateMachinePayload,
) {
	const path = `/maquinas/${encodeURIComponent(String(id))}`;
	try {
		const response = await post<Partial<Machine> | Machine>(path, payload);
		return response.data;
	} catch {
		throw new ApiError("Não foi possível salvar as alterações.");
	}
}


export const updateMachine = postUpdateMachine;
