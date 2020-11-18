import { FormHandles } from '@unform/core'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import * as Yup from 'yup'
import { Form } from '@unform/web'
import { useModule } from '../../hooks/module'
import { useSnack } from '../../hooks/snack'

import { Container } from './styles'
import api from '../../services/api'
import getValidationErrors from '../../utils/getValidationErrors'
import PageHeader from '../../components/PageHeader'
import Input from '../../components/Input'
import InputMoney from '../../components/InputMoney'
import Button from '../../components/Button'

interface FormEditProductData {
	name: string
	category: string
	price: number
}

const EditProduct: React.FC = () => {
	const history = useHistory()
	const formRef = useRef<FormHandles>(null)
	const { addSnack } = useSnack()
	const { changeModule } = useModule()
	const { product_id } = useParams<{ product_id: string }>()
	const [product, setProduct] = useState<FormEditProductData>()

	useEffect(() => {
		changeModule('products')
	}, [changeModule])

	useEffect(() => {
		;(async () => {
			const response = await api.get(`/products/${product_id}`)

			setProduct(response.data)
		})()
	}, [product_id])

	const handleSubmit = useCallback(
		async (data: FormEditProductData) => {
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

				await api.put(`/products/${product_id}`, data)
				addSnack({
					type: 'success',
					title: 'Sucesso!',
					description: 'O produto foi editado.',
				})

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
		[addSnack, history, product_id],
	)

	const handleClickCancel = useCallback(() => {
		console.log('cacelou')
	}, [])
	return (
		<>
			<PageHeader
				title="Cadastrar produto"
				description="Adicione um novo produto à sua lista"
			/>
			<Container>
				<Form onSubmit={handleSubmit} ref={formRef} initialData={product}>
					<Input label="Nome" name="name" />
					<Input label="Categoria" name="category" />
					<InputMoney label="Preço" name="price" />
					{/* <Input label="Ingredientes" name="ingredients" /> */}
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
		</>
	)
}

export default EditProduct
