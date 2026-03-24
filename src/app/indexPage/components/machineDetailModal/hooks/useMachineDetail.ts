import { useEffect, useId, useMemo, useState } from "react";
import type { Machine, MachineData } from "@/services/machines/type";
import {
	getLastMachineData,
	getMachineImageUrl,
	getStatusInfo,
} from "@/app/indexPage/utils/machine";

export type MainTab = "resumo" | "historico" | "estatisticas" | "alertas";
export type RangeKey = "24h" | "7d" | "30d";

const RANGE_WINDOW: Record<RangeKey, number> = {
	"24h": 24,
	"7d": 48,
	"30d": 96,
};

function formatRpm(value: number | undefined) {
	if (value === undefined || Number.isNaN(value)) return "--";
	return `${new Intl.NumberFormat("pt-BR").format(value)} rpm`;
}

function formatChartLabel(iso: string) {
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return "";
	return d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function formatHm(totalMinutes: number) {
	const h = Math.floor(totalMinutes / 60);
	const m = Math.round(totalMinutes % 60);
	return `${h}h ${String(m).padStart(2, "0")}m`;
}

function estimateKpis(dados: MachineData[], stepMin = 5) {
	const alertPoints = dados.filter((d) => d.temperatura >= 80).length;
	const attentionPoints = dados.filter(
		(d) => d.temperatura >= 65 && d.temperatura < 80,
	).length;
	const totalMin = dados.length * stepMin;
	return {
		alerta: formatHm(alertPoints * stepMin),
		atencao: formatHm(attentionPoints * stepMin),
		totalOper: formatHm(totalMin),
	};
}

function hasHighTemp(machine: Machine, last?: MachineData) {
	const fromAlert =
		machine.alertas?.some((a) => a.toLowerCase().includes("temp")) ?? false;
	const fromValue =
		last !== undefined &&
		!Number.isNaN(last.temperatura) &&
		last.temperatura >= 75;
	return fromAlert || fromValue;
}

export function useMachineDetail(machine: Machine | null) {
	const tempGradientId = useId().replace(/:/g, "");
	const [mainTab, setMainTab] = useState<MainTab>("resumo");
	const [range, setRange] = useState<RangeKey>("24h");
	const [windowStart, setWindowStart] = useState(0);

	const lastData = machine ? getLastMachineData(machine) : undefined;
	const statusInfo = machine ? getStatusInfo(machine.status) : null;
	const imageUrl = machine ? getMachineImageUrl(machine.codigo) : "";
	const showTempBadge = machine ? hasHighTemp(machine, lastData) : false;
	const dados = machine?.dados?.length ? machine.dados : [];

	useEffect(() => {
		setMainTab("resumo");
	}, [machine?.id]);

	useEffect(() => {
		setWindowStart(0);
	}, [machine?.id, range]);

	const windowSize = RANGE_WINDOW[range];
	const maxStart = Math.max(0, dados.length - windowSize);

	useEffect(() => {
		setWindowStart((s) => Math.min(s, maxStart));
	}, [maxStart]);

	const chartSlice = useMemo(() => {
		if (!dados.length) return [];
		const start = Math.min(windowStart, maxStart);
		return dados.slice(start, start + windowSize);
	}, [dados, maxStart, windowSize, windowStart]);

	const chartData = useMemo(
		() =>
			chartSlice.map((d) => ({
				label: formatChartLabel(d.timestamp),
				temperatura: d.temperatura,
			})),
		[chartSlice],
	);

	const kpis = useMemo(() => estimateKpis(dados), [dados]);

	const efficiency = useMemo(() => {
		if (!statusInfo) return "—";
		if (statusInfo.category === "operando") return "88%";
		if (statusInfo.category === "atencao") return "72%";
		if (statusInfo.category === "alerta") return "61%";
		return "—";
	}, [statusInfo]);

	const efficiencyClass =
		statusInfo?.category === "operando"
			? "text-success fw-semibold"
			: "text-body fw-semibold";

	const statusDotClass =
		statusInfo?.category === "operando"
			? "text-success"
			: statusInfo?.category === "alerta"
				? "text-danger"
				: statusInfo?.category === "atencao"
					? "text-warning"
					: "text-secondary";

	return {
		tempGradientId,
		mainTab,
		setMainTab,
		range,
		setRange,
		windowStart,
		setWindowStart,
		windowSize,
		maxStart,
		lastData,
		statusInfo,
		imageUrl,
		showTempBadge,
		dados,
		chartData,
		kpis,
		efficiency,
		efficiencyClass,
		statusDotClass,
	};
}
