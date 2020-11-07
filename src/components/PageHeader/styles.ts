import styled from 'styled-components'

export const Container = styled.div`
	padding: 26px 92px;
	display: flex;
	flex-direction: column;
	width: 776px;
	margin: 36px auto;

	h1 {
		font-size: 36px;
	}

	> div {
		display: flex;
		align-items: center;
		justify-content: space-between;

		button {
			width: 120px;
			height: 48px;
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
