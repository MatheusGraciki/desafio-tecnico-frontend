export interface IndexFiltersProps {
	selectedLocation: string;
	locations: string[];
	onLocationChange: (value: string) => void;
	selectedMachineKind: string;
	machineKinds: string[];
	onMachineKindChange: (value: string) => void;
}