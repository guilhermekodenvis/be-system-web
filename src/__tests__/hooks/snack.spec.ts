import { HookResult, renderHook } from '@testing-library/react-hooks'
import TestRenderer from 'react-test-renderer'
import React from 'react'
import { SnackProvider, useSnack, SnackContextData } from '../../hooks/snack'

const { act } = TestRenderer
describe('Snack hook', () => {
	let addSnackSpy: jest.SpyInstance
	let removeSnackSpy: jest.SpyInstance
	let id = ''
	let finalResult: HookResult<SnackContextData>
	beforeEach(() => {
		const { result } = renderHook(() => useSnack(), {
			wrapper: SnackProvider,
		})

		finalResult = result

		addSnackSpy = jest.spyOn(result.current, 'addSnack')

		act(() => {
			id = result.current.addSnack({
				title: 'teste',
				description: 'teste',
				type: 'success',
			})
		})
	})
	// TODO: MELHORAR OS TESTES PARA ESSE HOOK
	it('should be able to add a message', async () => {
		act(() => {
			finalResult.current.removeSnack(id)
		})

		expect(addSnackSpy).toHaveBeenCalledWith({
			title: 'teste',
			description: 'teste',
			type: 'success',
		})
	})
})
