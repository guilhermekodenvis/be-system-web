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
		display: grid;
		grid-template-areas:
			'left right'
			'button button';

		.left {
			grid-area: left;
		}

		.right {
			grid-area: right;
			display: flex;
			flex: 1;
			justify-content: space-between;
		}

		.button-group {
			grid-area: button;
			display: flex;
			justify-content: flex-end;

			& > button:first-child {
				margin-right: 24px;
			}
		}
	}
`
