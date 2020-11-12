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
