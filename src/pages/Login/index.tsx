import React, { useCallback, useRef } from 'react'
import { Form } from '@unform/web'
import * as Yup from 'yup'

import { FormHandles } from '@unform/core'
import { Link, useHistory } from 'react-router-dom'
import Title from '../../components/Title'
import Input from '../../components/Input'

import { useAuth } from '../../hooks/auth'
// import { useToast } from '../../hooks/toast'

import getValidationErrors from '../../utils/getValidationErrors'
import Button from '../../components/Button'

import { ButtonGroup, Header, Bottom, Container } from './styles'

interface SignInFormData {
	email: string
	password: string
}

const Login: React.FC = () => {
	const formRef = useRef<FormHandles>(null)

	const { signIn } = useAuth()
	// const { addToast } = useToast()
	const history = useHistory()

	const handleGoToRegister = useCallback(() => {
		history.push('/registrar')
	}, [history])

	const handleSubmit = useCallback(
		async (data: SignInFormData) => {
			try {
				formRef.current?.setErrors({})

				const schema = Yup.object().shape({
					email: Yup.string()
						.required('E-mail obrigatório')
						.email('Digite um e-mail válido'),
					password: Yup.string().required('Senha obrigatória'),
				})

				await schema.validate(data, {
					abortEarly: false,
				})

				await signIn({
					email: data.email,
					password: data.password,
				})

				history.push('/')
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
		// [addToast, history, signIn],
		[history, signIn],
	)

	return (
		<Container>
			<Title />
			<Header>Login</Header>
			<Form ref={formRef} onSubmit={handleSubmit}>
				<Input label="E-mail" name="email" type="email" />
				<Input label="Senha" name="password" type="password" />
				<ButtonGroup>
					<Link to="esqueci-a-senha">Esqueceu a senha?</Link>
					<Button label="Entrar" type="submit" />
				</ButtonGroup>
			</Form>
			<Bottom>
				<p>OU</p>
				<Button
					label="Registre-se"
					variant="secundary"
					size="big"
					onClick={handleGoToRegister}
				/>
			</Bottom>
		</Container>
	)
}

export default Login
