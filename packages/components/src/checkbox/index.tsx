import * as React from "react";
import styled, { css } from "styled-components";
import { CheckboxIcon } from "./icon";
import { GlobalStyles } from "../app";
import COLORS from "../__utils/colors";
import { ChangeHandler, BlurHandler } from "../__utils/type";

interface CheckboxProps {
	name?: string;
	value?: boolean;
	disabled?: boolean;
	indeterminate?: boolean;
	onChange?: ChangeHandler<boolean>;
	onBlur?: BlurHandler<boolean>;
	className?: string;
	style?: React.CSSProperties;
	color?: string;
	outlineColor?: string;
	size?: number;
	children?: React.ReactNode;
}

export const Checkbox: React.FC<CheckboxProps> = ({
	name,
	value = false,
	disabled = false,
	onChange = () => {},
	onBlur = () => {},
	className = "",
	children,
	style,
	indeterminate = false,
	color = COLORS.PRIMARY,
	outlineColor = COLORS.BLACK,
	size = 24
}: CheckboxProps) => {
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onChange(e.target.checked, e.target.name);
		onBlur(e.target.checked);
	};

	const handleBlur = () => {
		if (inputEl.current) {
			onBlur(inputEl?.current?.checked);
		}
	};

	const inputEl = React.useRef<HTMLInputElement>(null);
	React.useEffect(() => {
		if (inputEl.current) {
			inputEl.current.indeterminate = indeterminate;
		}
	}, [indeterminate]);
	return (
		<label>
			<CheckboxContainer
				className={className}
				style={style}
				tabIndex={0}
				onBlur={handleBlur}
				disabled={disabled}
				onKeyUp={(e: any) => {
					// ENTER KEY
					if (e.keyCode === 13) {
						if (inputEl.current) {
							onChange(
								!inputEl?.current?.checked,
								inputEl?.current.name
							);
						}
					}
				}}
			>
				<HiddenCheckbox
					name={name}
					checked={value}
					onChange={handleChange}
					disabled={disabled}
					ref={inputEl}
					aria-label="tm-checkbox"
				/>
				<CheckboxIcon
					size={size}
					color={color}
					outlineColor={outlineColor}
					checked={value}
					indeterminate={indeterminate}
				/>

				{children !== undefined && (
					<span style={{ marginLeft: 8 }}>{children}</span>
				)}
			</CheckboxContainer>
		</label>
	);
};
const HiddenCheckbox = styled.input.attrs({ type: "checkbox" })`
	// Hide checkbox visually but remain accessible to screen readers.
	// Source: https://polished.js.org/docs/#hidevisually
	border: 0;
	clip: rect(0 0 0 0);
	clippath: inset(50%);
	height: 1px;
	width: 1px;
	margin: -1px;
	overflow: hidden;
	padding: 0;
	position: absolute;
	white-space: nowrap;
`;

const CheckboxContainer = styled.div<{
	onBlur: any;
	disabled?: boolean;
}>`
	${GlobalStyles};
	display: inline-block;
	vertical-align: middle;
	cursor: pointer;
	outline-color: ${COLORS.PRIMARY_LIGHT};
	${({ disabled }) =>
		disabled &&
		css`
			outline: none;
		`}
`;

export default Checkbox;
