import { FaBell, FaCircleExclamation, FaRegCircleCheck } from "react-icons/fa6";
import { LuClock12, LuClock4 } from "react-icons/lu";
import type { MachineStatusCategory } from "@/services/machines/type";
import type { SummaryItem } from "../type";

export const STATUS_CONFIG: Record<
	MachineStatusCategory,
	Pick<
		SummaryItem,
		"label" | "textColor" | "buttonColor" | "smallIcon" | "largeIcon"
	>
> = {
	operando: {
		label: "Em Operação",
		textColor: "success",
		buttonColor: "success",
		smallIcon: null,
		largeIcon: <FaRegCircleCheck size={30} />,
	},
	alerta: {
		label: "Em Alerta",
		textColor: "danger",
		buttonColor: "danger",
		smallIcon: null,
		largeIcon: <FaBell size={28} />,
	},
	atencao: {
		label: "Em Atenção",
		textColor: "warning",
		buttonColor: "warning",
		smallIcon: null,
		largeIcon: <FaCircleExclamation size={28} />,
	},
	parada: {
		label: "Parada ou Offline",
		textColor: "secondary",
		buttonColor: "secondary",
		smallIcon: <LuClock12 size={16} />,
		largeIcon: <LuClock4 size={30} />,
	},
};
