import { useId } from "react";
import {
	Area,
	AreaChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { format24hAxisTick, type Chart24hAxis } from "./utils/chart24h";

export type MachineChartPoint = {
	label: string;
	rpm: number;
	/** Quando presente, eixo X = tempo (últimas 24 h). */
	timeMs?: number;
};

interface MachineChartProps {
	chartData: MachineChartPoint[];
	/** Eixo temporal (esquerda = agora − 24h, direita = agora). */
	chart24hAxis?: Chart24hAxis | null;
}

export function MachineChart({ chartData, chart24hAxis }: MachineChartProps) {
	const rpmFillId = useId().replace(/:/g, "");
	const useTimeAxis = Boolean(chart24hAxis && chartData.length && chartData[0]?.timeMs !== undefined);

	if (!chartData.length) {
		return null;
	}

	if (useTimeAxis && chart24hAxis) {
		const { domainStart, domainEnd, ticks } = chart24hAxis;
		return (
			<div className="machine-detail-modal-chart-rpm">
				<div className="machine-detail-modal-chart-rpm-title">RPM</div>
				<div className="machine-detail-modal-chart-rpm-area">
					<ResponsiveContainer width="100%" height="100%">
						<AreaChart
							data={chartData}
							margin={{ top: 8, right: 8, left: 0, bottom: 28 }}
						>
							<defs>
								<linearGradient id={rpmFillId} x1="0" y1="0" x2="0" y2="1">
									<stop offset="0%" stopColor="#22c55e" stopOpacity={0.35} />
									<stop offset="100%" stopColor="#22c55e" stopOpacity={0.05} />
								</linearGradient>
							</defs>
							<CartesianGrid strokeDasharray="3 3" strokeOpacity={0.35} />
							<XAxis
								type="number"
								dataKey="timeMs"
								domain={[domainStart, domainEnd]}
								ticks={ticks}
								tick={{ fontSize: 9 }}
								tickFormatter={(v: number) => format24hAxisTick(v)}
								interval={0}
							/>
							<YAxis tick={{ fontSize: 10 }} width={44} domain={["auto", "auto"]} />
							<Tooltip
								contentStyle={{ fontSize: 12 }}
								labelFormatter={(_, payload) => {
									const p = payload?.[0]?.payload as MachineChartPoint | undefined;
									return p?.label ?? "";
								}}
								formatter={(value: number) => [
									`${new Intl.NumberFormat("pt-BR").format(value)} rpm`,
									"RPM",
								]}
							/>
							<Area
								type="monotone"
								dataKey="rpm"
								stroke="#22c55e"
								strokeWidth={2}
								fill={`url(#${rpmFillId})`}
							/>
						</AreaChart>
					</ResponsiveContainer>
				</div>
			</div>
		);
	}

	return (
		<div className="machine-detail-modal-chart-rpm">
			<div className="machine-detail-modal-chart-rpm-title">RPM</div>
			<div className="machine-detail-modal-chart-rpm-area">
				<ResponsiveContainer width="100%" height="100%">
					<AreaChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
						<defs>
							<linearGradient id={rpmFillId} x1="0" y1="0" x2="0" y2="1">
								<stop offset="0%" stopColor="#22c55e" stopOpacity={0.35} />
								<stop offset="100%" stopColor="#22c55e" stopOpacity={0.05} />
							</linearGradient>
						</defs>
						<CartesianGrid strokeDasharray="3 3" strokeOpacity={0.35} />
						<XAxis dataKey="label" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
						<YAxis tick={{ fontSize: 10 }} width={44} domain={["auto", "auto"]} />
						<Tooltip
							contentStyle={{ fontSize: 12 }}
							formatter={(value: number) => [
								`${new Intl.NumberFormat("pt-BR").format(value)} rpm`,
								"RPM",
							]}
						/>
						<Area
							type="monotone"
							dataKey="rpm"
							stroke="#22c55e"
							strokeWidth={2}
							fill={`url(#${rpmFillId})`}
						/>
					</AreaChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
}
