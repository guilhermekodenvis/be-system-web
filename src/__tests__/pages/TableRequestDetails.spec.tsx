import { render, act, screen, waitFor, fireEvent } from '@testing-library/react'
import MockAdapter from 'axios-mock-adapter'
import React from 'react'
import TableRequestDetails from '../../pages/TableRequestDetails'
import api from '../../services/api'

const mockedHistoryPush = jest.fn()
const mockedChangeModule = jest.fn()
const mockedAddSnack = jest.fn()

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

const tableId = 'table-id'
const apiMock = new MockAdapter(api)
const apiResponse = {
	id: tableId,
	number: 4,
	products: [
		{
			quantity: 1,
			product_price: 12,
			product_name: 'product-1',
		},
		{
			quantity: 1,
			product_price: 14,
			product_name: 'product-2',
		},
		{
			quantity: 1,
			product_price: 18,
			product_name: 'product-3',
		},
	],
}

describe('TableRequestDetails page', () => {
	beforeEach(() => {
		mockedAddSnack.mockClear()
		mockedChangeModule.mockClear()
		mockedHistoryPush.mockClear()
	})
	it('should be able to render correctly the page', async () => {
		apiMock.onGet(`/table-request/${tableId}`).reply(200, apiResponse)
		await act(async () => {
			render(<TableRequestDetails />)
		})
		await waitFor(() => {
			expect(screen.getByTestId('table-request-details-page')).toBeTruthy()
			expect(mockedChangeModule).toHaveBeenCalledWith('requests')
		})
	})

	it('should be able to go to add products if click in add new product button', async () => {
		apiMock.onGet('/table-request/table-id').reply(200, apiResponse)
		await act(async () => {
			render(<TableRequestDetails />)
		})
		const btAdd = screen.getByTestId('bt-add-products')
		fireEvent.click(btAdd)
		await waitFor(() => {
			expect(mockedHistoryPush).toHaveBeenCalledWith(
				`/adicionar-produto/${tableId}`,
			)
		})
	})

	it('should be able to render all products correctly', async () => {
		apiMock.onGet('/table-request/table-id').reply(200, apiResponse)
		await act(async () => {
			render(<TableRequestDetails />)
		})

		const productsElementInList = screen.getAllByTestId(
			'product-element-in-list',
		)

		await waitFor(() => {
			expect(productsElementInList.length).toEqual(3)
		})
	})

	it('should show to user if some error occurred in the backend', async () => {
		apiMock.onGet('/table-request/table-id').reply(400, {})
		await act(async () => {
			render(<TableRequestDetails />)
		})

		const productsElementInList = screen.queryAllByTestId(
			'product-element-in-list',
		)

		await waitFor(() => {
			expect(productsElementInList.length).toEqual(0)
			expect(mockedAddSnack).toHaveBeenCalledTimes(1)
		})
	})
})
