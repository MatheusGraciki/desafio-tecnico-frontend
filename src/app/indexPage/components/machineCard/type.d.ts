import type { Machine } from "@/services/machines/type";

export interface MachineCardProps {
	machine: Machine;
	onSelect?: (machine: Machine) => void;
}