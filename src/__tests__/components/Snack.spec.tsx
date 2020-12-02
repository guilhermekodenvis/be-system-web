import React from 'react'
import { render, waitFor } from '@testing-library/react'
import Snack from '../../components/SnackContainer/Snack'

describe('Snack component', () => {
	it('should be able to render a Snack component', async () => {
		const { getByText } = render(
			<Snack
				style={{}}
				message={{
					id: 'test-id',
					title: 'test-title',
					description: 'test-description',
					type: 'success',
				}}
			/>,
		)
		await waitFor(() => {
			expect(getByText('test-title')).toBeTruthy()
			expect(getByText('test-description')).toBeTruthy()
		})
	})
})
