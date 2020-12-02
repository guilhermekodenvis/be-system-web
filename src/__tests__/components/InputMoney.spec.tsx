import { render, waitFor } from '@testing-library/react'
import React from 'react'
import InputMoney from '../../components/InputMoney'

jest.mock('@unform/core', () => {
	return {
		useField() {
			return {
				fieldName: 'value',
				defaultValue: '',
				error: 'testing error',
				registerField: jest.fn(),
			}
		},
	}
})

describe('InputMoney component', () => {
	it('should be able to render the component', async () => {
		const { getByTestId } = render(<InputMoney label="Valor" name="value" />)
		await waitFor(() => {
			expect(getByTestId('input-money-component')).toBeTruthy()
		})
	})

	it('should be able to render the component and show the R$ in the screen', async () => {
		const { getByText } = render(<InputMoney label="Valor" name="value" />)
		await waitFor(() => {
			expect(getByText('R$')).toBeTruthy()
		})
	})

	it('should be able to display the error message', async () => {
		const { getByText } = render(<InputMoney label="Valor" name="value" />)

		await waitFor(() => {
			expect(getByText('testing error')).toBeTruthy()
		})
	})
})
