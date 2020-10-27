import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import React, { useCallback, useRef } from 'react'
import { useHistory } from 'react-router-dom'
import * as Yup from 'yup'
import Button from '../../components/Button'
import Input from '../../components/Input'
import Title from '../../components/Title'
import api from '../../services/api'
import getValidationErrors from '../../utils/getValidationErrors'

import { Header, Container } from './styles'

interface RegisterFormData {
	restaurant_name: string
	user_name: string
	email: string
	password: string
	password_confirm: string
	cnpj: string
}

const Register: React.FC = () => {
	const formRef = useRef<FormHandles>(null)
	const history = useHistory()

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

				await api.post('/users', data)

				history.push('/login')
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
		[history],
	)
	return (
		<Container>
			<Title />
			<Header>Registre-se</Header>
			<Form onSubmit={handleSubmit} ref={formRef}>
				<Input label="Nome do restaurante" name="restaurant_name" />
				<Input label="Seu nome" name="user_name" />
				<Input label="Seu e-mail" name="email" />
				<Input label="Senha" name="password" type="password" />
				<Input
					label="Confirme a senha"
					name="password_confirm"
					type="password"
				/>
				<Input label="CNPJ" name="cnpj" />
				<Button label="Registrar" size="big" type="submit" />
			</Form>
		</Container>
	)
}

export default Register
