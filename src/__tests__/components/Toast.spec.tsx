import React from 'react'
import { fireEvent, render, waitFor } from '@testing-library/react'
import Toast from '../../components/Toast'
import 'jest-styled-components'

describe('Button component', () => {
	it('should be able to render a simple toast', async () => {
		const { getByTestId } = render(<Toast label="Teste" />)
		await waitFor(() => {
			expect(getByTestId('toast-component')).toBeTruthy()
		})
	})

	it('should be able to show simple toast', async () => {
		const { getByText, getByTestId } = render(<Toast label="Teste" />)
		const toast = getByTestId('toast-component')
		fireEvent.mouseOver(toast)
		await waitFor(() => {
			expect(getByText('Teste')).toBeTruthy()
		})
	})

	it('should be able to hide simple toast', async () => {
		const { getByTestId } = render(<Toast label="Teste" />)
		const toast = getByTestId('toast-component')
		fireEvent.mouseOver(toast)
		fireEvent.mouseOut(toast)
		await waitFor(() => {
			expect(toast).toHaveStyleRule('display: none')
		})
	})
})
