/* eslint-disable indent */
import { shade } from 'polished'
import styled from 'styled-components'

export const Container = styled.div`
	padding: 12px;
	position: relative;

	@media (min-width: 420px) {
		display: grid;
		grid-template-areas:
			'total bt'
			'categories categories'
			'list list';
	}

	h1 {
		font-size: 32px;
		margin-top: 12px;
	}

	div {
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

	.total {
		@media (min-width: 420px) {
			grid-area: total;
			padding-bottom: 12px;
		}
	}

	.products-list {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		padding-bottom: 120px;

		@media (min-width: 420px) {
			padding-bottom: 12px;
			grid-area: list;
		}
	}

	.bt-send-to-kitchen {
		width: 100%;
		padding: 12px;
		position: fixed;
		bottom: 0;
		left: 0;
		background: #1f1449;

		@media (min-width: 420px) {
			position: relative;
			grid-area: bt;
			width: 240px;
			margin-left: auto;
		}
	}
`

export const Product = styled.div`
	width: calc(50% - 12px);
	min-height: 144px;
	background: #382e63;
	margin-top: 24px;
	border-radius: 12px;
	padding-bottom: 12px;
	padding-right: 12px;
	display: flex;
	flex-direction: column;

	strong {
		align-self: flex-start;
	}

	p {
		display: flex;
		width: 100%;
		padding-left: 12px;
		justify-content: space-between;
	}

	.quantity {
		flex: 1;
		display: flex;
		width: 100%;
		padding-left: 12px;
		align-items: baseline;
		justify-content: space-between;
		span {
			padding: 0 6px;
		}
		button {
			border: none;
			color: #e9e3ff;
			width: 36px;
			height: 30px;
			border-radius: 6px;
			display: flex;
			align-items: center;
			justify-content: center;

			&.less {
				background: #d95267;
				margin-left: auto;
				&:hover {
					background: ${shade(0.2, '#d95267')};
				}
			}
			&.more {
				background: #2db27b;
				&:hover {
					background: ${shade(0.2, '#2db27b')};
				}
			}
		}
	}
`

export const BottomNavigation = styled.div`
	background: #382e63;
	position: fixed;
	left: 0;
	bottom: 72px;
	max-width: 100%;
	padding: 0 !important;
	display: flex;
	align-items: center !important;
	filter: drop-shadow(0px -6px 12px rgba(0, 0, 0, 0.25));

	ul {
		min-width: 100%;
		list-style: none;
		display: flex;
		align-items: center;
		white-space: nowrap;
		height: 48px;
		overflow-y: scroll;
		li {
			padding: 12px 24px;
			display: inline;
			height: 100%;
			width: 100%;
			text-transform: uppercase;
			letter-spacing: 1px;
			transition: 0.2s;
			cursor: pointer;
			text-align: center;

			&.active {
				border-bottom: 6px solid #e36414;
				font-weight: bold;
			}
		}
	}

	@media (min-width: 420px) {
		position: relative;
		bottom: 0;
		grid-area: categories;

		filter: none;

		ul {
			overflow-y: hidden;
		}
	}
`
