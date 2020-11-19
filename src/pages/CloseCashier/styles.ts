import styled from 'styled-components'

export const Container = styled.div`
	display: grid;
	grid-template-columns: 5fr 7fr;
	> div:last-child {
		margin: 24px;

		button {
			display: block;
			width: 267px;
			margin-left: auto;
		}
	}
`

export const Details = styled.div`
	width: 100%;
	height: auto;
	padding: 24px 48px;
	background: #382e63;
	border-radius: 12px;

	div {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: baseline;

		strong {
			font-size: 20px;
		}

		p {
			font-size: 18px;
		}

		+ div {
			margin-top: 24px;
		}
	}
`

export const Relatory = styled.div`
	h2 {
		margin: 36px auto 24px 24px;
	}

	table {
		width: 100%;
		border-collapse: separate;
		border-spacing: 0 12px;
		th {
			text-align: left;
			&:first-child {
				padding-left: 24px;
			}
		}

		td {
			background: #382e63;
			height: 60px;
			&:first-child {
				border-radius: 12px 0 0 12px;
				padding-left: 24px;
			}
			&:last-child {
				border-radius: 0 12px 12px 0;
			}
		}
	}
`

export const Right = styled.div`
	border-radius: 12px;
	padding: 24px 36px;
	max-width: 100%;
	height: auto;
	background: #382e63;
	h2 {
		transform: translateY(-12px) translateX(-12px);
	}
`
