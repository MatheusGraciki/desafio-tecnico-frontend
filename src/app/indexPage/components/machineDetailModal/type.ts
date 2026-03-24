import type { Machine } from "@/services/machines/type";

export type MachineDetailModalProps = {
	isOpen: boolean;
	machine: Machine | null;
	onClose: () => void;
};
