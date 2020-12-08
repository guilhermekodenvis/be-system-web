import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import MockAdapter from 'axios-mock-adapter'
import React from 'react'
import { act } from 'react-dom/test-utils'
import ForgetPassword from '../../pages/ForgetPassword'
import api from '../../services/api'

const apiMock = new MockAdapter(api)

const mockedAddSnack = jest.fn()
const mockedHistoryPush = jest.fn()

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

describe('ForgetPassword page', () => {
	beforeEach(() => {
		mockedAddSnack.mockClear()
		mockedHistoryPush.mockClear()
	})

	it('should be able to render correctly the page and set the module', async () => {
		await act(async () => {
			render(<ForgetPassword />)
		})

		await waitFor(() => {
			expect(screen.getByTestId('forget-password-page')).toBeTruthy()
		})
	})

	it('should be able to send new password', async () => {
		await act(async () => {
			render(<ForgetPassword />)
		})

		apiMock.onPost('/password/forgot').reply(201, {})

		const emailField = screen.getByTestId('email-field')
		const btSubmit = screen.getByTestId('submit-button')

		fireEvent.change(emailField, { target: { value: 'teste@email.com' } })
		fireEvent.click(btSubmit)

		await waitFor(() => {
			expect(mockedAddSnack).toHaveBeenCalled()
			expect(mockedHistoryPush).toHaveBeenCalledWith('/login')
		})
	})

	it('should be able to send only valid passwords', async () => {
		await act(async () => {
			render(<ForgetPassword />)
		})

		const emailField = screen.getByTestId('email-field')
		const btSubmit = screen.getByTestId('submit-button')

		fireEvent.change(emailField, { target: { value: 'invalid-email' } })
		fireEvent.click(btSubmit)

		await waitFor(() => {
			expect(mockedAddSnack).not.toHaveBeenCalled()
			expect(mockedHistoryPush).not.toHaveBeenCalledWith('/login')
		})
	})

	it('should be able to show if some error in the backend occurred', async () => {
		await act(async () => {
			render(<ForgetPassword />)
		})

		apiMock.onPost('/password/forgot').reply(400, {})

		const emailField = screen.getByTestId('email-field')
		const btSubmit = screen.getByTestId('submit-button')

		fireEvent.change(emailField, { target: { value: 'email@test.com' } })
		fireEvent.click(btSubmit)

		await waitFor(() => {
			expect(mockedAddSnack).toHaveBeenCalled()
			expect(mockedHistoryPush).not.toHaveBeenCalledWith('/login')
		})
	})
})
