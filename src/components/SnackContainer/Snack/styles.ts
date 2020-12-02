import styled, { css, keyframes } from 'styled-components'
import { animated } from 'react-spring'

interface ContainerProps {
	type?: 'success' | 'danger' | 'warning'
	hasdescription: number
}

const toastTypeVariations = {
	success: css`
		background: #ceffea;
		color: #047546;

		.timer {
			background: #35d08f;
		}
	`,
	warning: css`
		background: #fff4d3;
		color: #765801;

		.timer {
			background: #e6be4c;
		}
	`,
	danger: css`
		background: #ffd1d8;
		color: #aa011c;
		.timer {
			background: #d95267;
		}
	`,
}

const teste = keyframes`

			from {
				width: 100%
			}
			to {
				width: 0
			}

`

export const Container = styled(animated.div)<ContainerProps>`
	width: 360px;
	position: relative;
	padding: 16px 30px 16px 16px;
	border-radius: 12px;
	box-shadow: 0px 6px 8px 4px rgba(0, 0, 0, 0.25);
	display: flex;
	min-height: 96px;
	align-items: center;

	strong {
		font-size: 20px;
	}

	& + div {
		margin-top: 8px;
	}
	${props => toastTypeVariations[props.type || 'warning']}
	> svg {
		margin: 4px 12px 0 0;
	}
	div {
		flex: 1;
		p {
			margin-top: 4px;
			font-size: 14px;
			opacity: 0.8;
			line-height: 20px;
		}
	}
	button {
		position: absolute;
		right: 16px;
		top: 19px;
		opacity: 0.6;
		border: 0;
		background: transparent;
		color: inherit;
	}
	${props =>
		!props.hasdescription &&
		css`
			align-items: center;
			svg {
				margin-top: 0;
			}
		`}

	.timer {
		width: 100%;
		height: 12px;
		position: absolute;
		bottom: 0;
		left: 0;
		border-radius: 0 0 12px 12px;
		animation: ${teste} 3s forwards;
	}
`
