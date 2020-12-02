import { render } from '@testing-library/react'
import React from 'react'
import Input from '../../components/Input'

jest.mock('@unform/core', () => {
	return {
		useField() {
			return {
				fieldName: 'email',
				defaultValue: '',
				error: '',
				registerField: jest.fn(),
			}
		},
	}
})
// TODO: FINALIZAR OS TESTES
// VALIDAR A PARTE SE O ERRO FOI EXIBIDO NA TELA, ETC

describe('Input component', () => {
	it('should be able to render the input', () => {
		const { getByLabelText } = render(<Input label="Email" name="email" />)

		expect(getByLabelText('Email')).toBeTruthy()
	})
})
