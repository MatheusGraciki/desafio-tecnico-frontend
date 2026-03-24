export interface MachineData {
	timestamp: string;
	rpm: number;
	potencia: number;
	temperatura: number;
}

export type MachineStatusCategory = "operando" | "alerta" | "atencao" | "parada";

export interface Machine {
	id: string | number;
	codigo: string;
	nome?: string;
	descricao?: string;
	local: string;
	status: string;
	alertas: string[];
	ultimaAtualizacao: string;
	dados: MachineData[];
}


export interface UpdateMachinePayload {
	nome: Machine["nome"];
	descricao: Machine["descricao"];
	local: Machine["local"];
}