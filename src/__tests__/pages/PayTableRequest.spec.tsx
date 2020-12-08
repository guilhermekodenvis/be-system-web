import { render, waitFor, screen, fireEvent } from '@testing-library/react'
import MockAdapter from 'axios-mock-adapter'
import React from 'react'
import { act } from 'react-dom/test-utils'
import PayTableRequest from '../../pages/PayTableRequest'
import api from '../../services/api'
import convertNumberToBRLCurrency from '../../utils/convertNumberToBRLCurrency'

const mockedHistoryPush = jest.fn()
const mockedChangeModule = jest.fn()
const mockedAddSnack = jest.fn()

const tableId = 'table-id'

jest.mock('react-router-dom', () => {
	return {
		useParams: () => ({
			table_id: 'table-id',
		}),
		useHistory: () => ({
			push: mockedHistoryPush,
		}),
	}
})

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

const apiMock = new MockAdapter(api)
const apiResponse = {
	number: 1,
	total: 33,
	products: [
		{ product_name: 'product-1', quantity: 1, product_price: 11 },
		{ product_name: 'product-2', quantity: 1, product_price: 11 },
		{ product_name: 'product-3', quantity: 2, product_price: 11 },
	],
}

describe('PayTableRequest page', () => {
	beforeEach(() => {
		mockedAddSnack.mockClear()
		mockedChangeModule.mockClear()
		mockedHistoryPush.mockClear()
	})

	it('should be able to render correctly the page', async () => {
		apiMock.onGet(`/table-request/${tableId}`).reply(200, apiResponse)
		await act(async () => {
			render(<PayTableRequest />)
		})

		await waitFor(() => {
			expect(screen.getByTestId('pay-table-request-page')).toBeTruthy()
			expect(mockedChangeModule).toHaveBeenCalledWith('cashier')
		})
	})

	it('should be able to show all products in users cart', async () => {
		apiMock.onGet(`/table-request/${tableId}`).reply(200, apiResponse)
		await act(async () => {
			render(<PayTableRequest />)
		})

		const allProducts = screen.getAllByTestId('product-element')
		await waitFor(() => {
			expect(allProducts.length).toEqual(3)
		})
	})

	it('should be able to add a new payment method', async () => {
		apiMock.onGet(`/table-request/${tableId}`).reply(200, apiResponse)
		await act(async () => {
			render(<PayTableRequest />)
		})

		const moneyField = screen.getByTestId('money-field')
		const paymentMethodField = screen.getByTestId('payment-method-field')
		const addPaymentMethodButton = screen.getByTestId(
			'add-payment-method-button',
		)

		await act(async () => {
			fireEvent.change(moneyField, { target: { value: 10 } })
			fireEvent.change(paymentMethodField, { target: { value: 1 } })
			fireEvent.click(addPaymentMethodButton)
		})

		await waitFor(() => {
			expect(screen.getAllByTestId('payment-item').length).toEqual(1)
			expect(screen.getByTestId('total').textContent).toEqual(
				convertNumberToBRLCurrency(33),
			)
			expect(screen.getByTestId('paid').textContent).toEqual(
				convertNumberToBRLCurrency(10),
			)
			expect(screen.getByTestId('payback').textContent).toEqual(
				convertNumberToBRLCurrency(0),
			)
			expect(screen.getByTestId('rest').textContent).toEqual(
				convertNumberToBRLCurrency(23),
			)
		})
	})

	it('should be able to delete a payment method', async () => {
		apiMock.onGet(`/table-request/${tableId}`).reply(200, apiResponse)
		await act(async () => {
			render(<PayTableRequest />)
		})

		const moneyField = screen.getByTestId('money-field')
		const paymentMethodField = screen.getByTestId('payment-method-field')
		const addPaymentMethodButton = screen.getByTestId(
			'add-payment-method-button',
		)

		fireEvent.change(moneyField, { target: { value: 10 } })
		fireEvent.change(paymentMethodField, { target: { value: 1 } })
		fireEvent.click(addPaymentMethodButton)

		await waitFor(async () => {
			const deleteButton = screen.getAllByTestId('delete-payment-button')[0]
			fireEvent.click(deleteButton)

			await waitFor(() => {
				expect(screen.queryAllByTestId('payment-item').length).toEqual(0)
			})
		})
	})

	it('should be able to return correct payback value', async () => {
		apiMock.onGet(`/table-request/${tableId}`).reply(200, apiResponse)
		await act(async () => {
			render(<PayTableRequest />)
		})

		const moneyField = screen.getByTestId('money-field')
		const paymentMethodField = screen.getByTestId('payment-method-field')
		const addPaymentMethodButton = screen.getByTestId(
			'add-payment-method-button',
		)

		await act(async () => {
			fireEvent.change(moneyField, { target: { value: 10 } })
			fireEvent.change(paymentMethodField, { target: { value: 1 } })
			fireEvent.click(addPaymentMethodButton)
		})

		await act(async () => {
			fireEvent.change(moneyField, { target: { value: 40 } })
			fireEvent.change(paymentMethodField, { target: { value: 1 } })
			fireEvent.click(addPaymentMethodButton)
		})

		await waitFor(() => {
			expect(screen.getAllByTestId('payment-item').length).toEqual(2)
			expect(screen.getByTestId('total').textContent).toEqual(
				convertNumberToBRLCurrency(33),
			)
			expect(screen.getByTestId('paid').textContent).toEqual(
				convertNumberToBRLCurrency(50),
			)
			expect(screen.getByTestId('payback').textContent).toEqual(
				convertNumberToBRLCurrency(17),
			)
			expect(screen.getByTestId('rest').textContent).toEqual(
				convertNumberToBRLCurrency(0),
			)
		})
	})

	it('should be able to finish payment', async () => {
		apiMock.onGet(`/table-request/${tableId}`).reply(200, apiResponse)
		await act(async () => {
			render(<PayTableRequest />)
		})

		const moneyField = screen.getByTestId('money-field')
		const paymentMethodField = screen.getByTestId('payment-method-field')
		const addPaymentMethodButton = screen.getByTestId(
			'add-payment-method-button',
		)

		await act(async () => {
			fireEvent.change(moneyField, { target: { value: 10 } })
			fireEvent.change(paymentMethodField, { target: { value: 1 } })
			fireEvent.click(addPaymentMethodButton)
		})

		await act(async () => {
			fireEvent.change(moneyField, { target: { value: 40 } })
			fireEvent.change(paymentMethodField, { target: { value: 1 } })
			fireEvent.click(addPaymentMethodButton)
		})

		apiMock.onPost('/cashier-moviments/finish-payment').reply(201, {})

		const closeAndPrintBt = screen.getByTestId('close-and-print-button')
		await act(async () => {
			fireEvent.click(closeAndPrintBt)
		})

		await waitFor(() => {
			expect(mockedAddSnack).toHaveBeenCalledTimes(1)
			expect(mockedHistoryPush).toHaveBeenCalledWith('/caixa')
		})
	})

	it('should be able to finish payment, here we dont send a cashback value', async () => {
		apiMock.onGet(`/table-request/${tableId}`).reply(200, apiResponse)
		await act(async () => {
			render(<PayTableRequest />)
		})

		const moneyField = screen.getByTestId('money-field')
		const paymentMethodField = screen.getByTestId('payment-method-field')
		const addPaymentMethodButton = screen.getByTestId(
			'add-payment-method-button',
		)

		await act(async () => {
			fireEvent.change(moneyField, { target: { value: 33 } })
			fireEvent.change(paymentMethodField, { target: { value: 1 } })
			fireEvent.click(addPaymentMethodButton)
		})

		apiMock.onPost('/cashier-moviments/finish-payment').reply(201, {})

		const closeAndPrintBt = screen.getByTestId('close-and-print-button')
		await act(async () => {
			fireEvent.click(closeAndPrintBt)
		})

		await waitFor(() => {
			expect(mockedAddSnack).toHaveBeenCalledTimes(1)
			expect(mockedHistoryPush).toHaveBeenCalledWith('/caixa')
		})
	})

	it('should show if some error occurred in the backend', async () => {
		apiMock.onGet(`/table-request/${tableId}`).reply(200, apiResponse)
		await act(async () => {
			render(<PayTableRequest />)
		})

		const moneyField = screen.getByTestId('money-field')
		const paymentMethodField = screen.getByTestId('payment-method-field')
		const addPaymentMethodButton = screen.getByTestId(
			'add-payment-method-button',
		)

		await act(async () => {
			fireEvent.change(moneyField, { target: { value: 10 } })
			fireEvent.change(paymentMethodField, { target: { value: 1 } })
			fireEvent.click(addPaymentMethodButton)
		})

		await act(async () => {
			fireEvent.change(moneyField, { target: { value: 40 } })
			fireEvent.change(paymentMethodField, { target: { value: 1 } })
			fireEvent.click(addPaymentMethodButton)
		})

		apiMock.onPost('/cashier-moviments/finish-payment').reply(400, {})

		const closeAndPrintBt = screen.getByTestId('close-and-print-button')
		await act(async () => {
			fireEvent.click(closeAndPrintBt)
		})

		await waitFor(() => {
			expect(mockedAddSnack).toHaveBeenCalledTimes(1)
			expect(mockedHistoryPush).not.toHaveBeenCalledWith('/caixa')
		})
	})
})
