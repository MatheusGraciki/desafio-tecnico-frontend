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

export type MachineChartPoint = {
	label: string;
	rpm: number;
};

interface MachineChartProps {
	chartData: MachineChartPoint[];
}

export function MachineChart({ chartData }: MachineChartProps) {
	const rpmFillId = useId().replace(/:/g, "");

	if (!chartData.length) {
		return (
			<small className="text-secondary">Sem dados de série para o período.</small>
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
