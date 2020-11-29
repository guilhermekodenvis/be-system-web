import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react'
import Login from '../../pages/Login'

const mockedHistoryPush = jest.fn()
const mockedSignIn = jest.fn()
const mockedAddSnack = jest.fn()

jest.mock('react-router-dom', () => {
	return {
		useHistory: () => ({
			push: mockedHistoryPush,
		}),
		Link: ({ children }: { children: React.ReactNode }) => children,
	}
})

jest.mock('../../hooks/auth', () => {
	return {
		useAuth: () => ({
			signIn: mockedSignIn,
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

describe('Login page', () => {
	beforeEach(() => {
		mockedHistoryPush.mockClear()
	})

	it('should be able to login', async () => {
		const { getByLabelText, getByText } = render(<Login />)

		const emailField = getByLabelText('E-mail')
		const passwordField = getByLabelText('Senha')
		const buttonElement = getByText('Entrar')

		fireEvent.change(emailField, {
			target: { value: 'gui.sartori96@gmail.com' },
		})
		fireEvent.change(passwordField, {
			target: { value: '123123' },
		})
		fireEvent.click(buttonElement)

		await waitFor(() => {
			expect(mockedHistoryPush).toHaveBeenCalledWith('/')
		})
	})

	it('should not be able to login with invalid email', async () => {
		const { getByLabelText, getByText } = render(<Login />)

		const emailField = getByLabelText('E-mail')
		const passwordField = getByLabelText('Senha')
		const buttonElement = getByText('Entrar')

		fireEvent.change(emailField, {
			target: { value: 'wrong-email' },
		})
		fireEvent.change(passwordField, {
			target: { value: '123123' },
		})
		fireEvent.click(buttonElement)

		await waitFor(() => {
			expect(mockedHistoryPush).not.toHaveBeenCalled()
		})
	})

	it('should display an error if login fails', async () => {
		mockedSignIn.mockImplementation(() => {
			throw new Error()
		})

		const { getByLabelText, getByText } = render(<Login />)

		const emailField = getByLabelText('E-mail')
		const passwordField = getByLabelText('Senha')
		const loginButtonElement = getByText('Entrar')

		fireEvent.change(emailField, {
			target: { value: 'gui.sartori96@gmail.com' },
		})
		fireEvent.change(passwordField, {
			target: { value: '123123' },
		})
		fireEvent.click(loginButtonElement)

		await waitFor(() => {
			expect(mockedAddSnack).toHaveBeenCalledWith(
				expect.objectContaining({
					type: 'danger',
				}),
			)
		})
	})

	it('should be able to go to register page', async () => {
		const { getByText } = render(<Login />)

		const gotoRegisterButtonElement = getByText('Registre-se')

		fireEvent.click(gotoRegisterButtonElement)

		await waitFor(() => {
			expect(mockedHistoryPush).toHaveBeenCalledWith('/registrar')
		})
	})
})
