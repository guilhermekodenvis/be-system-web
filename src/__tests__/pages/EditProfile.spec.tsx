import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import MockAdapter from 'axios-mock-adapter'
import React from 'react'
import EditProfile from '../../pages/EditProfile'
import api from '../../services/api'

const mockedAddSnack = jest.fn()
const mockedHistoryPush = jest.fn()
const mockedUpdateUser = jest.fn()

jest.mock('../../hooks/snack', () => {
	return {
		useSnack: () => ({
			addSnack: mockedAddSnack,
		}),
	}
})

jest.mock('../../hooks/auth', () => {
	return {
		useAuth: () => ({
			updateUser: mockedUpdateUser,
			user: {
				id: 'user-id',
				user_name: 'user-name',
				restaurant_name: 'restaurant-name',
				email: 'email@test.com',
				cnpj: '11222333444412',
				avatar_url: 'url.jpg',
			},
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

const apiMock = new MockAdapter(api)

describe('EditProfile page', () => {
	beforeEach(() => {
		mockedAddSnack.mockClear()
		mockedHistoryPush.mockClear()
		mockedUpdateUser.mockClear()
	})

	it('should be able to render correctly the page', async () => {
		render(<EditProfile />)

		const restaurantNameInput = screen.getByTestId('restaurante-name-input')
		const userNameInput = screen.getByTestId('user-name-input')
		const emailInput = screen.getByTestId('email-input')
		const cnpjInput = screen.getByTestId('cnpj-input')

		await waitFor(() => {
			expect(restaurantNameInput.getAttribute('value')).toEqual(
				'restaurant-name',
			)
			expect(userNameInput.getAttribute('value')).toEqual('user-name')
			expect(emailInput.getAttribute('value')).toEqual('email@test.com')
			expect(cnpjInput.getAttribute('value')).toEqual('11222333444412')
			expect(screen.getByTestId('edit-profile-page')).toBeTruthy()
		})
	})

	it('should be able to update users profile', async () => {
		render(<EditProfile />)
		apiMock.onPut('/profile').reply(200, {})

		const submitPersonalDataButton = screen.getByTestId(
			'submit-personal-data-button',
		)
		fireEvent.click(submitPersonalDataButton)

		await waitFor(() => {
			expect(mockedAddSnack).toHaveBeenCalledTimes(1)
			expect(mockedHistoryPush).toHaveBeenCalledWith('/dashboard')
			expect(mockedUpdateUser).toHaveBeenCalledTimes(1)
		})
	})

	it('should not be able to update if the fields arent valids', async () => {
		render(<EditProfile />)
		apiMock.onPut('/profile').reply(200, {})

		const emailInput = screen.getByTestId('email-input')
		const submitPersonalDataButton = screen.getByTestId(
			'submit-personal-data-button',
		)

		fireEvent.change(emailInput, { target: { value: 'not-valid-email' } })
		fireEvent.click(submitPersonalDataButton)

		await waitFor(() => {
			expect(mockedAddSnack).not.toHaveBeenCalledTimes(1)
			expect(mockedHistoryPush).not.toHaveBeenCalledWith('/dashboard')
			expect(mockedUpdateUser).not.toHaveBeenCalledTimes(1)
		})

		mockedAddSnack.mockClear()
		mockedUpdateUser.mockClear()
		mockedHistoryPush.mockClear()

		fireEvent.change(screen.getByTestId('old-password-field'), {
			target: { value: '123123' },
		})
		fireEvent.change(screen.getByTestId('new-password-field'), {
			target: { value: '123123' },
		})
		fireEvent.change(screen.getByTestId('confirm-passworda-field'), {
			target: { value: 'wrong-confirmation' },
		})

		const submitNewPasswordButton = screen.getByTestId(
			'submit-new-password-button',
		)

		fireEvent.click(submitNewPasswordButton)

		await waitFor(() => {
			expect(mockedAddSnack).not.toHaveBeenCalledTimes(1)
			expect(mockedHistoryPush).not.toHaveBeenCalledWith('/dashboard')
			expect(mockedUpdateUser).not.toHaveBeenCalledTimes(1)
		})
	})

	it('should be able to see when some error occurred in the backend', async () => {
		render(<EditProfile />)
		apiMock.onPut('/profile').reply(400, {})
		apiMock.onPut('/profile/password').reply(400, {})

		const submitPersonalDataButton = screen.getByTestId(
			'submit-personal-data-button',
		)

		fireEvent.click(submitPersonalDataButton)

		await waitFor(() => {
			expect(mockedAddSnack).toHaveBeenCalledTimes(1)
			expect(mockedUpdateUser).not.toHaveBeenCalled()
			expect(mockedHistoryPush).not.toHaveBeenCalled()
		})

		mockedAddSnack.mockClear()
		mockedUpdateUser.mockClear()
		mockedHistoryPush.mockClear()

		fireEvent.change(screen.getByTestId('old-password-field'), {
			target: { value: '123123' },
		})
		fireEvent.change(screen.getByTestId('new-password-field'), {
			target: { value: '123123' },
		})
		fireEvent.change(screen.getByTestId('confirm-passworda-field'), {
			target: { value: '123123' },
		})

		const submitNewPasswordButton = screen.getByTestId(
			'submit-new-password-button',
		)

		fireEvent.click(submitNewPasswordButton)

		await waitFor(() => {
			expect(mockedAddSnack).toHaveBeenCalledTimes(1)
			expect(mockedUpdateUser).not.toHaveBeenCalled()
			expect(mockedHistoryPush).not.toHaveBeenCalled()
		})
	})

	it('should be able to update the password', async () => {
		render(<EditProfile />)
		apiMock.onPut('/profile/password').reply(200, {})
		fireEvent.change(screen.getByTestId('old-password-field'), {
			target: { value: '123123' },
		})
		fireEvent.change(screen.getByTestId('new-password-field'), {
			target: { value: '123123' },
		})
		fireEvent.change(screen.getByTestId('confirm-passworda-field'), {
			target: { value: '123123' },
		})

		const submitNewPasswordButton = screen.getByTestId(
			'submit-new-password-button',
		)

		fireEvent.click(submitNewPasswordButton)

		await waitFor(() => {
			expect(mockedAddSnack).toHaveBeenCalledTimes(1)
			expect(mockedHistoryPush).toHaveBeenCalledWith('/dashboard')
		})
	})

	it('should be able to change the user profile picture', async () => {
		render(<EditProfile />)
		apiMock.onPatch('/users/avatar').reply(200, {})
		const file = new File([new ArrayBuffer(1)], 'file.jpg')

		fireEvent.change(screen.getByTestId('image-input'), {
			target: { files: [file] },
		})

		await waitFor(() => {
			expect(mockedAddSnack).toHaveBeenCalledTimes(1)
			expect(mockedUpdateUser).toHaveBeenCalledTimes(1)
		})
	})

	it('should not be able to change the user profile picture if some error occurred in backend', async () => {
		render(<EditProfile />)
		apiMock.onPatch('/users/avatar').reply(400, {})
		const file = new File([new ArrayBuffer(1)], 'file.jpg')

		fireEvent.change(screen.getByTestId('image-input'), {
			target: { files: [file] },
		})

		await waitFor(() => {
			expect(mockedAddSnack).toHaveBeenCalledTimes(1)
			expect(mockedUpdateUser).not.toHaveBeenCalledTimes(1)
		})
	})
})
