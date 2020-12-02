import { fireEvent, render, waitFor } from '@testing-library/react'
import React from 'react'
import AppContainer from '../../components/AppContainer'

const mockedHistoryPush = jest.fn()
const mockedSignOut = jest.fn()
const mockedAddSnack = jest.fn()

jest.mock('../../hooks/auth', () => {
	return {
		useAuth: () => ({
			user: {
				id: 'user-id',
				user_name: 'user-name',
				restaurant_name: 'restaurant-name',
				email: 'email',
				cnpj: '11222333444412',
				avatar_url: 'url.jpg',
			},
			signOut: mockedSignOut,
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

jest.mock('../../hooks/snack', () => {
	return {
		useSnack: () => ({
			addSnack: mockedAddSnack,
		}),
	}
})

describe('AppContainer Component', () => {
	beforeEach(() => {
		mockedHistoryPush.mockClear()
	})
	it('should be able to render the container', async () => {
		const { getByTestId } = render(<AppContainer />)
		expect(getByTestId('container-appcontainer')).toBeTruthy()
	})

	it('should be able to go to dashboard when click on title', async () => {
		const { getByTestId } = render(<AppContainer />)
		const title = getByTestId('besystem-title')

		fireEvent.click(title)

		await waitFor(() => {
			expect(mockedHistoryPush).toHaveBeenCalledWith('/')
		})
	})

	it('should be able to logout when click signout button', async () => {
		const { getByTestId } = render(<AppContainer />)

		const btSignOut = getByTestId('signout-button')

		fireEvent.click(btSignOut)

		await waitFor(() => {
			expect(mockedSignOut).toHaveBeenCalled()
			expect(mockedAddSnack).toHaveBeenCalled()
		})
	})

	it('should be able to open and close the side menu', async () => {
		const { getByTestId, queryByTestId } = render(<AppContainer />)

		const menuXFalsy = queryByTestId('menu-x')
		await waitFor(() => {
			expect(menuXFalsy).toBeFalsy()
		})

		const menuMenuTruthy = getByTestId('menu-menu')
		await waitFor(() => {
			expect(menuMenuTruthy).toBeTruthy()
		})

		fireEvent.click(menuMenuTruthy)

		const menuXTruthy = getByTestId('menu-x')
		await waitFor(() => {
			expect(menuXTruthy).toBeTruthy()
		})

		const menuMenuFalsy = queryByTestId('menu-menu')
		await waitFor(() => {
			expect(menuMenuFalsy).toBeFalsy()
		})

		fireEvent.click(menuXTruthy)
		const menuXFinal = queryByTestId('menu-x')
		const menuMenuFinal = queryByTestId('menu-menu')
		await waitFor(() => {
			expect(menuXFinal).toBeFalsy()
		})
		await waitFor(() => {
			expect(menuMenuFinal).toBeTruthy()
		})
	})
})
