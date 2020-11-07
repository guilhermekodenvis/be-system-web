import styled from 'styled-components'

export const Container = styled.div`
	width: 960px;
	height: auto;
	margin: 36px auto;
	background: #382e63;
	border-radius: 12px;

	form {
		max-width: 615px;
		margin: 0 auto;
		padding: 48px 0;

		.button-group {
			display: flex;
			justify-content: flex-end;

			& > button:first-child {
				margin-right: 24px;
			}
		}
	}
`

export const Header = styled.div`
	padding: 26px 92px;
	display: flex;
	flex-direction: column;

	h1 {
		font-size: 36px;
	}

	> div {
		display: flex;
		align-items: center;
		justify-content: space-between;

		button {
			width: 180px;
			height: 60px;
			background: transparent;
			border: none;
			color: #f7e8ff;
			display: flex;
			align-items: center;
			justify-content: space-around;

			svg {
				width: 24px;
				height: 24px;
			}
		}
	}
`
