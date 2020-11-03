import styled from 'styled-components'
import { shade } from 'polished'

export const Container = styled.div`
	padding: 12px;
	position: relative;

	h1 {
		font-size: 32px;
		margin-top: 12px;
	}

	.tables {
		display: flex;
		flex-wrap: wrap;
		flex-direction: row;
		justify-content: space-between;
	}
`

export const TableRequest = styled.div`
	width: calc(50% - 12px);
	min-height: 130px;
	background: #382e63;
	margin-top: 24px;
	border-radius: 12px;
	padding: 12px;
	display: flex;
	flex-direction: column;
`

export const FAB = styled.button`
	width: 60px;
	height: 60px;
	border-radius: 50%;
	border: none;
	background: #e36414;
	color: #e9e3ff;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0px 4px 2px 2px rgba(0, 0, 0, 0.25);
	bottom: 24px;
	right: 24px;
	position: fixed;
	transition: 0.2s;
	&:hover {
		background: ${shade(0.2, '#e36414')};
	}
`

export const ButtonGroup = styled.div`
	display: flex;
	justify-content: space-around;

	button {
		width: 48px;
		height: 36px;
		background: #4c60e6;
		border-radius: 6px;
		border: none;
		margin-top: 12px;
		transition: 0.2s;
		display: flex;
		align-items: center;
		justify-content: center;

		&:first-child {
			background: #ba4ff0;
			&:hover {
				background: ${shade(0.2, '#ba4ff0')};
			}
		}

		&:last-child {
			background: #e6be4c;
			&:hover {
				background: ${shade(0.2, '#E6BE4C')};
			}
		}

		&:hover {
			background: ${shade(0.2, '#4c60e6')};
		}

		svg {
			color: #e9e3ff;
		}
	}
`
