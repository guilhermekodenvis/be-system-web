import React from 'react'
import { render, waitFor } from '@testing-library/react'
import Title from '../../components/Title'

describe('Title component', () => {
	it('should be able to render the title', async () => {
		const { getByText } = render(<Title />)
		await waitFor(() => {
			expect(getByText('beSystem')).toBeTruthy()
		})
	})
})
