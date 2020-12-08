import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import MockAdapter from 'axios-mock-adapter'
import React from 'react'
import { act } from 'react-dom/test-utils'
import CloseCashier from '../../pages/CloseCashier'
import api from '../../services/api'

const mockedChangeModule = jest.fn()
const mockedAddSnack = jest.fn()
const mockedHistoryPush = jest.fn()

const apiMock = new MockAdapter(api)
const apiResponseCashierMoviments = {
	cashier_moviments: [
		{
			action: 0,
			value: 10,
		},
		{
			action: 1,
			value: 10,
		},
		{
			action: 2,
			value: 10,
		},
		{
			action: 3,
			value: 10,
		},
		{
			action: 4,
			value: 10,
		},
		{
			action: 5,
			value: 10,
		},
	],
	money_in_cashier: 0,
	brute_total_money: 30,
}

jest.mock('../../hooks/module', () => {
	return {
		useModule: () => {
			return {
				changeModule: mockedChangeModule,
			}
		},
	}
})
jest.mock('../../hooks/snack', () => {
	return {
		useSnack: () => {
			return {
				addSnack: mockedAddSnack,
			}
		},
	}
})
jest.mock('react-router-dom', () => {
	return {
		useHistory: () => ({
			push: mockedHistoryPush,
		}),
	}
})

describe('CloseCashier page', () => {
	beforeEach(() => {
		mockedAddSnack.mockClear()
		mockedHistoryPush.mockClear()
	})
	it('should be able to render correctly the page and set the module', async () => {
		apiMock.onGet('/cashier').reply(200, apiResponseCashierMoviments)

		await act(async () => {
			render(<CloseCashier />)
		})

		await waitFor(() => {
			expect(screen.getByTestId('close-cashier-page')).toBeTruthy()
		})
	})

	it('should be able to see all moviments of the day', async () => {
		apiMock.onGet('/cashier').reply(200, apiResponseCashierMoviments)

		await act(async () => {
			render(<CloseCashier />)
		})

		await waitFor(() => {
			expect(screen.queryAllByText('R$ 10,00').length).toEqual(6)
		})
	})

	it('should be able to close the cashier', async () => {
		apiMock.onGet('/cashier').reply(200, apiResponseCashierMoviments)
		apiMock.onPost('/cashier/close').reply(201, {})

		await act(async () => {
			render(<CloseCashier />)
		})

		const btCloseCashier = screen.getByTestId('close-cashier-button')
		fireEvent.click(btCloseCashier)

		await waitFor(() => {
			expect(mockedAddSnack).toHaveBeenCalledTimes(1)
			expect(mockedHistoryPush).toHaveBeenCalledWith('/cashier')
		})
	})

	it('should be able to show when some error occurred in the backend', async () => {
		apiMock.onGet('/cashier').reply(400, {})
		apiMock.onPost('/cashier/close').reply(400, {})

		await act(async () => {
			render(<CloseCashier />)
		})
		await waitFor(() => {
			expect(mockedAddSnack).toHaveBeenCalledTimes(1)
		})

		mockedAddSnack.mockClear()

		const btCloseCashier = screen.getByTestId('close-cashier-button')
		fireEvent.click(btCloseCashier)

		await waitFor(() => {
			expect(mockedAddSnack).toHaveBeenCalledTimes(1)
			expect(mockedHistoryPush).not.toHaveBeenCalledWith('/cashier')
		})
	})
})
