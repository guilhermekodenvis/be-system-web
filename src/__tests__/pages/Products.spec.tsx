import { render, screen, act, waitFor, fireEvent } from '@testing-library/react'
import MockAdapter from 'axios-mock-adapter'
import React from 'react'
import Products from '../../pages/Products'
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

const testId = 'test-id-1'
const apiMock = new MockAdapter(api)
const apiResponse = [
	{
		id: testId,
		name: 'name-1',
		category: 'category-1',
		price: 10,
	},
	{
		id: 'test-id-2',
		name: 'name-2',
		category: 'category-2',
		price: 10,
	},
	{
		id: 'test-id-3',
		name: 'name-3',
		category: 'category-1',
		price: 10,
	},
]

describe('Products page', () => {
	beforeEach(() => {
		mockedChangeModule.mockClear()
		mockedAddSnack.mockClear()
		mockedHistoryPush.mockClear()
	})

	it('should be able to render correctly the page', async () => {
		apiMock.onGet('/products').reply(200, apiResponse)
		await act(async () => {
			render(<Products />)
		})

		await waitFor(() => {
			expect(mockedChangeModule).toHaveBeenCalledWith('products')
			expect(screen.getByTestId('products-page')).toBeTruthy()
		})
	})

	it('should be able to show if some error occurred in backend loading products', async () => {
		apiMock.onGet('/products').reply(400, {})
		await act(async () => {
			render(<Products />)
		})

		await waitFor(() => {
			expect(mockedAddSnack).toHaveBeenCalledTimes(1)
		})
	})

	it('should be able to render all products', async () => {
		apiMock.onGet('/products').reply(200, apiResponse)
		await act(async () => {
			render(<Products />)
		})

		const allProducts = screen.getAllByTestId('product-element')
		await waitFor(() => {
			expect(allProducts.length).toEqual(3)
		})
	})

	it('should be able to go to edit page', async () => {
		apiMock.onGet('/products').reply(200, apiResponse)
		await act(async () => {
			render(<Products />)
		})

		const firstEditButton = screen.getAllByTestId('edit-button')[0]
		fireEvent.click(firstEditButton)

		await waitFor(() => {
			expect(mockedHistoryPush).toHaveBeenCalledWith(`editar-produto/${testId}`)
		})
	})

	it('should be able to delete a product from the list', async () => {
		apiMock.onGet('/products').reply(200, apiResponse)
		apiMock.onDelete(`products/${testId}`).reply(200, {})

		await act(async () => {
			render(<Products />)
		})

		const firstEditButton = screen.getAllByTestId('delete-button')[0]
		fireEvent.click(firstEditButton)

		await waitFor(() => {
			expect(mockedAddSnack).toHaveBeenCalledTimes(1)
			expect(screen.getAllByTestId('product-element').length).toEqual(2)
		})
	})

	it('should be able to see if some error occurred in the backend', async () => {
		apiMock.onGet('/products').reply(200, apiResponse)
		apiMock.onDelete(`products/${testId}`).reply(400, {})

		await act(async () => {
			render(<Products />)
		})

		const firstEditButton = screen.getAllByTestId('delete-button')[0]
		fireEvent.click(firstEditButton)

		await waitFor(() => {
			expect(mockedAddSnack).toHaveBeenCalledTimes(1)
			expect(screen.getAllByTestId('product-element').length).toEqual(3)
		})
	})

	it('should be able to go to add new product page', async () => {
		apiMock.onGet('/products').reply(200, apiResponse)

		await act(async () => {
			render(<Products />)
		})

		const goToNewProductPageButton = screen.getByTestId(
			'go-to-new-product-page-button',
		)
		fireEvent.click(goToNewProductPageButton)

		await waitFor(() => {
			expect(mockedHistoryPush).toHaveBeenCalledWith('/novo-produto')
		})
	})
})
