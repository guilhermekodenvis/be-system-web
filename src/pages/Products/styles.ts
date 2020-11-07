import styled from 'styled-components'

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
		transition: 0.2s;

		&:hover {
			box-shadow: 0px 3px 12px 2px rgba(0, 0, 0, 0.25);
			transform: scale(1.012);
		}

		td {
			background: #382e63;
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
