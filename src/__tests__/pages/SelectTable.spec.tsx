import { render, act, screen, waitFor, fireEvent } from '@testing-library/react'
import MockAdapter from 'axios-mock-adapter'
import React from 'react'
import SelectTable from '../../pages/SelectTable'
import api from '../../services/api'

const mockedHistoryPush = jest.fn()
const mockedChangeModule = jest.fn()
const mockedAddSnack = jest.fn()

jest.mock('react-router-dom', () => {
	return {
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

const tableNumber = 4
const tableId = 'table-id'
const apiMock = new MockAdapter(api)

describe('SelectTable page', () => {
	beforeEach(() => {
		mockedHistoryPush.mockClear()
		mockedAddSnack.mockClear()
	})
	it('should be able to render correctly the page', async () => {
		render(<SelectTable />)

		await waitFor(() => {
			expect(mockedChangeModule).toHaveBeenCalledWith('requests')
			expect(screen.getByTestId('select-table-page')).toBeTruthy()
		})
	})

	it('should be able to go to add products', async () => {
		render(<SelectTable />)

		const tableNumberInput = screen.getByTestId('table-number-input')
		const btContinue = screen.getByTestId('continue-button')

		fireEvent.change(tableNumberInput, { target: { value: tableNumber } })
		fireEvent.click(btContinue)

		apiMock
			.onGet(`table-request/verify-table/${tableNumber}`)
			.reply(200, { is_available: true })
		apiMock.onPost('/table-request').reply(200, { id: tableId })
		await waitFor(() => {
			expect(mockedHistoryPush).toHaveBeenCalledWith(
				`/adicionar-produto/${tableId}`,
			)
		})
	})

	it('should be able to go to open the modal if not available', async () => {
		render(<SelectTable />)

		const tableNumberInput = screen.getByTestId('table-number-input')
		const btContinue = screen.getByTestId('continue-button')

		fireEvent.change(tableNumberInput, { target: { value: tableNumber } })
		fireEvent.click(btContinue)

		apiMock
			.onGet(`table-request/verify-table/${tableNumber}`)
			.reply(200, { is_available: false })

		await waitFor(() => {
			expect(screen.getByTestId('modal-element')).toBeTruthy()
		})
	})

	it('should be able to go to close modal if click in cancel', async () => {
		render(<SelectTable />)

		const tableNumberInput = screen.getByTestId('table-number-input')
		const btContinue = screen.getByTestId('continue-button')

		fireEvent.change(tableNumberInput, { target: { value: tableNumber } })
		fireEvent.click(btContinue)

		apiMock
			.onGet(`table-request/verify-table/${tableNumber}`)
			.reply(200, { is_available: false })

		await waitFor(() => {
			const btCancelModal = screen.getByTestId('cancel-bt-modal')
			fireEvent.click(btCancelModal)
			expect(screen.queryByTestId('modal-element')).toBeFalsy()
		})
	})

	it('should be able to go to continue to add products if clicked in continue', async () => {
		render(<SelectTable />)

		const tableNumberInput = screen.getByTestId('table-number-input')
		const btContinue = screen.getByTestId('continue-button')

		fireEvent.change(tableNumberInput, { target: { value: tableNumber } })
		fireEvent.click(btContinue)

		apiMock
			.onGet(`table-request/verify-table/${tableNumber}`)
			.reply(200, { is_available: false })
		apiMock.onPost('/table-request').reply(200, { id: tableId })

		await waitFor(() => {
			const btContinueModal = screen.getByTestId('continue-bt-modal')
			fireEvent.click(btContinueModal)
			expect(mockedHistoryPush).toHaveBeenCalledWith(
				`/adicionar-produto/${tableId}`,
			)
		})
	})

	it('should be able to show if some error occurred in the backend', async () => {
		render(<SelectTable />)

		const tableNumberInput = screen.getByTestId('table-number-input')
		const btContinue = screen.getByTestId('continue-button')

		fireEvent.change(tableNumberInput, { target: { value: tableNumber } })
		fireEvent.click(btContinue)

		apiMock.onGet(`table-request/verify-table/${tableNumber}`).reply(400, {})

		await waitFor(() => {
			expect(mockedAddSnack).toHaveBeenCalledTimes(1)
		})
	})

	it('should be able to show if some error occurred in the backend', async () => {
		render(<SelectTable />)

		const tableNumberInput = screen.getByTestId('table-number-input')
		const btContinue = screen.getByTestId('continue-button')

		fireEvent.change(tableNumberInput, { target: { value: tableNumber } })
		fireEvent.click(btContinue)

		apiMock
			.onGet(`table-request/verify-table/${tableNumber}`)
			.reply(200, { is_available: true })
		apiMock.onPost('/table-request').reply(400, {})
		await waitFor(() => {
			expect(mockedAddSnack).toHaveBeenCalledTimes(1)
		})
	})

	it('should be able to go to dashboard if clicked in cancel button', async () => {
		render(<SelectTable />)

		const cancelButton = screen.getByTestId('cancel-button')
		fireEvent.click(cancelButton)

		await waitFor(() => {
			expect(mockedHistoryPush).toHaveBeenLastCalledWith('/dashboard')
		})
	})
})
