import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import MockAdapter from 'axios-mock-adapter'
import NewPassword from '../../pages/ForgetPassword/NewPassword'
import api from '../../services/api'

const apiMock = new MockAdapter(api)

const mockedAddSnack = jest.fn()
const mockedHistoryPush = jest.fn()

jest.mock('react-router-dom', () => {
	return {
		useParams: () => ({
			token: 'token-123',
		}),
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

describe('ForgetPasswordNewPassword page', () => {
	beforeEach(() => {
		mockedAddSnack.mockClear()
		mockedHistoryPush.mockClear()
	})

	it('should be able to render correctly the page', async () => {
		await act(async () => {
			render(<NewPassword />)
		})

		await waitFor(() => {
			expect(screen.getByTestId('new-password-page')).toBeTruthy()
		})
	})

	it('should be able to submit new password', async () => {
		await act(async () => {
			render(<NewPassword />)
		})

		apiMock.onPost('/password/reset').reply(201, {})

		const newPasswordInput = screen.getByTestId('new-password-input')
		const confirmPasswordInput = screen.getByTestId('confirm-password-input')
		const submitButton = screen.getByTestId('submit-button')

		fireEvent.change(newPasswordInput, { target: { value: 'new-password' } })
		fireEvent.change(confirmPasswordInput, {
			target: { value: 'new-password' },
		})
		fireEvent.click(submitButton)

		await waitFor(() => {
			expect(mockedAddSnack).toHaveBeenCalledTimes(1)
			expect(mockedHistoryPush).toHaveBeenCalledWith('/login')
		})
	})

	it('should not be able to submit if passwords dont match', async () => {
		await act(async () => {
			render(<NewPassword />)
		})

		const newPasswordInput = screen.getByTestId('new-password-input')
		const confirmPasswordInput = screen.getByTestId('confirm-password-input')
		const submitButton = screen.getByTestId('submit-button')

		fireEvent.change(newPasswordInput, { target: { value: 'new-password' } })
		fireEvent.change(confirmPasswordInput, {
			target: { value: 'wrong-password' },
		})
		fireEvent.click(submitButton)

		await waitFor(() => {
			expect(mockedAddSnack).not.toHaveBeenCalled()
			expect(mockedHistoryPush).not.toHaveBeenCalledWith('/login')
		})
	})

	it('should be able to submit new password', async () => {
		await act(async () => {
			render(<NewPassword />)
		})

		apiMock.onPost('/password/reset').reply(400, {})

		const newPasswordInput = screen.getByTestId('new-password-input')
		const confirmPasswordInput = screen.getByTestId('confirm-password-input')
		const submitButton = screen.getByTestId('submit-button')

		fireEvent.change(newPasswordInput, { target: { value: 'new-password' } })
		fireEvent.change(confirmPasswordInput, {
			target: { value: 'new-password' },
		})
		fireEvent.click(submitButton)

		await waitFor(() => {
			expect(mockedAddSnack).toHaveBeenCalledTimes(1)
			expect(mockedHistoryPush).not.toHaveBeenCalledWith('/login')
		})
	})
})
