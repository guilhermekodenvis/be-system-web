import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import React, { useCallback, useRef } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import * as Yup from 'yup'
import Button from '../../../components/Button'
import Input from '../../../components/Input'
import Title from '../../../components/Title'
import { useSnack } from '../../../hooks/snack'
import api from '../../../services/api'
import getValidationErrors from '../../../utils/getValidationErrors'

import { Header, Container } from './styles'

interface FormNewPasswordData {
	password: string
	confirm_password: string
}

const NewPassword: React.FC = () => {
	const formRef = useRef<FormHandles>(null)
	const { addSnack } = useSnack()
	const history = useHistory()

	const params = useParams<{ token: string }>()

	const handleSubmit = useCallback(
		async (data: FormNewPasswordData) => {
			try {
				formRef.current?.setErrors({})

				const schema = Yup.object().shape({
					password: Yup.string().required('Senha obrigatória'),
					confirm_password: Yup.string()
						.required('A confirmação de senha é obrigatória.')
						.oneOf([Yup.ref('password')], 'As senhas precisam ser iguais.'),
				})

				await schema.validate(data, {
					abortEarly: false,
				})

				await api.post('/password/reset', {
					password: data.password,
					token: params.token,
				})

				addSnack({
					title: 'Sucesso!',
					description: 'A sua senha foi alterada',
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
					type: 'danger',
					title: 'Oops',
					description:
						'Ocorreu um erro no servidor, nosso time já está sendo notificado.',
				})
			}
		},
		[addSnack, history, params.token],
	)

	return (
		<>
			<Title />
			<Header>
				<h1>Esqueci minha senha</h1>
				<p>Digite sua nova senha.</p>
			</Header>
			<Container data-testid="new-password-page">
				<Form onSubmit={handleSubmit} ref={formRef}>
					<div>
						<Input
							label="Nova senha"
							name="password"
							type="password"
							data-testid="new-password-input"
						/>
						<Input
							label="Confirme a nova senha"
							name="confirm_password"
							type="password"
							data-testid="confirm-password-input"
						/>
					</div>
					<Button
						label="Alterar senha"
						size="big"
						type="submit"
						data-testid="submit-button"
					/>
				</Form>
			</Container>
		</>
	)
}

export default NewPassword
