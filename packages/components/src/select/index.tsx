import * as React from "react";
import styled, { css } from "styled-components";
import Dropdown, { SelectedOption, Option } from "./dropdown";
import Icon from "../icon";
import COLORS from "../__utils/colors";
import { GlobalStyles } from "../app";
import { ChangeHandler } from "../__utils/type";
import fetchDataFromJson, { SelectDataProps } from "../__utils/fetch-data-json";

interface SelectProps {
	name?: string;
	/** current value  */
	value?: any;
	/** show placeholder */
	placeholder?: string;
	/** callback for the change handler */
	onChange?: ChangeHandler<SelectedOption>;
	options?: SelectedOption[];
	data?: SelectDataProps;
	/** callback for the blur handler */
	onBlur?: (option: SelectedOption) => void;
	/** full width select */
	block?: boolean;
	disabled?: boolean;
	/** Wrapper styles */
	style?: React.CSSProperties;
	/** Select CTA styles */
	innerStyle?: React.CSSProperties;
	dropdownStyle?: React.CSSProperties;
}

export const Select = ({
	name,
	value,
	placeholder,
	onChange = () => {},
	options,
	data,
	onBlur = () => {},
	block = false,
	disabled = false,
	style,
	innerStyle,
	dropdownStyle
}: SelectProps) => {
	const selectEl = React.useRef<HTMLDivElement>(null);
	const [open, setOpen] = React.useState(false);
	const valueRef = React.useRef<any>(value);

	const handleSelect = (option: SelectedOption) => {
		const node = selectEl.current;
		node ? node.blur() : null;
		onBlur(option);
		onChange(option, name as string);
		setOpen(false);
		valueRef.current = option;
	};
	const [list, setList] = React.useState<SelectedOption[]>([
		{ text: "", value: "" }
	]);
	const [loading, setLoading] = React.useState(false);
	React.useEffect(() => {
		// Run this effect only when data object is present
		//  and open is true
		if (data && open) {
			setLoading(true);
			fetchDataFromJson(data).then((response: SelectedOption[]) => {
				setList(response);
				setLoading(false);
			});
		}
	}, [open]);

	const handleBlur = () => {
		setOpen(false);
		onBlur(valueRef.current);
	};
	const render = () => {
		if (!open) return null;
		if (data)
			return (
				<Dropdown
					loading={loading}
					onSelect={handleSelect}
					options={list}
				/>
			);
		return (
			<Dropdown
				loading={loading}
				options={options as SelectedOption[]}
				onSelect={handleSelect}
				style={dropdownStyle}
			/>
		);
	};
	return (
		<SelectWrapper
			ref={selectEl}
			name={name}
			block={block}
			tabIndex={0}
			disabled={disabled}
			onBlur={handleBlur}
			style={style}
		>
			<SelectCTA
				open={open}
				value={value}
				placeholder={placeholder}
				showArrow={true}
				disabled={disabled}
				onClick={() => setOpen(!open)}
				style={innerStyle}
			/>
			{render()}
		</SelectWrapper>
	);
};

const ArrowToggle = ({ open }: { open: boolean }) => (
	<>
		{open ? (
			<Icon name="keyboard_arrow_up" size={24} color={COLORS.GREY2} />
		) : (
			<Icon name="keyboard_arrow_down" size={24} color={COLORS.GREY2} />
		)}
	</>
);

interface SelectCTAProps {
	value: any;
	placeholder?: string;
	showArrow?: boolean;
	open?: boolean;
	disabled?: boolean;
	onClick?: () => void;
	style?: React.CSSProperties;
}

export const SelectCTA = ({
	value,
	placeholder,
	showArrow = false,
	open,
	disabled = false,
	onClick,
	style
}: SelectCTAProps) => {
	let displayValue;
	const handleSelectCTAClick = () => {
		onClick ? onClick() : null;
	};
	if (
		typeof value === "object" &&
		value instanceof Object &&
		!(value instanceof Array)
	) {
		displayValue = value.text;
	} else {
		displayValue = value;
	}

	return (
		<StyledSelectCTA
			onClick={handleSelectCTAClick}
			disabled={disabled}
			style={style}
		>
			{displayValue ? (
				<span>{displayValue}</span>
			) : (
				<span style={{ color: COLORS.GREY4 }}>{placeholder}</span>
			)}
			{showArrow ? <ArrowToggle open={open as boolean} /> : null}
		</StyledSelectCTA>
	);
};

export const SelectWrapper = styled.div<{
	block: boolean;
	name?: string;
	disabled?: boolean;
}>`
	${GlobalStyles};
	max-width: ${props => (props.block ? "100%" : "328px")};
	position: relative;
	background-color: ${COLORS.WHITE};
	outline: none;
	${props =>
		props.disabled &&
		css`
			outline: none;
		`};
`;
export const StyledSelectCTA = styled.div<{ disabled?: boolean }>`
	border: 0;
	padding: 8px 15px;
	border: 1px solid ${COLORS.GREY4};
	border-radius: 4px;
	color: ${COLORS.GREY1};
	max-width: 328px;
	font-size: 14px;
	&:hover {
		border-color: ${COLORS.PERSIAN_GREEN};
		cursor: pointer;
	}
	display: flex;
	justify-content: space-between;
	align-items: center;
	background-color: ${COLORS.WHITE};
	${props =>
		props.disabled &&
		css`
			pointer-events: none;
			opacity: 0.64;
			cursor: no-drop;
			background-color: ${COLORS.DISABLED};
			color: ${COLORS.GREY3};
			&:focus {
				outline: none;
			}
			::-webkit-input-placeholder {
				/* Chrome/Opera/Safari */
				color: ${COLORS.GREY3};
			}
			::-moz-placeholder {
				/* Firefox 19+ */
				color: ${COLORS.GREY3};
			}
			:-ms-input-placeholder {
				/* IE 10+ */
				color: ${COLORS.GREY3};
			}
			:-moz-placeholder {
				/* Firefox 18- */
				color: ${COLORS.GREY3};
			}
			::placeholder: {
				color: ${COLORS.GREY3};
			}
		`};
`;
Select.Option = Option;
export default Select;
