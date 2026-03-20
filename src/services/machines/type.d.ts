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
	local: string;
	status: string;
	alertas: string[];
	ultimaAtualizacao: string;
	dados: MachineData[];
}
