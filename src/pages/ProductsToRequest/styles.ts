/* eslint-disable indent */
import { stripUnit } from 'polished'
import styled, { css } from 'styled-components'

export const Container = styled.div`
	padding: 12px;
	position: relative;

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

	.products-list {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
	}

	.bt-send-to-kitchen {
		width: 100%;
		padding: 12px;
		position: fixed;
		bottom: 0;
		left: 0;
	}
`

export const Product = styled.div`
	width: calc(50% - 12px);
	min-height: 130px;
	background: #382e63;
	margin-top: 24px;
	border-radius: 12px;
	padding-bottom: 12px;
	padding-right: 12px;
	display: flex;
	flex-direction: column;

	.quantity {
		flex: 1;
		display: flex;
		width: 100%;
		padding-left: 12px;
		align-items: center;
		span {
			padding: 0 6px;
		}
		button {
			border: none;
			color: #e9e3ff;
			width: 24px;
			height: 24px;
			border-radius: 6px;
			display: flex;
			align-items: center;
			justify-content: center;

			&.less {
				background: #d95267;
				margin-left: auto;
			}
			&.more {
				background: #2db27b;
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
		overflow-y: scroll;
		list-style: none;
		display: flex;
		align-items: center;
		white-space: nowrap;
		height: 48px;

		li {
			padding: 12px 24px;
			display: inline;
			height: 100%;
			width: 100%;
			text-transform: uppercase;
			letter-spacing: 1px;
			transition: 0.2s;
			cursor: pointer;

			&.active {
				border-bottom: 6px solid #e36414;
				font-weight: bold;
			}
		}
	}
`
