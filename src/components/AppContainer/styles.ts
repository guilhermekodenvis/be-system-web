import styled, { keyframes } from 'styled-components'

export const Container = styled.div``

export const SideBar = styled.aside``

export const TopBar = styled.header`
	width: 100%;
	height: 72px;
	background: #382e63;
	display: flex;
	justify-content: center;
	align-items: center;
	box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.25);

	title {
		font-size: 24px;
		font-family: Revalia, sans-serif;
		display: block;
		cursor: pointer;
	}
`

export const Main = styled.main`
	margin: 0 auto;
	width: 100%;

	@media (min-width: 1164px) {
		width: 1164px;
	}
`
