import {
	Area,
	AreaChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

interface MachineChartProps {
	chartData: { label: string; temperatura: number }[];
	tempGradientId: string;
}

export function MachineChart({ chartData, tempGradientId }: MachineChartProps) {
	return (
		<div className="machine-detail-modal-chart">
			{chartData.length ? (
				<ResponsiveContainer width="100%" height="100%">
					<AreaChart
						data={chartData}
						margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
					>
						<defs>
							<linearGradient id={tempGradientId} x1="0" y1="0" x2="0" y2="1">
								<stop offset="0%" stopColor="#ef4444" stopOpacity={0.45} />
								<stop offset="55%" stopColor="#eab308" stopOpacity={0.25} />
								<stop offset="100%" stopColor="#22c55e" stopOpacity={0.15} />
							</linearGradient>
						</defs>
						<CartesianGrid strokeDasharray="3 3" strokeOpacity={0.35} />
						<XAxis
							dataKey="label"
							tick={{ fontSize: 10 }}
							interval="preserveStartEnd"
						/>
						<YAxis
							tick={{ fontSize: 10 }}
							width={44}
							domain={["auto", "auto"]}
						/>
						<Tooltip
							contentStyle={{ fontSize: 12 }}
							formatter={(value: number) => [`${value} °C`, "Temperatura"]}
						/>
						<Area
							type="monotone"
							dataKey="temperatura"
							stroke="#22c55e"
							strokeWidth={2}
							fill={`url(#${tempGradientId})`}
						/>
					</AreaChart>
				</ResponsiveContainer>
			) : (
				<small className="text-secondary">
					Sem dados de série para o período.
				</small>
			)}
		</div>
	);
}
