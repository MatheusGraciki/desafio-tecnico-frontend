import { useMachineFilters } from "./useMachineFilters";
import { useMachineMetrics } from "./useMachineMetrics";
import { useMachinePagination } from "./useMachinePagination";
import { useMachinesData } from "./useMachinesData";

export function useIndexMachines() {
	// carregamento e atualização dos dados
	const { machines, loading, error, retryLoad, updateMachine } =
		useMachinesData();

	// filtros da listagem
	const {
		selectedLocation,
		setSelectedLocation,
		selectedMachineKind,
		setSelectedMachineKind,
		locations,
		machineKinds,
		filteredMachines,
	} = useMachineFilters(machines);

	// paginação da listagem
	const {
		machinesPage,
		setMachinesPage,
		machinesPerPage,
		totalMachinePages,
		paginatedMachines,
	} = useMachinePagination(filteredMachines, {
		selectedLocation,
		selectedMachineKind,
	});

	// métricas derivadas da dashboard
	const {
		statusCounts,
		alertsEnteredToday,
		criticalMachines,
		warningMachines,
	} = useMachineMetrics(filteredMachines);

	return {
		error,
		loading,
		retryLoad,
		selectedLocation,
		setSelectedLocation,
		selectedMachineKind,
		setSelectedMachineKind,
		machineKinds,
		machinesPage,
		setMachinesPage,
		machinesPerPage,
		totalMachinePages,
		locations,
		filteredMachines,
		paginatedMachines,
		statusCounts,
		alertsEnteredToday,
		criticalMachines,
		warningMachines,
		updateMachine,
	};
}
