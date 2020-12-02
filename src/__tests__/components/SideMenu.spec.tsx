import React from 'react'
import { fireEvent, render, waitFor } from '@testing-library/react'
import SideMenu from '../../components/SideMenu'

const mockedHistoryPush = jest.fn()

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

describe('Sidemenu component', () => {
	it('should be able to render a sidemenu', async () => {
		const { getByTestId } = render(<SideMenu open={true} />)
		await waitFor(() => {
			expect(getByTestId('sidemenu-component')).toBeTruthy()
		})
	})

	it('should go to the correct pages', async () => {
		const { getByTestId } = render(<SideMenu open={true} />)

		const requestMenuItem = getByTestId('request-menu-item')
		const cashierMenuItem = getByTestId('cashier-menu-item')
		const productsMenuItem = getByTestId('products-menu-item')
		const openProfile = getByTestId('open-profile')

		fireEvent.click(requestMenuItem)
		await waitFor(() => {
			expect(mockedHistoryPush).toHaveBeenCalledWith('/')
		})

		fireEvent.click(cashierMenuItem)
		await waitFor(() => {
			expect(mockedHistoryPush).toHaveBeenCalledWith('/caixa')
		})

		fireEvent.click(productsMenuItem)
		await waitFor(() => {
			expect(mockedHistoryPush).toHaveBeenCalledWith('/produtos')
		})

		fireEvent.click(openProfile)
		await waitFor(() => {
			expect(mockedHistoryPush).toHaveBeenCalledWith('/editar-perfil')
		})
	})
})
