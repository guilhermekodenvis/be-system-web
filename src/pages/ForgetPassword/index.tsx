import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import React, { useCallback, useRef } from 'react'
import * as Yup from 'yup'
import Button from '../../components/Button'
import Input from '../../components/Input'
import Title from '../../components/Title'
import api from '../../services/api'
import getValidationErrors from '../../utils/getValidationErrors'

import { Header, Container } from './styles'

interface ForgetPasswordFormData {
	email: string
}

const ForgetPassword: React.FC = () => {
	const formRef = useRef<FormHandles>(null)

	const handleSubmit = useCallback(async (data: ForgetPasswordFormData) => {
		try {
			formRef.current?.setErrors({})

			const schema = Yup.object().shape({
				email: Yup.string()
					.required('E-mail obrigatório')
					.email('Digite um e-mail válido'),
			})

			await schema.validate(data, {
				abortEarly: false,
			})

			await api.post('/password/forgot', data)
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
	}, [])

	return (
		<>
			<Title />
			<Header>
				<h1>Esqueci minha senha</h1>
				<p>Um e-mail será enviado para fazer uma nova senha.</p>
			</Header>
			<Container>
				<Form onSubmit={handleSubmit} ref={formRef}>
					<Input label="E-mail" name="email" />
					<Button label="Enviar e-mail" size="big" type="submit" />
				</Form>
			</Container>
		</>
	)
}

export default ForgetPassword
