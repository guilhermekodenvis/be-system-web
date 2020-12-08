import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import React, { useCallback, useRef } from 'react'
import { useHistory } from 'react-router-dom'
import * as Yup from 'yup'
import Button from '../../components/Button'
import Input from '../../components/Input'
import Title from '../../components/Title'
import { useSnack } from '../../hooks/snack'
import api from '../../services/api'
import getValidationErrors from '../../utils/getValidationErrors'

import { Header, Container } from './styles'

interface ForgetPasswordFormData {
	email: string
}

const ForgetPassword: React.FC = () => {
	const formRef = useRef<FormHandles>(null)
	const { addSnack } = useSnack()
	const history = useHistory()

	const handleSubmit = useCallback(
		async (data: ForgetPasswordFormData) => {
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
				addSnack({
					title: 'Feito!',
					description:
						'Se seu email estiver na nossa base, um email será enviado para você',
					type: 'success',
				})
				history.push('/login')
			} catch (err) {
				if (err instanceof Yup.ValidationError) {
					const errors = getValidationErrors(err)

					formRef.current?.setErrors(errors)

					return
				}

				addSnack({
					title: 'Erro!',
					description:
						'Ocorreu um erro no servidor, nossa equipe já está sendo notificada',
					type: 'danger',
				})
			}
		},
		[addSnack, history],
	)

	return (
		<>
			<Title />
			<Header>
				<h1>Esqueci minha senha</h1>
				<p>Um e-mail será enviado para fazer uma nova senha.</p>
			</Header>
			<Container data-testid="forget-password-page">
				<Form onSubmit={handleSubmit} ref={formRef}>
					<Input label="E-mail" name="email" data-testid="email-field" />
					<Button
						label="Enviar e-mail"
						size="big"
						type="submit"
						data-testid="submit-button"
					/>
				</Form>
			</Container>
		</>
	)
}

export default ForgetPassword
