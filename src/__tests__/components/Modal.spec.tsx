import { render, waitFor } from '@testing-library/react'
import React from 'react'
import Modal from '../../components/Modal'

let open = true
const closeModal = () => {
	open = false
}

const openModal = () => {
	open = true
}

describe('Modal component', () => {
	it('should be able to render the modal', async () => {
		const { getByText } = render(
			<Modal
				open={open}
				closeModal={closeModal}
				openModal={openModal}
				title="Testando Modal"
			/>,
		)

		await waitFor(() => {
			expect(getByText('Testando Modal')).toBeTruthy()
		})
	})
})
