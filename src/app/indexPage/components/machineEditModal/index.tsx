import { useEffect, useState, type FormEvent } from "react";
import type { Machine } from "@/services/machines/type";
import { postUpdateMachine } from "@/services/machines";

import { ApiError } from "@/helper/apiError";
import { ModalDefault } from "@/components/modalDefault";
import { Alert, Button, FormGroup, Input, Label, Spinner } from "reactstrap";

export type MachineEditModalProps = {
	isOpen: boolean;
	machine: Machine | null;
	onClose: () => void;
	onSaved: (updated: Machine) => void;
};

type EditFormState = {
	nome: string;
	descricao: string;
	local: string;
};

function getInitialFormState(machine: Machine): EditFormState {
	return {
		nome: machine.nome?.trim() || machine.codigo || "",
		descricao: machine.descricao ?? "",
		local: machine.local ?? "",
	};
}

function buildUpdatedMachine(
	machine: Machine,
	form: EditFormState,
	response: Partial<Machine> | Machine | undefined,
): Machine {
	return {
		...machine,
		nome: form.nome,
		descricao: form.descricao,
		local: form.local,
		...(response && typeof response === "object" ? response : {}),
	};
}

export function MachineEditModal({
	isOpen,
	machine,
	onClose,
	onSaved,
}: MachineEditModalProps) {
	const [nome, setNome] = useState("");
	const [descricao, setDescricao] = useState("");
	const [local, setLocal] = useState("");
	const [saving, setSaving] = useState(false);
	const [feedback, setFeedback] = useState<string | null>(null);

	useEffect(() => {
		if (!machine) return;
		const initialState = getInitialFormState(machine);
		setNome(initialState.nome);
		setDescricao(initialState.descricao);
		setLocal(initialState.local);
		setFeedback(null);
	}, [machine]);

	async function handleSubmit(e: FormEvent) {
		e.preventDefault();
		if (!machine) return;

		const form = {
			nome: nome.trim(),
			descricao: descricao.trim(),
			local: local.trim(),
		};
		if (!form.nome || !form.local) {
			setFeedback("Nome e local são obrigatórios.");
			return;
		}

		setSaving(true);
		setFeedback(null);
		try {
			const updated = await postUpdateMachine(machine.id, form);
			const next = buildUpdatedMachine(machine, form, updated);
			onSaved(next);
			onClose();
		} catch (err) {
			setFeedback(
				err instanceof ApiError
					? err.message
					: "Não foi possível salvar as alterações.",
			);
		} finally {
			setSaving(false);
		}
	}

	function handleClose() {
		if (!saving) onClose();
	}

	const title = machine
		? `Editar máquina — ${machine.codigo}`
		: "Editar máquina";

	return (
		<ModalDefault isOpen={isOpen} onClose={handleClose} title={title}>
			{machine ? (
				<form onSubmit={handleSubmit}>
					<FormGroup>
						<Label for="machine-edit-nome">Nome</Label>
						<Input
							id="machine-edit-nome"
							value={nome}
							onChange={(e) => setNome(e.target.value)}
							autoComplete="off"
							disabled={saving}
						/>
					</FormGroup>
					<FormGroup>
						<Label for="machine-edit-local">Local</Label>
						<Input
							id="machine-edit-local"
							value={local}
							onChange={(e) => setLocal(e.target.value)}
							autoComplete="off"
							disabled={saving}
						/>
					</FormGroup>
					<FormGroup>
						<Label for="machine-edit-descricao">Descrição</Label>
						<Input
							id="machine-edit-descricao"
							type="textarea"
							rows={3}
							value={descricao}
							onChange={(e) => setDescricao(e.target.value)}
							disabled={saving}
						/>
					</FormGroup>
					{feedback ? (
						<Alert color="danger" className="py-2 small mb-3">
							{feedback}
						</Alert>
					) : null}
					<div className="d-flex gap-2 justify-content-end pt-2 align-items-center">
						<Button
							type="button"
							outline
							onClick={handleClose}
							disabled={saving}
						>
							Cancelar
						</Button>
						<Button type="submit" color="primary" disabled={saving}>
							{saving ? (
								<>
									<Spinner size="sm" className="me-2" />
									Salvando…
								</>
							) : (
								"Salvar"
							)}
						</Button>
					</div>
				</form>
			) : null}
		</ModalDefault>
	);
}
