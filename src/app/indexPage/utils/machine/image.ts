import routerImg from "@/assets/images/router.png";
import tornoImg from "@/assets/images/torno.png";
import fresadoraImg from "@/assets/images/fresadora.png";
import retificaImg from "@/assets/images/retifica.png";
import centroUsinagemImg from "@/assets/images/centroUsinagem.png";
import type { MachineRule } from "./type";

function normalizeText(text: string) {
	return text
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "") // remove acentos
		.toLowerCase()
		.trim()
		.replace(/\s+/g, " "); // remove espaços duplicados
}

/** Regras com prioridade (ordem importa) */
const MACHINE_IMAGE_MAP: MachineRule[] = [
	{
		keywords: ["centro", "usinagem"],
		image: centroUsinagemImg,
		match: "all", // precisa ter os dois
	},
	{
		keywords: ["fresadora"],
		image: fresadoraImg,
	},
	{
		keywords: ["torno"],
		image: tornoImg,
	},
	{
		keywords: ["retifica"],
		image: retificaImg,
	},
	{
		keywords: ["router"],
		image: routerImg,
	},
];

export function getMachineImageUrl(codigo: string): string {
	const normalized = normalizeText(codigo);

	const match = MACHINE_IMAGE_MAP.find(({ keywords, match = "any" }) => {
		const normalizedKeywords = keywords.map(normalizeText);

		if (match === "all") {
			return normalizedKeywords.every((k) => normalized.includes(k));
		}

		return normalizedKeywords.some((k) => normalized.includes(k));
	});

	return match?.image ?? centroUsinagemImg;
}
