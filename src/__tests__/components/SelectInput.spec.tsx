import { render, waitFor } from '@testing-library/react'
import React from 'react'
import SelectInput from '../../components/SelectInput'

jest.mock('@unform/core', () => {
	return {
		useField() {
			return {
				fieldName: 'value',
				defaultValue: '',
				error: 'testing error',
				registerField: jest.fn(),
			}
		},
	}
})

describe('SelectInput component', () => {
	it('should be able to render the selectInput', async () => {
		const { getByText } = render(
			<SelectInput
				data={[
					{ label: 'teste-1', value: 'teste-1' },
					{ label: 'teste-2', value: 'teste-2' },
				]}
				label="Select Test"
				name="selectTest"
			/>,
		)

		await waitFor(() => {
			expect(getByText('Select Test')).toBeTruthy()
		})
	})

	it('should be able to display the error message', async () => {
		const { getByText } = render(
			<SelectInput
				data={[
					{ label: 'teste-1', value: 'teste-1' },
					{ label: 'teste-2', value: 'teste-2' },
				]}
				label="Select Test"
				name="selectTest"
			/>,
		)

		await waitFor(() => {
			expect(getByText('testing error')).toBeTruthy()
		})
	})
})
