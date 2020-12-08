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

interface RegisterFormData {
	restaurant_name: string
	user_name: string
	email: string
	password: string
	password_confirm?: string
	cnpj: string
}

const Register: React.FC = () => {
	const formRef = useRef<FormHandles>(null)
	const history = useHistory()
	const { addSnack } = useSnack()

	const handleSubmit = useCallback(
		async (data: RegisterFormData) => {
			try {
				formRef.current?.setErrors({})

				const schema = Yup.object().shape({
					restaurant_name: Yup.string().required(
						'Coloque o nome do restaurante.',
					),
					user_name: Yup.string().required('Digite o seu nome.'),
					email: Yup.string()
						.required('E-mail obrigatório')
						.email('Digite um e-mail válido'),
					password: Yup.string().required('Senha obrigatória'),
					password_confirm: Yup.string()
						.required('A confirmação de senha é obrigatória.')
						.oneOf([Yup.ref('password')], 'As senhas precisam ser iguais.'),
					cnpj: Yup.string().length(14, 'Digite um cnpj válido.'),
				})

				await schema.validate(data, {
					abortEarly: false,
				})

				// eslint-disable-next-line no-param-reassign
				delete data.password_confirm

				await api.post('/users', data)

				history.push('/login')
			} catch (err) {
				if (err instanceof Yup.ValidationError) {
					const errors = getValidationErrors(err)
					formRef.current?.setErrors(errors)
					return
				}

				addSnack({
					type: 'danger',
					title: 'Erro na autenticação',
					description: 'Ocorreu um erro ao se cadastrar, tente novamente.',
				})
			}
		},
		[addSnack, history],
	)
	return (
		<Container data-testid="register-page">
			<Title />
			<Header>Registre-se</Header>
			<Form onSubmit={handleSubmit} ref={formRef}>
				<Input
					label="Nome do restaurante"
					name="restaurant_name"
					data-testid="restaurant-name-input"
				/>
				<Input
					label="Seu nome"
					name="user_name"
					data-testid="user-name-input"
				/>
				<Input label="Seu e-mail" name="email" data-testid="email-input" />
				<Input
					label="Senha"
					name="password"
					type="password"
					data-testid="password-input"
				/>
				<Input
					label="Confirme a senha"
					name="password_confirm"
					type="password"
					data-testid="confirm-password-input"
				/>
				<Input label="CNPJ" name="cnpj" data-testid="cnpj-input" />
				<Button
					label="Registrar"
					size="big"
					type="submit"
					data-testid="submit-button"
				/>
			</Form>
		</Container>
	)
}

export default Register
