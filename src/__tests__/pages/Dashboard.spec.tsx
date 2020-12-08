import { render, act, screen, waitFor, fireEvent } from '@testing-library/react'
import MockAdapter from 'axios-mock-adapter'
import React from 'react'
import Dashboard from '../../pages/Dashboard'
import api from '../../services/api'

const mockedChangeModule = jest.fn()
const mockedAddSnack = jest.fn()
const mockedHistoryPush = jest.fn()

jest.mock('../../hooks/module', () => {
	return {
		useModule: () => ({
			changeModule: mockedChangeModule,
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

jest.mock('react-router-dom', () => {
	return {
		useHistory: () => ({
			push: mockedHistoryPush,
		}),
	}
})

const firstTestId = 'test-id-1'
const apiMock = new MockAdapter(api)
const apiResponse = [
	{ id: firstTestId, number: 1, total: 20 },
	{ id: 'test-id-2', number: 2, total: 20 },
	{ id: 'test-id-3', number: 3, total: 20 },
]

describe('Dashboard page', () => {
	beforeEach(() => {
		mockedChangeModule.mockClear()
		mockedAddSnack.mockClear()
		mockedHistoryPush.mockClear()
	})

	it('should be able to render correctly the page', async () => {
		apiMock.onGet('/cashier/situation').reply(200, { isOpen: true })
		apiMock.onGet('/table-request').reply(200, [])
		await act(async () => {
			render(<Dashboard />)
		})

		await waitFor(() => {
			expect(screen.getByTestId('dashboard-page')).toBeTruthy()
			expect(mockedChangeModule).toHaveBeenCalledWith('requests')
		})
	})

	it('should be able to show if the cashier is closed', async () => {
		apiMock.onGet('/cashier/situation').reply(200, { isOpen: false })
		apiMock.onGet('/table-request').reply(200, [])
		await act(async () => {
			render(<Dashboard />)
		})

		await waitFor(() => {
			expect(screen.queryByTestId('closed-cashier-message')).toBeTruthy()
			expect(screen.queryByTestId('empty-data-message')).toBeTruthy()
			expect(screen.queryByTestId('table-request')).toBeFalsy()
		})
	})

	it('should not be able to add a request if the cashier is not oppened', async () => {
		apiMock.onGet('/cashier/situation').reply(200, { isOpen: false })
		apiMock.onGet('/table-request').reply(200, [])
		await act(async () => {
			render(<Dashboard />)
		})

		const fabButton = screen.getByTestId('fab-button')
		fireEvent.click(fabButton)

		await waitFor(() => {
			expect(mockedHistoryPush).toHaveBeenCalledWith('/caixa')
			expect(mockedAddSnack).toHaveBeenCalled()
		})
	})

	it('should be able to show a message if dont recieve any table requests', async () => {
		apiMock.onGet('/cashier/situation').reply(200, { isOpen: true })
		apiMock.onGet('/table-request').reply(200, [])
		await act(async () => {
			render(<Dashboard />)
		})

		await waitFor(() => {
			expect(screen.queryByTestId('closed-cashier-message')).toBeFalsy()
			expect(screen.queryByTestId('empty-data-message')).toBeTruthy()
			expect(screen.queryByTestId('table-request')).toBeFalsy()
		})
	})

	it('should be able to show all the table requests in the page', async () => {
		apiMock.onGet('/cashier/situation').reply(200, { isOpen: true })
		apiMock.onGet('/table-request').reply(200, apiResponse)
		await act(async () => {
			render(<Dashboard />)
		})

		const allProducts = screen.getAllByTestId('table-request')

		await waitFor(() => {
			expect(allProducts.length).toEqual(3)
		})
	})

	it('should be able to show if some error occurred in backend', async () => {
		apiMock.onGet('/cashier/situation').reply(400, {})
		apiMock.onGet('/table-request').reply(200, [])
		await act(async () => {
			render(<Dashboard />)
		})

		await waitFor(() => {
			expect(mockedAddSnack).toHaveBeenCalledTimes(1)
		})
	})

	it('should be able to show if some error occurred in backend in second request', async () => {
		apiMock.onGet('/cashier/situation').reply(200, { isOpen: true })
		apiMock.onGet('/table-request').reply(400, {})
		await act(async () => {
			render(<Dashboard />)
		})

		await waitFor(() => {
			expect(mockedAddSnack).toHaveBeenCalledTimes(1)
		})
	})

	it('should work all buttons of action in a table request', async () => {
		apiMock.onGet('/cashier/situation').reply(200, { isOpen: true })
		apiMock.onGet('/table-request').reply(200, apiResponse)
		await act(async () => {
			render(<Dashboard />)
		})

		const firstDetailsButton = screen.getAllByTestId('details-button')[0]
		const firstAddProductsButton = screen.getAllByTestId(
			'add-products-button',
		)[0]
		const firstPaymentButton = screen.getAllByTestId('payment-button')[0]

		fireEvent.click(firstDetailsButton)
		await waitFor(() => {
			expect(mockedHistoryPush).toHaveBeenCalledWith(
				`detalhes-do-pedido/${firstTestId}`,
			)
		})
		mockedHistoryPush.mockClear()

		fireEvent.click(firstAddProductsButton)
		await waitFor(() => {
			expect(mockedHistoryPush).toHaveBeenCalledWith(
				`adicionar-produto/${firstTestId}`,
			)
		})
		mockedHistoryPush.mockClear()
		fireEvent.click(firstPaymentButton)
		await waitFor(() => {
			expect(mockedHistoryPush).toHaveBeenCalledWith(`finalizar/${firstTestId}`)
		})
	})

	it('should be able to add make a new request when the cashier is openned', async () => {
		apiMock.onGet('/cashier/situation').reply(200, { isOpen: true })
		apiMock.onGet('/table-request').reply(200, apiResponse)
		await act(async () => {
			render(<Dashboard />)
		})

		const fabButton = screen.getByTestId('fab-button')
		fireEvent.click(fabButton)

		await waitFor(() => {
			expect(mockedHistoryPush).toHaveBeenCalledWith('/novo-pedido')
			expect(mockedAddSnack).not.toHaveBeenCalled()
		})
	})
})
