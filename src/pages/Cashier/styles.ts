import styled from 'styled-components'

export const Container = styled.div``

export const Main = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr;
`

export const Left = styled.div`
	display: flex;
	flex-direction: column;
	button:first-child {
		margin-bottom: 12px;
		padding: 0 12px;
		width: auto;
		max-width: 200px;
	}

	ul {
		list-style: none;
		margin: 0;
		border: 0;
		padding: 0;
		display: flex;
		flex-wrap: wrap;

		li {
			h3 {
				font-size: 24px;
				transform: translateY(-12px);
			}

			width: 266px;
			height: auto;
			padding: 24px 12px;
			background: #382e63;
			border-radius: 12px;
			margin: 12px;
		}
	}
`

export const Right = styled.div`
	padding: 12px;
	> div {
		display: flex;
		justify-content: space-between;
		padding: 12px;
	}
`

export const ButtonGroup = styled.div`
	display: flex;
	align-items: flex-end;
	justify-content: space-around;
	padding-top: 12px;

	div {
		/* padding-top: 12px; */
		button {
			background: #ba4ff0;
			border: none;
			color: #e9e3ff;
			width: 60px !important;
			height: 60px;
			padding: 0 !important;
			margin-top: 12px;
			margin-bottom: 0px !important;
			border-radius: 12px;
		}

		&:last-child {
			button {
				background: #e6be4c;
			}
		}
	}
`

export const Table = styled.table`
	width: 100%;
	border-collapse: separate;
	border-spacing: 0 12px;
	th {
		text-align: left;
		&:first-child {
			padding-left: 24px;
		}
	}

	td {
		background: #382e63;
		height: 60px;
		&:first-child {
			border-radius: 12px 0 0 12px;
			padding-left: 24px;
		}
		&:last-child {
			border-radius: 0 12px 12px 0;
		}
	}
`
