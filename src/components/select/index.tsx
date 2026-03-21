import type { ChangeEvent } from "react";
import { Input } from "reactstrap";
import type { SelectProps } from "./type";
import "./index.scss";

function Select({
	value,
	options,
	onChange,
	onBlur,
	placeholder,
	isDisabled = false,
	className = "",
	id,
	name,
	ariaLabel,
	icon,
}: SelectProps) {
	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		const nextValue = event.target.value;
		const selectedOption = options.find((option) => option.value === nextValue);
		onChange?.(nextValue, selectedOption);
	};

	return (
		<div className="select-wrapper">
			{icon ? <div className={"select-icon"}>{icon}</div> : null}
			<Input
				type="select"
				id={id}
				name={name}
				value={value}
				onChange={handleChange}
				onBlur={onBlur}
				disabled={isDisabled}
				aria-label={ariaLabel}
				className={`select ${className} ${icon ? "has-icon" : ""}`}
			>
				{placeholder ? <option value="">{placeholder}</option> : null}
				{options.map((option) => (
					<option key={option.value} value={option.value} disabled={option.disabled}>
						{option.label}
					</option>
				))}
			</Input>
		</div>
	);
}

export default Select;
