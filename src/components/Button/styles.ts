import styled, { css } from 'styled-components'
import { shade, opacify, transparentize } from 'polished'

import { ButtonProps } from './index'

export const Container = styled.button<Omit<ButtonProps, 'label'>>`
	text-transform: uppercase;
	background: #e36414;
	border-radius: 6px;
	width: 156px;
	height: 48px;
	color: #e9e3ff;
	border: none;
	transition: 0.2s;

	&:hover {
		background: ${shade(0.2, '#e36414')};
	}

	${props =>
		props.variant === 'secundary' &&
		css`
			background: #4c60e6;

			&:hover {
				background: ${shade(0.2, '#4c60e6')};
			}
		`}

	${props =>
		props.size === 'big' &&
		css`
			width: 100%;
		`}

		${props =>
		props.variant === 'secundary-outline' &&
		css`
			background: transparent;
			border: 1px solid #4c60e6;
			color: #4c60e6;
			font-weight: bold;

			&:hover {
				background: ${transparentize(0.8, shade(0.2, '#4c60e6'))};
			}
		`}
`
