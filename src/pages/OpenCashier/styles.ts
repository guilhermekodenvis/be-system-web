import styled from 'styled-components'

export const Container = styled.div`
	width: 1164px;
	height: auto;
	margin: 36px auto;

	form {
		background: #382e63;
		border-radius: 12px;
		max-width: 960px;
		margin: 0 auto;
		padding: 48px;
		> div:first-child {
			width: 180px;
		}

		.button-group {
			display: flex;
			justify-content: flex-end;

			& > button:first-child {
				margin-right: 24px;
			}
		}
	}
`
