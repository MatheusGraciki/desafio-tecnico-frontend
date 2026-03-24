import { isAxiosError } from "axios";

function messageFromBody(data: unknown): string | undefined {
	if (data == null) return undefined;
	if (typeof data === "string") return data.trim() || undefined;

	if (typeof data !== "object") return undefined;

	const record = data as Record<string, unknown>;

	const msg = record.message;
	if (Array.isArray(msg)) {
		const parts = msg.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
		if (parts.length) return parts.join(" ");
	}
	if (typeof msg === "string" && msg.trim()) return msg;

	const err = record.error;
	if (typeof err === "string" && err.trim()) return err;

	const detail = record.detail;
	if (typeof detail === "string" && detail.trim()) return detail;

	return undefined;
}

/**
 * Mensagem legível para o usuário a partir de falhas de rede ou HTTP (axios).
 */
export function getApiErrorMessage(error: unknown): string {
	if (isAxiosError(error)) {
		const status = error.response?.status;
		const fromServer = messageFromBody(error.response?.data);

		if (fromServer) return fromServer;

		if (status === 400) return "Requisição inválida. Confira nome, descrição e local.";
		if (status === 401) return "Não autorizado. Faça login novamente.";
		if (status === 403) return "Sem permissão para alterar esta máquina.";
		if (status === 404) return "Máquina não encontrada.";
		if (status === 422) return "Dados rejeitados pela validação. Ajuste os campos e tente de novo.";
		if (status === 503 || status === 502) return "Serviço temporariamente indisponível. Tente mais tarde.";

		if (error.code === "ERR_NETWORK" || error.message === "Network Error") {
			return "Não foi possível conectar ao servidor. Verifique a rede e se a API está no ar.";
		}

		if (!error.response) {
			return "Sem resposta do servidor. Verifique CORS, URL da API e se o proxy está configurado (VITE_API_URL em dev).";
		}

		return error.message || "Erro ao comunicar com a API.";
	}

	if (error instanceof Error) return error.message;
	return "Ocorreu um erro inesperado.";
}
