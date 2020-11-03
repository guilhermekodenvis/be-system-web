import { transparentize } from 'polished'
import styled from 'styled-components'

export const Container = styled.div``

export const Header = styled.div`
	width: 776px;
	margin: 48px auto;
`

export const Body = styled.div`
	display: grid;
	grid-template-columns: 5fr 7fr;
`

export const Left = styled.div`
	max-width: 460px;
	.payment-info {
		background: #382e63;
		/* height: 180px; */
		display: flex;
		font-size: 18px;
		flex-direction: column;
		padding: 24px 36px;
		border-radius: 12px;
		/* align-items: center; */
		div {
			display: flex;
			/* flex: 1; */
			width: 100%;
			justify-content: space-between;
			height: 36px;
			align-items: center;
		}
	}

	.title-payment {
		display: grid;
		grid-template-columns: 2fr 3fr;
		justify-content: space-around;
		margin: 24px 12px;
		button {
			width: 100%;
		}
	}

	form {
		display: grid;
		grid-template-columns: 2fr 2fr 1fr;
		align-items: flex-end;

		> div {
			margin: 0 12px;
			max-width: 176px;
			&:first-child {
				margin-left: 0;
			}
		}

		button {
			background: transparent;
			width: 72px;
			height: 54px;
			border: 1px solid #4c60e6;
			border-radius: 12px;
			display: flex;
			align-items: center;
			justify-content: center;
			color: #4c60e6;
			transition: 0.2s;

			&:hover {
				background: ${transparentize(0.8, '#4c60e6')};
			}
		}
	}
`

export const Right = styled.div`
	width: 100%;
	padding-left: 24px;

	h2 {
		margin-left: 24px;
		margin-bottom: 24px;
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

export const PaymentList = styled.ul`
	margin-top: 24px;
	li {
		display: grid;
		grid-template-columns: 2fr 3fr 1fr;
		align-items: center;
		background: #382e63;
		border-radius: 12px;
		height: 60px;
		padding: 0 24px;
		& + li {
			margin-top: 12px;
		}
		button {
			background: transparent;
			border: none;
			color: #d95267;
			justify-self: flex-end;
		}
	}
`
