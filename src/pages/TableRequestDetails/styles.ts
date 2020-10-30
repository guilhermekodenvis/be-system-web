import styled from 'styled-components'

export const Container = styled.div`
	padding: 12px;
	h1 {
		font-size: 32px;
		margin-top: 12px;
	}

	div.top {
		display: flex;
		align-items: end;
		padding-top: 12px;
		strong {
			padding: 0 12px;
			flex: 1;
			display: flex;
			justify-content: space-between;
		}
	}
`

export const RequestList = styled.div`
	width: 100%;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	flex-wrap: wrap;
	padding-top: 24px;
`

export const RequestItem = styled.div`
	background: #382e63;
	border-radius: 12px;
	padding: 12px;
	width: calc(50% - 12px);
	margin: 12px auto;
`
