import { render, waitFor } from '@testing-library/react'
import React from 'react'
import Button from '../../components/Button'
import 'jest-styled-components'

describe('Button component', () => {
	it('should be able to render a simple button', async () => {
		const { getByTestId } = render(<Button label="Teste" />)
		await waitFor(() => {
			expect(getByTestId('button-component')).toBeTruthy()
		})
	})

	// FOI OBSERVADO QUE OS TESTES DE ESTILO SÃO IRRELEVANTES, PORÉM, ESTE FOI DEIXADO PARA TÍTULO DE CONSULTA
	it('should be outline red when "cancel" variant is setted', async () => {
		const { getByTestId } = render(<Button label="Teste" variant="cancel" />)
		const bt = getByTestId('button-component')

		await waitFor(() => {
			expect(bt).toHaveStyleRule('border', '1px solid #d95267')
			expect(bt).toHaveStyleRule('background', 'transparent')
			expect(bt).toHaveStyleRule('color', '#d95267')
			expect(bt).toHaveStyleRule('font-weight', 'bold')
		})
	})
})
