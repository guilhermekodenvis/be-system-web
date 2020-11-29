/* eslint-disable indent */
import { renderHook, act } from '@testing-library/react-hooks'
import MockAdapter from 'axios-mock-adapter'

import { useAuth, AuthProvider } from '../../hooks/auth'
import api from '../../services/api'

const apiMock = new MockAdapter(api)

describe('Auth hook', () => {
	it('should be able to sign in', async () => {
		const apiResponse = {
			user: {
				id: 'user-123',
				restaurant_name: 'John Doe',
				email: 'johndoe@example.com.br',
				cnpj: '11222333444412',
				user_name: 'Mae do nobrega',
				avatar_url: 'http://image.com',
			},
			token: 'token-123',
		}

		apiMock.onPost('sessions').reply(200, apiResponse)

		const setItemSpy = jest.spyOn(Storage.prototype, 'setItem')

		const { result, waitForNextUpdate } = renderHook(() => useAuth(), {
			wrapper: AuthProvider,
		})

		result.current.signIn({
			email: 'johndoe@example.com.br',
			password: '123456',
		})

		await waitForNextUpdate()

		expect(setItemSpy).toHaveBeenCalledWith(
			'@beSystem:token',
			apiResponse.token,
		)
		expect(setItemSpy).toHaveBeenCalledWith(
			'@beSystem:user',
			JSON.stringify(apiResponse.user),
		)

		expect(result.current.user.email).toEqual('johndoe@example.com.br')
	})

	it('should restore saved data from storage when auth inits', () => {
		jest.spyOn(Storage.prototype, 'getItem').mockImplementation(key => {
			switch (key) {
				case '@beSystem:token':
					return 'token-123'
				case '@beSystem:user':
					return JSON.stringify({
						id: 'user-123',
						name: 'John Doe',
						email: 'johndoe@example.com.br',
					})
				default:
					return null
			}
		})

		const { result } = renderHook(() => useAuth(), {
			wrapper: AuthProvider,
		})

		expect(result.current.user.email).toEqual('johndoe@example.com.br')
	})

	it('should be able to sign out', async () => {
		jest.spyOn(Storage.prototype, 'getItem').mockImplementation(key => {
			switch (key) {
				case '@beSystem:token':
					return 'token-123'
				case '@beSystem:user':
					return JSON.stringify({
						id: 'user-123',
						name: 'John Doe',
						email: 'johndoe@example.com.br',
					})
				default:
					return null
			}
		})

		const removeItemSpy = jest.spyOn(Storage.prototype, 'removeItem')

		const { result } = renderHook(() => useAuth(), {
			wrapper: AuthProvider,
		})

		act(() => {
			result.current.signOut()
		})

		expect(removeItemSpy).toHaveBeenCalledTimes(2)
		expect(result.current.user).toBeUndefined()
	})

	it('should be able to update user data', async () => {
		const setItemSpy = jest.spyOn(Storage.prototype, 'setItem')

		const { result } = renderHook(() => useAuth(), {
			wrapper: AuthProvider,
		})

		const user = {
			id: 'user-123',
			restaurant_name: 'John Doe',
			email: 'johndoe@example.com.br',
			avatar_url: 'image-test.jpg',
			cnpj: '11222333444411',
			user_name: 'Mae do nobrega',
		}

		act(() => {
			result.current.updateUser(user)
		})

		expect(setItemSpy).toHaveBeenCalledWith(
			'@beSystem:user',
			JSON.stringify(user),
		)

		expect(result.current.user).toEqual(user)
	})
})
