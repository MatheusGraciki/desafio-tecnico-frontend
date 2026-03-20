import { memo } from "react";
import { Box, Chip, Divider, Stack, Typography } from "@mui/material";
import {
	CheckCircle,
	ErrorOutline,
	WarningAmber,
	PauseCircle,
	SpeedOutlined,
	BoltOutlined,
	ThermostatOutlined,
} from "@mui/icons-material";
import { AppCard } from "@/components/common/Card";
import { getLastMachineData, getStatusInfo } from "../../helpers/machine-utils/index";
import type { MachineCardProps } from "./type";
import "./styles.scss";

const statusIconMap = {
	operando: CheckCircle,
	alerta: ErrorOutline,
	atencao: WarningAmber,
	parada: PauseCircle,
};

export const MachineCard = memo(function MachineCard({ machine }: MachineCardProps) {
	const statusInfo = getStatusInfo(machine.status);
	const lastData = getLastMachineData(machine);
	const StatusIcon = statusIconMap[statusInfo.category as keyof typeof statusIconMap];

	return (
		<AppCard>
			<Stack spacing={1} className="machine-card">
				<Box className="machine-card header">
					<Typography variant="subtitle1" fontWeight={600}>
						{machine.codigo}
					</Typography>
					<Typography variant="caption" color="text.secondary">
						Local: {machine.local}
					</Typography>
				</Box>

				<Divider />

				<Stack spacing={1.5}>
					<Box className="machine-card metrics">
						<Box display="flex" alignItems="center" gap={0.75} flex="1 1 auto" minWidth={80}>
							<SpeedOutlined fontSize="small" color="primary" />
							<Box>
								<Typography variant="body1" color="text.secondary" fontSize={11}>
									RPM
								</Typography>
								<Typography variant="subtitle2" fontWeight={600}>
									{lastData?.rpm ?? "--"}
								</Typography>
							</Box>
						</Box>

						<Box display="flex" alignItems="center" gap={0.75} flex="1 1 auto" minWidth={80}>
							<BoltOutlined fontSize="small" color="secondary" />
							<Box>
								<Typography variant="body2" color="text.secondary" fontSize={11}>
									Potência
								</Typography>
								<Typography variant="subtitle2" fontWeight={600}>
									{lastData?.potencia ?? "--"} W
								</Typography>
							</Box>
						</Box>

						<Box display="flex" alignItems="center" gap={0.75} flex="1 1 auto" minWidth={80}>
							<ThermostatOutlined fontSize="small" color="warning" />
							<Box>
								<Typography variant="body2" color="text.secondary" fontSize={11}>
									Temp
								</Typography>
								<Typography variant="subtitle2" fontWeight={600}>
									{lastData?.temperatura ?? "--"} °C
								</Typography>
							</Box>
						</Box>
					</Box>
				</Stack>

				<Divider />

				<Box className="machine-card status">
					<Stack direction="row" alignItems="center" gap={0.5}>
						<StatusIcon
							fontSize="small"
							color={statusInfo.chipColor !== "default" ? statusInfo.chipColor : "inherit"}
						/>
						<Chip
							label={statusInfo.category === "operando" ? "Operando" : machine.status}
							color={statusInfo.chipColor}
							size="small"
							variant="outlined"
						/>
					</Stack>

					{machine.alertas?.length ? (
						<Stack direction="row" spacing={0.5} useFlexGap flexWrap="wrap" flex={1}>
							{machine.alertas.slice(0, 2).map((alerta) => (
								<Chip
									key={`${machine.id}-${alerta}`}
									label={alerta}
									size="small"
									color="warning"
									variant="filled"
								/>
							))}
						</Stack>
					) : null}
				</Box>
			</Stack>
		</AppCard>
	);
});
