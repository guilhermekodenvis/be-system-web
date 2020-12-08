import { fireEvent, render, waitFor, screen } from '@testing-library/react'
import MockAdapter from 'axios-mock-adapter'
import React from 'react'
import { act } from 'react-dom/test-utils'
import NewProduct from '../../pages/NewProduct'
import api from '../../services/api'

const mockedChangeModule = jest.fn()
const mockedHistoryPush = jest.fn()
const mockedAddSnack = jest.fn()
const apiMock = new MockAdapter(api)
const apiResponse = [
	{ category: 'prato feito' },
	{ category: 'sucos' },
	{ category: 'doces' },
]

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
		useParams: () => ({
			product_id: '',
		}),
		useHistory: () => ({
			push: mockedHistoryPush,
		}),
	}
})

describe('NewProduct page', () => {
	beforeEach(async () => {
		mockedChangeModule.mockClear()
		mockedHistoryPush.mockClear()
		mockedAddSnack.mockClear()
	})

	it('should be able to render the page, set the correct module and load categories', async () => {
		apiMock.onGet('products/categories').reply(200, apiResponse)
		apiMock.onGet('products/').reply(200, {})
		await act(async () => {
			render(<NewProduct />)
		})
		await waitFor(() => {
			expect(screen.getByText('Cadastrar produto')).toBeTruthy()
			expect(mockedChangeModule).toHaveBeenCalledWith('products')
		})
	})

	it('should be able to fill all fields and save the product', async () => {
		apiMock.onPost('/products').reply(201, {})

		apiMock.onGet('products/categories').reply(200, apiResponse)
		await act(async () => {
			render(<NewProduct />)
		})
		const nameInput = screen.getByLabelText('Nome')
		const categoryInput = screen.getByText('Digite a categoria...')
			.parentElement?.childNodes[1].firstChild?.firstChild
		if (!categoryInput) {
			throw new Error('Deu problema para achar o select')
		}
		const priceInput = screen.getByLabelText('Preço')
		const buttonSubmit = screen.getByText('Salvar')

		fireEvent.change(nameInput, { target: { value: 'novo-produto' } })
		fireEvent.change(categoryInput, { target: { value: 'sucos' } })
		fireEvent.change(priceInput, { target: { value: '10' } })
		fireEvent.click(buttonSubmit)
		await waitFor(() => {
			expect(mockedHistoryPush).toHaveBeenCalledWith('/produtos')
			expect(mockedAddSnack).toHaveBeenCalled()
		})
	})

	it('should not be able to save the product with wrong fills in fields', async () => {
		apiMock.onGet('products/categories').reply(200, apiResponse)
		await act(async () => {
			render(<NewProduct />)
		})
		const buttonSubmit = screen.getByText('Salvar')

		fireEvent.click(buttonSubmit)

		await waitFor(() => {
			expect(mockedHistoryPush).not.toHaveBeenCalledWith('/produtos')
			expect(mockedAddSnack).toHaveBeenCalled()
		})
		const errorTextProductName = await screen.findByText(
			'Dê um nome ao produto',
		)
		const errorTextProductPrice = await screen.findByText(
			'Coloque um preço válido',
		)

		await waitFor(() => {
			expect(errorTextProductName).toBeTruthy()
			expect(errorTextProductPrice).toBeTruthy()
		})
	})

	it('should go to products page if click in cancel', async () => {
		apiMock.onGet('products/categories').reply(200, apiResponse)
		await act(async () => {
			render(<NewProduct />)
		})
		const cancelButton = screen.getByText('Cancelar')
		fireEvent.click(cancelButton)
		await waitFor(() => {
			expect(mockedHistoryPush).toHaveBeenCalledWith('/produtos')
		})
	})

	it('should be able to show to user that some error occurred in the backend if so', async () => {
		apiMock
			.onGet('products/categories')
			.reply(400, { message: 'oops, aconteceu algum erro no servidor' })
		await act(async () => {
			render(<NewProduct />)
		})
		await waitFor(() => {
			expect(mockedAddSnack).toHaveBeenCalled()
		})
		mockedAddSnack.mockClear()
		apiMock
			.onPost('/products')
			.reply(400, { message: 'oops, aconteceu algum erro no servidor' })
		const nameInput = screen.getByLabelText('Nome')
		const categoryInput = screen.getByText('Digite a categoria...')
			.parentElement?.childNodes[1].firstChild?.firstChild
		if (!categoryInput) {
			throw new Error('Deu problema para achar o select')
		}
		const priceInput = screen.getByLabelText('Preço')
		const buttonSubmit = screen.getByText('Salvar')

		fireEvent.change(nameInput, { target: { value: 'novo-produto' } })
		fireEvent.change(categoryInput, { target: { value: 'sucos' } })
		fireEvent.change(priceInput, { target: { value: '10' } })
		fireEvent.click(buttonSubmit)
		await waitFor(() => {
			expect(mockedAddSnack).toHaveBeenCalled()
		})
	})

	it('should be able to show if some error occurred in te backend', async () => {
		apiMock.onGet('products/categories').reply(200, apiResponse)
		apiMock.onGet('products/').reply(400, {})
		await act(async () => {
			render(<NewProduct />)
		})
		await waitFor(() => {
			expect(mockedAddSnack).toHaveBeenCalledTimes(1)
		})
	})

	it('should be able to render if has some initial data', async () => {
		apiMock.onGet('products/categories').reply(200, apiResponse)
		apiMock.onGet('products/').reply(200, {
			name: 'product-test',
			category: 'category-test',
			price: 10,
		})
		await act(async () => {
			render(<NewProduct />)
		})
		const nameInput = screen.getByLabelText('Nome')

		await waitFor(() => {
			expect(nameInput.getAttribute('value')).toEqual('product-test')
		})
	})
})
