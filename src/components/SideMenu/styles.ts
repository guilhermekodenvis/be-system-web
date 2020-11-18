import styled, { css } from 'styled-components'

interface MenuItemProps {
	active?: boolean
}

interface ContainerProps {
	open: boolean
}

export const Container = styled.aside<ContainerProps>`
	background: #382e63;
	height: max(calc(100vh - 72px), 100%);
	grid-area: sidemenu;
	z-index: 0;

	${props => {
		return props.open
			? css`
					display: auto;
			  `
			: css`
					display: none;
			  `
	}}/* position: fixed; */
`

export const Profile = styled.div`
	/* margin: 36px; */
	display: flex;
	margin: 36px;
	> div {
		border-bottom: 1px solid rgba(233, 227, 255, 0.31);
		flex: 1;

		.top {
			display: flex;
			flex: 1;
			justify-content: space-between;
			align-items: flex-start;
			img {
				width: 120px;
				height: 120px;
				border-radius: 50%;
				border: 2px solid #e36414;
			}

			svg {
				color: #4c60e6;
				cursor: pointer;
			}
		}
		strong {
			display: inline-block;
			margin-top: 36px;
			margin-bottom: 12px;
			font-size: 22px;
		}

		p {
			margin-bottom: 24px;
		}
	}
`

export const MenuList = styled.ul`
	/* margin-left: 36px; */
	list-style: none;
`

export const MenuItem = styled.li<MenuItemProps>`
	font-size: 24px;
	text-align: left;
	margin: 12px 0;
	padding: 24px 0 24px 36px;
	position: relative;
	cursor: pointer;

	svg {
		margin-right: 24px;
	}

	${props => {
		return (
			props.active &&
			css`
				background: #e36414;
				box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.25);

				&::after {
					content: '';
					width: 77px;
					height: 100%;
					background: #e36414;
					position: absolute;
					right: -36px;
					top: 0;
					border-radius: 50%;
				}
			`
		)
	}}
`
