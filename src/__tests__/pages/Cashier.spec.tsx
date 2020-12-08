import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import MockAdapter from 'axios-mock-adapter'
import React from 'react'
import { act } from 'react-dom/test-utils'
import Cashier from '../../pages/Cashier'
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

const apiMock = new MockAdapter(api)
const apiResponseCashierOpen = {
	isOpen: true,
}
const apiResponseCashierClosed = {
	isOpen: false,
}
const apiResponseDataCashier = [
	{
		id: 'test-id-1',
		number: 1,
		total: 21,
	},
	{
		id: 'test-id-2',
		number: 2,
		total: 22,
	},
	{
		id: 'test-id-3',
		number: 3,
		total: 23,
	},
]
const apiResponseDetailsTable1 = {
	id: 'test-id-1',
	number: 1,
	total: 21,
	products: [
		{
			quantity: 1,
			product_name: 'product-1',
			product_price: 10,
		},
		{
			quantity: 2,
			product_name: 'product-2',
			product_price: 5.5,
		},
	],
}

describe('Cashier page', () => {
	beforeEach(() => {
		mockedChangeModule.mockClear()
		mockedAddSnack.mockClear()
		mockedHistoryPush.mockClear()
	})

	it('should be able to render correctly the page', async () => {
		apiMock
			.onGet('/cashier-moviments/situation')
			.reply(200, apiResponseCashierOpen)
		apiMock.onGet('/table-request').reply(200, apiResponseDataCashier)

		await act(async () => {
			render(<Cashier />)
		})
		await waitFor(() => {
			expect(screen.findByText('Caixa aberto')).toBeTruthy()
			expect(mockedChangeModule).toBeCalledWith('cashier')
			expect(screen.getByText('Fechar caixa')).toHaveAttribute('disabled')
			expect(
				screen.queryByText('Selecione uma mesa para ver os detalhes...'),
			).toBeTruthy()
		})
	})

	it('should be able to show to user if some error occurred in the backend', async () => {
		apiMock.onGet('/cashier-moviments/situation').reply(400, {
			message: 'Oops, algum erro ocorreu, nosso suporte já está verificando',
		})
		apiMock.onGet('/table-request').reply(400, {
			message: 'Oops, algum erro ocorreu, nosso suporte já está verificando',
		})
		await act(async () => {
			render(<Cashier />)
		})
		await waitFor(() => {
			expect(mockedAddSnack).toHaveBeenCalledTimes(2)
		})
	})

	it('should be able to go to open cashier if the cashier is not oppened', async () => {
		apiMock
			.onGet('/cashier-moviments/situation')
			.reply(200, apiResponseCashierClosed)
		apiMock.onGet('/table-request').reply(200, apiResponseDataCashier)
		await act(async () => {
			render(<Cashier />)
		})
		await waitFor(() => {
			expect(mockedHistoryPush).toHaveBeenCalledWith('abrir-caixa')
		})
	})

	it('should be able to show the content of a table when click to details', async () => {
		apiMock
			.onGet('/cashier-moviments/situation')
			.reply(200, apiResponseCashierOpen)
		apiMock.onGet('/table-request').reply(200, apiResponseDataCashier)
		await act(async () => {
			render(<Cashier />)
		})
		const btDetails1 = screen.getAllByTestId('bt-details')[0]
		apiMock
			.onGet('table-request/test-id-1')
			.reply(200, apiResponseDetailsTable1)
		fireEvent.click(btDetails1)
		await waitFor(() => {
			expect(
				screen.queryByText('Selecione uma mesa para ver os detalhes...'),
			).toBeFalsy()
			expect(screen.queryByText('Detalhes do pedido da mesa 1')).toBeTruthy()
			expect(screen.queryByText('product-1')).toBeTruthy()
		})
	})

	it('should be able to go to payment page when clicked to pay', async () => {
		apiMock
			.onGet('/cashier-moviments/situation')
			.reply(200, apiResponseCashierOpen)
		apiMock.onGet('/table-request').reply(200, apiResponseDataCashier)
		await act(async () => {
			render(<Cashier />)
		})

		const btPayment1 = screen.getAllByTestId('bt-payment')[0]
		fireEvent.click(btPayment1)
		await waitFor(() => {
			expect(mockedHistoryPush).toHaveBeenCalledWith('finalizar/test-id-1')
		})
	})

	it('should be able to go to payment page when clicked to pay in details', async () => {
		apiMock
			.onGet('/cashier-moviments/situation')
			.reply(200, apiResponseCashierOpen)
		apiMock.onGet('/table-request').reply(200, apiResponseDataCashier)
		await act(async () => {
			render(<Cashier />)
		})

		await act(async () => {
			const btDetails1 = screen.getAllByTestId('bt-details')[0]
			apiMock
				.onGet('table-request/test-id-1')
				.reply(200, apiResponseDetailsTable1)
			fireEvent.click(btDetails1)
		})

		const btPaymentInDetails = screen.getByText('Pagamento')
		fireEvent.click(btPaymentInDetails)
		await waitFor(() => {
			expect(mockedHistoryPush).toHaveBeenCalledWith('finalizar/test-id-1')
		})
	})

	it('shoud be able to show if some error occurred in the backend when clicked to see table request details', async () => {
		apiMock
			.onGet('/cashier-moviments/situation')
			.reply(200, apiResponseCashierOpen)
		apiMock.onGet('/table-request').reply(200, apiResponseDataCashier)
		await act(async () => {
			render(<Cashier />)
		})
		const btDetails1 = screen.getAllByTestId('bt-details')[0]
		apiMock.onGet('table-request/test-id-1').reply(400, {
			message:
				'Oops, algum erro aconteceu no servidor, nossa equipe já está sendo notificada',
		})
		fireEvent.click(btDetails1)
		await waitFor(() => {
			expect(mockedAddSnack).toHaveBeenCalledTimes(1)
		})
	})

	it('should be able to go to close cashier if there is not even one table to pay', async () => {
		apiMock
			.onGet('/cashier-moviments/situation')
			.reply(200, apiResponseCashierOpen)
		apiMock.onGet('/table-request').reply(200, [])
		await act(async () => {
			render(<Cashier />)
		})

		const btCloseCashier = screen.getByText('Fechar caixa')
		fireEvent.click(btCloseCashier)
		await waitFor(() => {
			expect(mockedHistoryPush).toHaveBeenCalledWith('fechar-caixa')
		})
	})
})
