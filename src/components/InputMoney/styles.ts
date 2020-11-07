import styled from 'styled-components'

export const Container = styled.div`
	display: flex;
	flex-direction: column;
	margin: 0 0 24px 0;

	label {
		margin-left: 24px;
		margin-bottom: 4px;
	}

	div {
		display: flex;
		height: 54px;
		background: rgba(99, 83, 159, 0.33);
		border: 1px solid #e9e3ff;
		border-radius: 6px;
		align-items: center;

		p {
			width: 48px;
			padding-left: 12px;
			border-right: 1px solid #e9e3ff;
		}

		input {
			color: #e9e3ff;
			padding: 12px;
			background: transparent;
			width: calc(100% - 48px);
			border: none;
			/* transition: 0.2s ease; */
		}

		&:focus-within {
			border: 2px solid #e9e3ff;
		}
	}

	span {
		color: #c53030;
		font-size: 14px;
		align-self: flex-end;
		margin-right: 24px;
	}
`
