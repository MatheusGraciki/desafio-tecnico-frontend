import type { ReactNode } from "react";

export type ModalProps = {
	isOpen: boolean;
	onClose: () => void;
	title?: ReactNode;
	children: ReactNode;
	className?: string;
	contentClassName?: string;
};
