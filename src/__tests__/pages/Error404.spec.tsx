import { render, waitFor, screen } from '@testing-library/react'
import React from 'react'
import Error404 from '../../pages/Error404'

describe('Error404 page', () => {
	it('should be able to render correctly the page', async () => {
		render(<Error404 />)

		await waitFor(() => {
			expect(screen.getByTestId('error-404-page')).toBeTruthy()
		})
	})
})
