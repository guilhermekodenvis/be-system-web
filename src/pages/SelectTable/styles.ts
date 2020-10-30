import styled from 'styled-components'

export const Container = styled.div`
	/* position: relative; */
	padding: 12px;
	flex: 1;
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
`
