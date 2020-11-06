import styled from 'styled-components'

export const Container = styled.div`
	display: flex;
	flex-direction: column;
	margin: 0 0 24px 0;

	label {
		margin-left: 24px;
		margin-bottom: 4px;
	}

	select {
		height: 54px;
		background-color: rgba(99, 83, 159, 0.33);
		border: 1px solid #e9e3ff;
		border-radius: 6px;
		color: #e9e3ff;
		padding: 12px;
	}

	span {
		color: #c53030;
		font-size: 14px;
		align-self: flex-end;
		margin-right: 24px;
	}
`
