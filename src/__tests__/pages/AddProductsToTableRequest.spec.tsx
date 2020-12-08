import { render, act, screen, waitFor, fireEvent } from '@testing-library/react'
import MockAdapter from 'axios-mock-adapter'
import React from 'react'
import printJS from 'print-js'
import AddProductsToTableRequest from '../../pages/AddProductsToTableRequest'
import api from '../../services/api'
import convertNumberToBRLCurrency from '../../utils/convertNumberToBRLCurrency'

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

jest.mock('print-js')

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
const apiResponse = [
	{
		id: 'product-id-1',
		name: 'product-1',
		price: 10,
		quantity: 0,
		observation: '',
		category: 'category-1',
	},
	{
		id: 'product-id-2',
		name: 'product-2',
		price: 20,
		quantity: 0,
		observation: '',
		category: 'category-2',
	},
	{
		id: 'product-id-3',
		name: 'product-3',
		price: 30,
		quantity: 0,
		observation: '',
		category: 'category-1',
	},
	{
		id: 'product-id-4',
		name: 'product-4',
		price: 40,
		quantity: 0,
		observation: '',
		category: 'category-1',
	},
	{
		id: 'product-id-5',
		name: 'product-5',
		price: 50,
		quantity: 0,
		observation: '',
		category: 'category-2',
	},
]

describe('AddProductsToTableRequest page', () => {
	beforeEach(() => {
		mockedAddSnack.mockClear()
		mockedChangeModule.mockClear()
		mockedHistoryPush.mockClear()
	})

	it('should be able to render the page', async () => {
		apiMock.onGet('/products').reply(200, apiResponse)
		await act(async () => {
			render(<AddProductsToTableRequest />)
		})

		await waitFor(() => {
			expect(mockedChangeModule).toHaveBeenCalledWith('requests')
			expect(
				screen.getByTestId('add-products-to-table-request-page'),
			).toBeTruthy()
		})
	})

	it('should be able to show if some error occurred in the backend', async () => {
		apiMock.onGet('/products').reply(400, {})
		await act(async () => {
			render(<AddProductsToTableRequest />)
		})

		await waitFor(() => {
			expect(mockedAddSnack).toHaveBeenCalledTimes(1)
		})
	})

	it('should be able to correctly the displaying of products', async () => {
		apiMock.onGet('/products').reply(200, apiResponse)
		await act(async () => {
			render(<AddProductsToTableRequest />)
		})

		const allCategories = screen.getAllByTestId('category-item')

		await waitFor(() => {
			expect(allCategories.length).toEqual(2)
		})

		const allProducts = screen.getAllByTestId('product-item')

		await waitFor(() => {
			expect(allProducts.length).toEqual(3)
		})

		await act(async () => {
			fireEvent.click(allCategories[1])
		})
		const allProductsOfSecondCategory = screen.getAllByTestId('product-item')

		await waitFor(() => {
			expect(allProductsOfSecondCategory.length).toEqual(2)
		})
	})

	it('should be able to add products in cart and display the total final value', async () => {
		apiMock.onGet('/products').reply(200, apiResponse)
		await act(async () => {
			render(<AddProductsToTableRequest />)
		})

		const allLessButtons = screen.getAllByTestId('less-button')
		const allMoreButtons = screen.getAllByTestId('more-button')

		await waitFor(() => {
			expect(allLessButtons[0]).toHaveProperty('disabled')
			expect(allLessButtons[1]).toHaveProperty('disabled')
			expect(allLessButtons[2]).toHaveProperty('disabled')
		})

		await act(async () => {
			fireEvent.click(allMoreButtons[0])
		})
		await act(async () => {
			fireEvent.click(allMoreButtons[0])
		})

		const finalTotalPrice = screen.getByTestId('final-total-price')

		const firstLessButton = screen.getAllByTestId('less-button')[0]
		await waitFor(() => {
			expect(finalTotalPrice.textContent).toEqual(
				convertNumberToBRLCurrency(20),
			)
			expect(firstLessButton.attributes.getNamedItem('disabled')).toBeFalsy()
		})

		await act(async () => {
			fireEvent.click(firstLessButton)
		})

		const finalTotalPriceWithOneLessClicked = screen.getByTestId(
			'final-total-price',
		)

		await waitFor(() => {
			expect(finalTotalPriceWithOneLessClicked.textContent).toEqual(
				convertNumberToBRLCurrency(10),
			)
		})

		await act(async () => {
			fireEvent.click(firstLessButton)
		})

		const firstLessButtonDisabledAgain = screen.getAllByTestId('less-button')[0]
		const finalPriceValue = screen.getByTestId('final-total-price')

		await waitFor(() => {
			expect(
				firstLessButtonDisabledAgain.attributes.getNamedItem('disabled'),
			).toBeTruthy()

			expect(finalPriceValue.textContent).toEqual(convertNumberToBRLCurrency(0))
		})
	})

	it('should be able to insert a observation', async () => {
		apiMock.onGet('/products').reply(200, apiResponse)
		await act(async () => {
			render(<AddProductsToTableRequest />)
		})

		const allMoreButtons = screen.getAllByTestId('more-button')

		await act(async () => {
			fireEvent.click(allMoreButtons[0])
		})

		const allObservationButton = screen.getAllByTestId('observation-button')

		await waitFor(() => {
			expect(allObservationButton.length).toEqual(1)
		})

		await act(async () => {
			fireEvent.click(allObservationButton[0])
		})

		const modal = screen.getByTestId('modal-element')
		await waitFor(() => {
			expect(modal).toBeTruthy()
		})

		const observationField = screen.getByTestId('observation-field')
		const continueButton = screen.getByTestId('continue-modal-button')
		await act(async () => {
			fireEvent.change(observationField, {
				target: { value: 'observation-test-message' },
			})
			fireEvent.click(continueButton)
		})

		const modalClosed = screen.queryByTestId('modal-element')
		await waitFor(() => {
			expect(modalClosed).toBeFalsy()
		})
	})

	it('should be able to close modal when clicked cancel button', async () => {
		apiMock.onGet('/products').reply(200, apiResponse)
		await act(async () => {
			render(<AddProductsToTableRequest />)
		})

		const allMoreButtons = screen.getAllByTestId('more-button')

		await act(async () => {
			fireEvent.click(allMoreButtons[0])
		})

		const allObservationButton = screen.getAllByTestId('observation-button')

		await waitFor(() => {
			expect(allObservationButton.length).toEqual(1)
		})

		await act(async () => {
			fireEvent.click(allObservationButton[0])
		})

		const cancelButton = screen.getByTestId('cancel-modal-button')
		await act(async () => {
			fireEvent.click(cancelButton)
		})
		const modal = screen.queryByTestId('modal-element')

		await waitFor(() => {
			expect(modal).toBeFalsy()
		})
	})

	it('should be able to send to kitchen the request and print de invoice', async () => {
		apiMock.onGet('/products').reply(200, apiResponse)
		apiMock.onPost('/table-request/add-products').reply(201, {})
		await act(async () => {
			render(<AddProductsToTableRequest />)
		})

		const allMoreButtons = screen.getAllByTestId('more-button')

		await act(async () => {
			fireEvent.click(allMoreButtons[0])
		})

		const sendToKitchenButton = screen.getByTestId('send-to-kitchen-button')

		await act(async () => {
			fireEvent.click(sendToKitchenButton)
		})

		await waitFor(() => {
			expect(mockedAddSnack).toHaveBeenCalledTimes(1)
			expect(mockedHistoryPush).toHaveBeenCalledWith('/dashboard')
			expect(printJS).toHaveBeenCalledTimes(1)
		})
	})

	it('should be able to show if some error occurred in the backend when clicked in send to kithcne', async () => {
		printJS.mockClear()
		apiMock.onGet('/products').reply(200, apiResponse)
		apiMock.onPost('/table-request/add-products').reply(400, {})
		await act(async () => {
			render(<AddProductsToTableRequest />)
		})

		const allMoreButtons = screen.getAllByTestId('more-button')

		await act(async () => {
			fireEvent.click(allMoreButtons[0])
		})

		const sendToKitchenButton = screen.getByTestId('send-to-kitchen-button')

		await act(async () => {
			fireEvent.click(sendToKitchenButton)
		})

		await waitFor(() => {
			expect(mockedAddSnack).toHaveBeenCalledTimes(1)
			expect(mockedHistoryPush).not.toHaveBeenCalledWith('/dashboard')
			expect(printJS).not.toHaveBeenCalledTimes(1)
		})
	})
})
