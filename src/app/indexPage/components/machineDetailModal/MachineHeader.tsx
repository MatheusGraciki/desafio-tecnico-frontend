import { FaArrowLeft, FaCircle } from "react-icons/fa6";

interface MachineHeaderProps {
  codigo: string;
  statusDotClass: string;
  onClose: () => void;
}

export function MachineHeader({ codigo, statusDotClass, onClose }: MachineHeaderProps) {
  return (
    <div className="machine-detail-modal-header">
      <div className="machine-detail-modal-header-left">
        <button
          type="button"
          className="btn btn-link text-body p-0 border-0"
          aria-label="Voltar"
          onClick={onClose}
        >
          <FaArrowLeft size={18} />
        </button>
        <FaCircle className={`${statusDotClass} flex-shrink-0`} size={10} aria-hidden />
        <h2 className="machine-detail-modal-title">{codigo}</h2>
      </div>
      <button type="button" className="btn-close" aria-label="Fechar" onClick={onClose} />
    </div>
  );
}
