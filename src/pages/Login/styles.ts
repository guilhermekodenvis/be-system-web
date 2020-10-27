import styled from 'styled-components'

export const ButtonGroup = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding-top: 24px;

	a {
		color: #e36414;
	}
`

export const Header = styled.h1`
	margin-bottom: 24px;
`

export const Bottom = styled.div`
	flex: 1;
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;

	button {
		position: absolute;
		bottom: 0;
	}
`

export const Container = styled.div`
	padding: 24px;
	display: flex;
	flex-direction: column;
	flex: 1;
`
