import { render, waitFor, screen, fireEvent } from '@testing-library/react'
import MockAdapter from 'axios-mock-adapter'
import React from 'react'
import Register from '../../pages/Register'
import api from '../../services/api'

const mockedHistoryPush = jest.fn()
const mockedAddSnack = jest.fn()

const apiMock = new MockAdapter(api)

jest.mock('react-router-dom', () => {
	return {
		useHistory: () => ({
			push: mockedHistoryPush,
		}),
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
describe('Register page', () => {
	beforeEach(() => {
		mockedHistoryPush.mockClear()
		mockedAddSnack.mockClear()
	})

	it('should be able to render correctly the page', async () => {
		render(<Register />)

		await waitFor(() => {
			expect(screen.getByTestId('register-page')).toBeTruthy()
		})
	})

	it('should be able to register an new user', async () => {
		render(<Register />)
		apiMock.onPost('/users').reply(200, {})

		const restaurantNameInput = screen.getByTestId('restaurant-name-input')
		const userNameInput = screen.getByTestId('user-name-input')
		const emailInput = screen.getByTestId('email-input')
		const passwordInput = screen.getByTestId('password-input')
		const confirmPasswordInput = screen.getByTestId('confirm-password-input')
		const cnpjInput = screen.getByTestId('cnpj-input')
		const submitButton = screen.getByTestId('submit-button')

		fireEvent.change(restaurantNameInput, {
			target: { value: 'restaurant-name' },
		})
		fireEvent.change(userNameInput, { target: { value: 'user-name' } })
		fireEvent.change(emailInput, { target: { value: 'email@test.com' } })
		fireEvent.change(passwordInput, { target: { value: 'password' } })
		fireEvent.change(confirmPasswordInput, { target: { value: 'password' } })
		fireEvent.change(cnpjInput, { target: { value: '11222333444412' } })
		fireEvent.click(submitButton)

		await waitFor(() => {
			expect(mockedHistoryPush).toHaveBeenCalledWith('/login')
		})
	})

	it('should be able to show if some error occurred in the backend', async () => {
		render(<Register />)
		apiMock.onPost('/users').reply(400, {})

		const restaurantNameInput = screen.getByTestId('restaurant-name-input')
		const userNameInput = screen.getByTestId('user-name-input')
		const emailInput = screen.getByTestId('email-input')
		const passwordInput = screen.getByTestId('password-input')
		const confirmPasswordInput = screen.getByTestId('confirm-password-input')
		const cnpjInput = screen.getByTestId('cnpj-input')
		const submitButton = screen.getByTestId('submit-button')

		fireEvent.change(restaurantNameInput, {
			target: { value: 'restaurant-name' },
		})
		fireEvent.change(userNameInput, { target: { value: 'user-name' } })
		fireEvent.change(emailInput, { target: { value: 'email@test.com' } })
		fireEvent.change(passwordInput, { target: { value: 'password' } })
		fireEvent.change(confirmPasswordInput, { target: { value: 'password' } })
		fireEvent.change(cnpjInput, { target: { value: '11222333444412' } })
		fireEvent.click(submitButton)

		await waitFor(() => {
			expect(mockedHistoryPush).not.toHaveBeenCalledWith('/login')
			expect(mockedAddSnack).toHaveBeenCalledTimes(1)
		})
	})

	it('should not be able to register if some field is not acceptable', async () => {
		render(<Register />)
		apiMock.onPost('/users').reply(400, {})

		const submitButton = screen.getByTestId('submit-button')

		fireEvent.click(submitButton)

		await waitFor(() => {
			expect(mockedHistoryPush).not.toHaveBeenCalledWith('/login')
			expect(mockedAddSnack).not.toHaveBeenCalled()
		})
	})
})
