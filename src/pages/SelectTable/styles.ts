import styled from 'styled-components'

export const Container = styled.div`
	/* position: relative; */
	background: #382e63;
	padding: 12px;
	flex: 1;
	border-radius: 12px;
	width: 998px;
	margin: 0 auto;
	padding-top: 24px;
	h1 {
		font-size: 32px;
		margin-top: 12px;
	}

	form {
		margin-top: 48px;

		button {
			position: fixed;
			bottom: 0;
			left: 0;
			margin: 12px;
			max-width: calc(100vw - 24px);
		}
	}

	@media (min-width: 410px) {
		form {
			width: 720px;
			margin: 0 auto;

			div {
				width: 240px;
			}
			button {
				position: unset;
				width: 136px;
				display: block;
				margin-left: auto;
			}
		}
	}
`
