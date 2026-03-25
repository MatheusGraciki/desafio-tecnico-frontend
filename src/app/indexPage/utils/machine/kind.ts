/**
 * Categorização leve por nome da máquina (API não expõe campo "tipo").
 */
export function inferMachineKind(codigo: string): string {
	const nomeMaquina = codigo
		.toLowerCase()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "");
	console.debug(nomeMaquina);
	if (nomeMaquina.includes("torno")) return "Torno";
	if (nomeMaquina.includes("fresadora")) return "Fresadora";
	if (nomeMaquina.includes("retifica")) return "Retifica";
	if (nomeMaquina.includes("router")) return "Router";
	if (nomeMaquina.includes("centro de usinagem")) return "Centro de Usinagem";
	return "Outros";
}
