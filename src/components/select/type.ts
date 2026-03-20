export interface SelectOption {
	value: string;
	label: string;
	disabled?: boolean;
}

export interface SelectProps {
	value: string;
	options: SelectOption[];
	onChange?: (value: string, option?: SelectOption) => void;
	onBlur?: () => void;
	placeholder?: string;
	isDisabled?: boolean;
	className?: string;
	id?: string;
	name?: string;
	ariaLabel?: string;
}
