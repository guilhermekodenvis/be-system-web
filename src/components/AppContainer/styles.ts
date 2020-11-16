import styled, { css } from 'styled-components'

interface ContainerProps {
	open: boolean
}

export const Container = styled.div<ContainerProps>`
	display: grid;
	grid-template-areas:
		'topbar topbar'
		'sidemenu main';
	overflow-y: hidden;
	max-width: 100%;
	min-height: 100vh;
	grid-template-columns: 288px auto;
	grid-template-rows: 72px auto;

	${props => {
		return (
			!props.open &&
			css`
				grid-template-areas:
					'topbar topbar'
					'main main';
			`
		)
	}}
`

export const TopBar = styled.header`
	z-index: 1;
	grid-area: topbar;
	width: 100vw;
	height: 72px;
	background: #382e63;
	display: grid;
	box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.25);

	grid-template-columns: 72px auto 72px;
	grid-template-areas: 'open title logout';

	.open-close {
		grid-area: open;
		display: flex;
		justify-content: center;
		align-items: center;
		cursor: pointer;
	}
	title {
		grid-area: title;
		font-size: 24px;
		font-family: Revalia, sans-serif;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
	}

	.logout {
		grid-area: logout;
		display: flex;
		justify-content: center;
		align-items: center;
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
