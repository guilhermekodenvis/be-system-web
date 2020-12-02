import { fireEvent, render, waitFor } from '@testing-library/react'
import React from 'react'
import PageHeader from '../../components/PageHeader'

const mockedHistoryGoBack = jest.fn()

jest.mock('react-router-dom', () => {
	return {
		useHistory: () => ({
			goBack: mockedHistoryGoBack,
		}),
		// Link: ({ children }: { children: React.ReactNode }) => children,
	}
})

describe('PageHeader component', () => {
	it('should be able to render the pageheader', async () => {
		const { getByText } = render(
			<PageHeader title="Teste" description="Testando o page header" />,
		)

		await waitFor(() => {
			expect(getByText('Testando o page header')).toBeTruthy()
			expect(getByText('Teste')).toBeTruthy()
		})
	})

	it('should be able to return one page', async () => {
		const { getByTestId } = render(
			<PageHeader title="Teste" description="Testando o page header" />,
		)

		const backButton = getByTestId('backbutton-pageheader')

		fireEvent.click(backButton)

		await waitFor(() => {
			expect(mockedHistoryGoBack).toHaveBeenCalled()
		})
	})
})
