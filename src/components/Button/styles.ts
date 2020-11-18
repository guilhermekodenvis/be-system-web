import styled, { css } from 'styled-components'
import { shade, transparentize } from 'polished'

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
		props.disabled &&
		css`
			background: #958a8a;
			opacity: 0.8;
			cursor: not-allowed;
			&:hover {
				background: ${shade(0.2, '#958a8a')};
			}
		`}

	${props =>
		props.variant === 'cancel' &&
		css`
			background: transparent;
			border: 1px solid #d95267;
			color: #d95267;
			font-weight: bold;

			&:hover {
				background: ${transparentize(0.8, '#d95267')};
			}
		`}

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
