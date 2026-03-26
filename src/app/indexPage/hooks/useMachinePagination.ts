import { useEffect, useMemo, useState } from "react";

export const MACHINES_PER_PAGE = 9;

type FilterDeps = {
	selectedLocation: string;
	selectedMachineKind: string;
};

export function useMachinePagination<T>(
	items: T[],
	{ selectedLocation, selectedMachineKind }: FilterDeps,
) {
	const [machinesPage, setMachinesPage] = useState(0);

	const totalMachinePages = Math.max(
		1,
		Math.ceil(items.length / MACHINES_PER_PAGE),
	);

	const paginatedMachines = useMemo(
		() =>
			items.slice(
				machinesPage * MACHINES_PER_PAGE,
				machinesPage * MACHINES_PER_PAGE + MACHINES_PER_PAGE,
			),
		[items, machinesPage],
	);

	useEffect(() => {
		setMachinesPage(0);
	}, [selectedLocation, selectedMachineKind]);

	useEffect(() => {
		if (machinesPage > totalMachinePages - 1) {
			setMachinesPage(0);
		}
	}, [machinesPage, totalMachinePages]);

	return {
		machinesPage,
		setMachinesPage,
		machinesPerPage: MACHINES_PER_PAGE,
		totalMachinePages,
		paginatedMachines,
	};
}
