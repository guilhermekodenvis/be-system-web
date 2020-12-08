import { render, waitFor, screen, fireEvent } from '@testing-library/react'
import MockAdapter from 'axios-mock-adapter'
import React from 'react'
import OpenCashier from '../../pages/OpenCashier'
import api from '../../services/api'

const mockedChangeModule = jest.fn()
const mockedHistoryPush = jest.fn()
const mockedAddSnack = jest.fn()

jest.mock('../../hooks/module', () => {
	return {
		useModule: () => ({
			changeModule: mockedChangeModule,
		}),
	}
})

jest.mock('react-router-dom', () => {
	return {
		useHistory: () => ({
			push: mockedHistoryPush,
		}),
	}
})

jest.mock('../../hooks/snack', () => {
	return {
		useSnack: () => ({
			addSnack: mockedAddSnack,
		}),
	}
})

const apiMock = new MockAdapter(api)

describe('OpenCashier page', () => {
	beforeEach(() => {
		mockedAddSnack.mockClear()
		mockedChangeModule.mockClear()
		mockedHistoryPush.mockClear()
	})
	it('it should be able to render correctly tha page', async () => {
		render(<OpenCashier />)

		await waitFor(() => {
			expect(screen.getByTestId('open-cashier-page'))
			expect(mockedChangeModule).toHaveBeenCalledWith('cashier')
		})
	})

	it('should be able to go to dashboard if clicked cancel', async () => {
		render(<OpenCashier />)

		const cancelButton = screen.getByTestId('cancel-button')
		fireEvent.click(cancelButton)
		await waitFor(() => {
			expect(mockedHistoryPush).toHaveBeenCalledWith('/dashboard')
		})
	})

	it('should be able to open the cashier', async () => {
		render(<OpenCashier />)

		apiMock.onPost('/cashier-moviments/open').reply(200, {})

		const moneyInput = screen.getByTestId('money-input')
		const passwordInput = screen.getByTestId('password-input')
		const openCashierButton = screen.getByTestId('open-cashier-button')

		fireEvent.change(moneyInput, { target: { value: 10 } })
		fireEvent.change(passwordInput, { target: { value: '123123' } })
		fireEvent.click(openCashierButton)

		await waitFor(() => {
			expect(mockedAddSnack).toHaveBeenCalled()
			expect(mockedHistoryPush).toHaveBeenCalledWith('/caixa')
		})
	})

	it('should be able to show if some error in the backend occurred', async () => {
		render(<OpenCashier />)

		apiMock.onPost('/cashier-moviments/open').reply(400, {})

		const moneyInput = screen.getByTestId('money-input')
		const passwordInput = screen.getByTestId('password-input')
		const openCashierButton = screen.getByTestId('open-cashier-button')

		fireEvent.change(moneyInput, { target: { value: 10 } })
		fireEvent.change(passwordInput, { target: { value: 'wrong-password' } })
		fireEvent.click(openCashierButton)

		await waitFor(() => {
			expect(mockedAddSnack).toHaveBeenCalled()
			expect(mockedHistoryPush).not.toHaveBeenCalledWith('/caixa')
		})
	})

	it('should be able to send data if the money is not numeric', async () => {
		render(<OpenCashier />)

		apiMock.onPost('/cashier-moviments/open').reply(400, {})

		const moneyInput = screen.getByTestId('money-input')
		const passwordInput = screen.getByTestId('password-input')
		const openCashierButton = screen.getByTestId('open-cashier-button')

		fireEvent.change(moneyInput, { target: { value: 'non-numeric-value' } })
		fireEvent.change(passwordInput, { target: { value: '123123' } })
		fireEvent.click(openCashierButton)

		await waitFor(() => {
			expect(mockedAddSnack).not.toHaveBeenCalled()
			expect(mockedHistoryPush).not.toHaveBeenCalledWith('/caixa')
		})
	})
})
