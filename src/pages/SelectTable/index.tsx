import { Form } from '@unform/web'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import * as Yup from 'yup'
import { FormHandles } from '@unform/core'
import { useHistory } from 'react-router-dom'
import Button from '../../components/Button'
import Input from '../../components/Input'
import getValidationErrors from '../../utils/getValidationErrors'

import { Container } from './styles'
import api from '../../services/api'
import { useModule } from '../../hooks/module'

interface ContinueToRequestFormData {
	table_number: string
}

const SelectTable: React.FC = () => {
	const { changeModule } = useModule()

	useEffect(() => {
		changeModule('requests')
	}, [changeModule])
	const history = useHistory()
	const formRef = useRef<FormHandles>(null)
	const handleSubmit = useCallback(
		async (formData: ContinueToRequestFormData) => {
			try {
				formRef.current?.setErrors({})

				const schema = Yup.object().shape({
					table_number: Yup.number()
						.required('Informe a mesa')
						.typeError('A mesa precisa ser um número.'),
				})

				await schema.validate(formData, {
					abortEarly: false,
				})

				const {
					data: { id },
				} = await api.post('/table-request', formData)

				history.push(`/adicionar-produto/${id}`)
			} catch (err) {
				if (err instanceof Yup.ValidationError) {
					const errors = getValidationErrors(err)

					formRef.current?.setErrors(errors)

					return
				}

				console.log(err)

				// addToast({
				// 	type: 'error',
				// 	title: 'Erro na autenticação',
				// 	description: 'Ocorreu um erro ao fazer login, cheque as credenciais.',
				// })
			}
		},
		[],
	)
	return (
		<Container>
			<h1>Novo pedido</h1>
			<p>Indique a mesa para continuar.</p>
			<Form onSubmit={handleSubmit} ref={formRef}>
				<Input label="Número da mesa" name="table_number" />
				<Button label="continuar" size="big" type="submit" />
			</Form>
		</Container>
	)
}

export default SelectTable
