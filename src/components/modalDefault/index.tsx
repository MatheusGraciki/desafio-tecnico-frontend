import { Modal, ModalHeader, ModalBody } from "reactstrap";
import type { ModalProps } from "./type";

export function ModalDefault({
	isOpen,
	onClose,
	title,
	children,
	className = "",
	contentClassName = "",
}: ModalProps) {
	return (
		<Modal
			isOpen={isOpen}
			toggle={onClose}
			centered
			scrollable
			className={className}
			contentClassName={contentClassName}
		>
			{title && (
				<ModalHeader toggle={onClose} className="border-bottom-0 pb-0">
					{title}
				</ModalHeader>
			)}
			<ModalBody className="pt-2">{children}</ModalBody>
		</Modal>
	);
}
