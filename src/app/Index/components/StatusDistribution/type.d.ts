export interface IndexPaginationProps {
	currentPage: number;
	totalPages: number;
	onPrevious: () => void;
	onNext: () => void;
	onSelectPage: (pageIndex: number) => void;
}
