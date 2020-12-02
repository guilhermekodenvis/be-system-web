import React from 'react'
import { fireEvent, render, waitFor } from '@testing-library/react'
import SnackContainer from '../../components/SnackContainer'

const mockedAddSnack = jest.fn()
const mockedRemoveSnack = jest.fn()

jest.mock('../../hooks/snack', () => {
	return {
		useSnack: () => ({
			addSnack: mockedAddSnack,
			removeSnack: mockedRemoveSnack,
		}),
	}
})

describe('SnackContainer component', () => {
	beforeEach(() => {
		mockedRemoveSnack.mockClear()
	})

	it('should be able to render the snack container component displaying messages', async () => {
		const { getByText } = render(
			<SnackContainer
				messages={[
					{ title: 'test-1', id: 'test-1', description: 'test-1-description' },
					{ title: 'test-2', id: 'test-2' },
				]}
			/>,
		)
		await waitFor(() => {
			expect(getByText('test-1')).toBeTruthy()
			expect(getByText('test-2')).toBeTruthy()
		})
	})

	it('should be able to remove a snack', async () => {
		const { getAllByTestId } = render(
			<SnackContainer
				messages={[
					{ title: 'test-1', id: 'test-1', description: 'test-1-description' },
					{ title: 'test-2', id: 'test-2' },
				]}
			/>,
		)
		const removeSnackButton = getAllByTestId('remove-snack-button')

		fireEvent.click(removeSnackButton[0])

		await waitFor(() => {
			expect(mockedRemoveSnack).toHaveBeenCalled()
		})
	})

	it('should be able to remove a snack after 3 seconds', async () => {
		render(
			<SnackContainer
				messages={[
					{ title: 'test-1', id: 'test-1', description: 'test-1-description' },
					{ title: 'test-2', id: 'test-2' },
				]}
			/>,
		)

		await waitFor(
			() => {
				expect(mockedRemoveSnack).toHaveBeenCalled()
			},
			{ timeout: 3100 },
		)
	})
})
