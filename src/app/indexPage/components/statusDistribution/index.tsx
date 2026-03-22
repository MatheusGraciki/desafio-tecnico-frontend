import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import type { IndexPaginationProps } from "./type";
import "./styles.scss";

const MAX_DOTS = 8;

function getVisiblePages(currentPage: number, totalPages: number) {
	if (totalPages <= MAX_DOTS) {
		return Array.from({ length: totalPages }, (_, index) => index);
	}

	const half = Math.floor(MAX_DOTS / 2);
	let start = Math.max(0, currentPage - half);
	let end = start + MAX_DOTS;

	if (end > totalPages) {
		end = totalPages;
		start = end - MAX_DOTS;
	}

	return Array.from({ length: end - start }, (_, index) => start + index);
}

export function StatusDistribution({
	currentPage,
	totalPages,
	onPrevious,
	onNext,
	onSelectPage,
}: IndexPaginationProps) {
	const visiblePages = getVisiblePages(currentPage, totalPages);

	return (
		<div className="index-pagination-control">
			<div className="index-pagination-dots" aria-hidden="true">
				{visiblePages.map((pageIndex) => (
					<button
						key={pageIndex}
						type="button"
						className={`index-pagination-dot ${pageIndex === currentPage ? "is-active" : ""}`}
						onClick={() => onSelectPage(pageIndex)}
						aria-label={`Ir para página ${pageIndex + 1}`}
						aria-current={pageIndex === currentPage ? "page" : undefined}
					/>
				))}
			</div>

			<div className="index-pagination-actions" role="group" aria-label="Navegação de páginas">
				<button
					type="button"
					className="index-pagination-action"
					onClick={onPrevious}
					aria-label="Página anterior"
				>
					<FaChevronLeft size={12} />
				</button>
				<button
					type="button"
					className="index-pagination-action"
					onClick={onNext}
					aria-label="Próxima página"
				>
					<FaChevronRight size={12} />
				</button>
			</div>
		</div>
	);
}