import styled, { css } from 'styled-components'

interface ContainerProps {
	hovered: boolean
}

export const Container = styled.div<ContainerProps>`
	position: relative;

	div {
		position: absolute;
		bottom: -36px;
		left: -36px;
		min-width: 118px;
		width: auto;
		padding-left: 12px;
		padding-right: 12px;
		height: 36px;
		background: #10053e;
		display: none;
		color: #e9e3ff;
		box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
		border-radius: 6px;
		${props =>
			props.hovered &&
			css`
				display: block;
				display: flex;
				align-items: center;
				justify-content: center;
			`}
	}
`
