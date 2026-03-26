import { useCallback, useEffect, useState } from "react";

import { ApiError } from "@/helper/apiError";
import { fetchMachines } from "@/services/machines";
import type { Machine } from "@/services/machines/type";

export function useMachinesData() {
	const [machines, setMachines] = useState<Machine[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [reloadKey, setReloadKey] = useState(0);

	const loadMachines = useCallback(async () => {
		setLoading(true);
		setError(null);

		try {
			const data = await fetchMachines();

			if (!Array.isArray(data)) {
				throw new ApiError(
					"Resposta inválida da API (esperado lista de máquinas).",
				);
			}

			setMachines(data);
		} catch (err) {
			setMachines([]);
			setError(
				err instanceof ApiError
					? err.message
					: "Não foi possível carregar as máquinas.",
			);
		} finally {
			setLoading(false);
		}
	}, []);

	const retryLoad = useCallback(() => {
		setReloadKey((value) => value + 1);
	}, []);

	const updateMachine = useCallback((updatedMachine: Machine) => {
		setMachines((prev) =>
			prev.map((machine) =>
				String(machine.id) === String(updatedMachine.id)
					? { ...machine, ...updatedMachine }
					: machine,
			),
		);
	}, []);

	useEffect(() => {
		void loadMachines();
	}, [loadMachines, reloadKey]);

	return {
		machines,
		loading,
		error,
		retryLoad,
		updateMachine,
	};
}
