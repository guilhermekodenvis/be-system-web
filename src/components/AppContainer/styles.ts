import styled from 'styled-components'

export const Container = styled.div``

export const SideBar = styled.aside``

export const TopBar = styled.header`
	width: 100%;
	height: 72px;
	background: #10053e;
	display: flex;
	justify-content: center;
	align-items: center;
	box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);

	title {
		font-size: 24px;
		font-family: Revalia, sans-serif;
		display: block;
		cursor: pointer;
	}
`

export const Main = styled.main`
	width: 1164px;
	margin: 0 auto;
`
