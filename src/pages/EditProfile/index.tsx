import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import React, { ChangeEvent, useCallback, useRef } from 'react'
import { FiCamera } from 'react-icons/fi'
import { useHistory } from 'react-router-dom'
import * as Yup from 'yup'
import Button from '../../components/Button'
import Input from '../../components/Input'
import PageHeader from '../../components/PageHeader'
import { useAuth } from '../../hooks/auth'
import { useSnack } from '../../hooks/snack'
import api from '../../services/api'
import getValidationErrors from '../../utils/getValidationErrors'

import { Container, ProfilePic, PersonalData, ChangePassword } from './styles'

interface PersonalFormData {
	restaurant_name: string
	user_name: string
	email: string
	cnpj: string
}

interface PasswordFormData {
	old_password: string
	new_password: string
	confirm_password: string
}

const EditProfile: React.FC = () => {
	const { user, updateUser } = useAuth()
	const { addSnack } = useSnack()
	const history = useHistory()
	const formRefPersonalData = useRef<FormHandles>(null)
	const formRefChangePassword = useRef<FormHandles>(null)

	const handleSubmitPersonalData = useCallback(
		async (data: PersonalFormData) => {
			try {
				formRefPersonalData.current?.setErrors({})

				const schema = Yup.object().shape({
					restaurant_name: Yup.string().required(
						'Coloque o nome do restaurante.',
					),
					user_name: Yup.string().required('Digite o seu nome.'),
					email: Yup.string()
						.required('E-mail obrigatório')
						.email('Digite um e-mail válido'),
					cnpj: Yup.string().length(14, 'Digite um cnpj válido.'),
				})

				await schema.validate(data, {
					abortEarly: false,
				})

				const response = await api.put('profile', data)
				updateUser(response.data)
				addSnack({
					title: 'Perfil atualizado',
					type: 'success',
				})
				history.push('/')
			} catch (err) {
				if (err instanceof Yup.ValidationError) {
					const errors = getValidationErrors(err)
					formRefPersonalData.current?.setErrors(errors)
					return
				}

				addSnack({
					title: 'Erro ao atualizar',
					description: 'Tente novamente mais tarde.',
					type: 'danger',
				})
				console.log(err)
			}
		},
		[addSnack, history, updateUser],
	)

	const handleSubmitChangePassword = useCallback(
		async (data: PasswordFormData) => {
			try {
				formRefChangePassword.current?.setErrors({})

				const schema = Yup.object().shape({
					old_password: Yup.string().required('Digite a senha antiga.'),
					new_password: Yup.string().required('Digite a senha nova.'),
					confirm_password: Yup.string()
						.required('A confirmação de senha é obrigatória.')
						.oneOf(
							[Yup.ref('new_password')],
							'A confirmação precisa ser igual à nova senha.',
						),
				})

				await schema.validate(data, {
					abortEarly: false,
				})

				const dataChange = {
					password: data.new_password,
					old_password: data.old_password,
				}

				const response = await api.put('profile/password', dataChange)
				updateUser(response.data)
				addSnack({
					title: 'Senha atualizado',
					type: 'success',
				})
				history.push('/')
			} catch (err) {
				if (err instanceof Yup.ValidationError) {
					const errors = getValidationErrors(err)
					formRefChangePassword.current?.setErrors(errors)
					return
				}

				addSnack({
					title: 'Erro ao atualizar',
					description: 'Tente novamente mais tarde.',
					type: 'danger',
				})
				console.log(err)
			}
		},
		[addSnack, history, updateUser],
	)

	const handleAvatarChange = useCallback(
		(e: ChangeEvent<HTMLInputElement>) => {
			if (e.target.files) {
				const data = new FormData()

				data.append('avatar', e.target.files[0])

				api.patch('/users/avatar', data).then(response => {
					updateUser(response.data)

					addSnack({
						type: 'success',
						title: 'Avatar atualizado!',
					})
				})
			}
		},
		[addSnack, updateUser],
	)

	return (
		<>
			<PageHeader title="Editar perfil" />
			<Container>
				<ProfilePic>
					<div>
						<img src={user.avatar_url} alt={user.restaurant_name} />
						<label htmlFor="avatar">
							<FiCamera size={24} />

							<input
								type="file"
								id="avatar"
								accept="image/*"
								onChange={handleAvatarChange}
							/>
						</label>
					</div>
				</ProfilePic>
				<PersonalData>
					<h2>Dados de cadastro</h2>
					<Form
						onSubmit={handleSubmitPersonalData}
						initialData={user}
						ref={formRefPersonalData}
					>
						<Input label="Nome do restaurante" name="restaurant_name" />
						<Input label="Seu nome" name="user_name" />
						<Input label="Email" name="email" />
						<Input label="CNPJ" name="cnpj" />
						<Button
							label="salvar alteração"
							variant="secundary"
							size="big"
							type="submit"
						/>
					</Form>
				</PersonalData>
				<ChangePassword>
					<h2>Trocar a senha</h2>
					<Form
						onSubmit={handleSubmitChangePassword}
						ref={formRefChangePassword}
					>
						<Input label="Senha atual" name="old_password" type="password" />
						<Input label="Nova senha" name="new_password" type="password" />
						<Input
							label="Confirmar nova senha"
							name="confirm_password"
							type="password"
						/>
						<Button
							label="trocar senha"
							variant="primary"
							size="big"
							type="submit"
						/>
					</Form>
				</ChangePassword>
			</Container>
		</>
	)
}

export default EditProfile
