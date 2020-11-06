import styled from 'styled-components'

export const Container = styled.div`
	width: 960px;
	height: auto;
	margin: 36px auto;
	background: #261b51;
	box-shadow: 0px 3px 12px 2px rgba(0, 0, 0, 0.25);
	border-radius: 12px;
	padding-bottom: 36px;
	margin-bottom: 48px;
`

export const Header = styled.div`
	padding: 26px 92px;
	display: flex;
	flex-direction: column;

	h1 {
		font-size: 36px;
	}

	> div {
		display: flex;
		align-items: center;
		justify-content: space-between;

		button {
			width: 180px;
			height: 60px;
			background: transparent;
			border: none;
			color: #f7e8ff;
			display: flex;
			align-items: center;
			justify-content: space-around;

			svg {
				width: 24px;
				height: 24px;
			}
		}
	}
`

export const Table = styled.table`
	max-width: 960px;
	margin: 0 auto;
	width: 100%;
	border-collapse: separate;
	border-spacing: 0 12px;

	thead tr th {
		text-align: start;
		padding-bottom: 24px;
	}

	thead tr th::before {
		content: '';
		width: 24px;
		display: inline-block;
	}

	tbody tr {
		box-shadow: 0px 1px 6px rgba(0, 0, 0, 0.25);
		height: 60px;
		margin-bottom: 12px;
		transition: 0.2s;

		&:hover {
			box-shadow: 0px 3px 12px 2px rgba(0, 0, 0, 0.25);
		}

		td {
			background: #261b51;
			&::before {
				content: '';
				width: 24px;
				display: inline-block;
			}

			&:first-child {
				border-radius: 6px 0 0 6px;
				/* border: 1px solid black; */
			}

			&:last-child {
				border-radius: 0 6px 6px 0;
				/* border: 1px solid black; */
			}
		}
	}
`

export const ActionsGroup = styled.td`
	align-items: center;
	max-width: 15px;
	padding-bottom: 16px;
	> div {
		display: flex;
		align-items: center;
		justify-content: space-around;
		flex: 1;
	}

	svg {
		width: 24px;
		height: 24px;
		margin: 0 12px;
		cursor: pointer;
	}
`
