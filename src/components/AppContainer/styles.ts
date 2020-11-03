import styled from 'styled-components'

export const Container = styled.div`
	display: grid;
	grid-template-areas:
		'topbar topbar'
		'sidemenu main';
	overflow-y: hidden;
	max-width: 100%;
	min-height: 100vh;
	grid-template-columns: 288px auto;
	grid-template-rows: 72px auto;
`

export const TopBar = styled.header`
	z-index: 1;
	grid-area: topbar;
	width: 100vw;
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
	grid-area: main;

	@media (min-width: calc(1164px)) {
		width: 1164px;
	}
`
