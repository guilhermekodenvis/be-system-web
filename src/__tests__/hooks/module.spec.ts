import { renderHook } from '@testing-library/react-hooks'
import TestRenderer from 'react-test-renderer'
import { ModuleProvider, useModule } from '../../hooks/module'

const { act } = TestRenderer

describe('Module hook', () => {
	it('should be able to change module', async () => {
		const { result } = renderHook(() => useModule(), {
			wrapper: ModuleProvider,
		})

		act(() => {
			result.current.changeModule('cashier')
		})

		expect(result.current.moduleName).toEqual('cashier')
	})
})
