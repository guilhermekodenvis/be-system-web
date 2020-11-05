import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import React, { useCallback, useEffect, useRef } from 'react'
import { FiArrowLeft } from 'react-icons/fi'
import * as Yup from 'yup'
import { useHistory } from 'react-router-dom'
import Button from '../../components/Button'
import Input from '../../components/Input'
import { useSnack } from '../../hooks/snack'
import api from '../../services/api'
import getValidationErrors from '../../utils/getValidationErrors'

import { Container, Header } from './styles'
import { useModule } from '../../hooks/module'

interface FormNewProductData {
	name: string
	category: string
	price: number
	ingredients: string
	description: string
}

const NewProduct: React.FC = () => {
	const history = useHistory()
	const formRef = useRef<FormHandles>(null)
	const { addSnack } = useSnack()
	const { changeModule } = useModule()

	useEffect(() => {
		changeModule('products')
	}, [changeModule])

	const handleSubmit = useCallback(
		async (data: FormNewProductData) => {
			try {
				formRef.current?.setErrors({})
				const schema = Yup.object().shape({
					name: Yup.string().required('Dê um nome ao produto'),
					category: Yup.string().required('Selecione uma categoria'),
					price: Yup.number().required('Coloque um preço no seu produto'),
				})
				await schema.validate(data, {
					abortEarly: false,
				})

				const resp = await api.post('/products', data)
				addSnack({
					type: 'success',
					title: 'Sucesso!',
					description: 'O produto foi adicionado.',
				})

				console.log(resp.data)

				history.push('/produtos')
			} catch (err) {
				if (err instanceof Yup.ValidationError) {
					addSnack({
						type: 'danger',
						title: 'Oops!',
						description: 'Corrija os campos para cadastrar o produto.',
					})
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
		[addSnack, history],
	)

	const handleClickCancel = useCallback(() => {
		console.log('cacelou')
	}, [])
	return (
		<Container>
			<Header>
				<div>
					<h1>Cadastrar Produto</h1>
					<button>
						<FiArrowLeft /> VOLTAR
					</button>
				</div>
				<p>Adicione um novo produto à sua lista</p>
			</Header>
			<Form onSubmit={handleSubmit} ref={formRef}>
				<Input label="Nome" name="name" />
				<Input label="Categoria" name="category" />
				<Input label="Preço" name="price" />
				<Input label="Ingredientes" name="ingredients" />
				<Input label="Descrição" name="description" />
				<div className="button-group">
					<Button
						label="Cancelar"
						variant="secundary"
						size="normal"
						type="button"
						onClick={handleClickCancel}
					/>
					<Button
						label="Salvar"
						variant="primary"
						size="normal"
						type="submit"
					/>
				</div>
			</Form>
		</Container>
	)
}

export default NewProduct
