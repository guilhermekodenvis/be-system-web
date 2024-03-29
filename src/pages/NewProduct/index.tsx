import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import * as Yup from 'yup'
import { useHistory, useParams } from 'react-router-dom'
import Creatable from 'react-select/creatable'
import Button from '../../components/Button'
import Input from '../../components/Input'
import { useSnack } from '../../hooks/snack'
import api from '../../services/api'
import getValidationErrors from '../../utils/getValidationErrors'

import { Container } from './styles'
import { useModule } from '../../hooks/module'
import PageHeader from '../../components/PageHeader'
import InputMoney from '../../components/InputMoney'

interface FormNewProductData {
	name: string
	category: string
	price: string
}

interface Category {
	label: string
	value: string
}

const NewProduct: React.FC = () => {
	const history = useHistory()
	const formRef = useRef<FormHandles>(null)
	const { addSnack } = useSnack()
	const { changeModule } = useModule()
	const [categories, setCategories] = useState<Array<Category>>([])
	const [selectedCategory, setSelectedCategory] = useState<string>()
	const { product_id } = useParams<{ product_id: string }>()
	const [initialData, setInitialData] = useState({})

	useEffect(() => {
		changeModule('products')
	}, [changeModule])

	useEffect(() => {
		;(async () => {
			try {
				const { data } = await api.get<Array<string>>('/categories')

				const formattedCategories = data.map(category => {
					return { label: category, value: category }
				})

				setCategories(formattedCategories)
			} catch {
				addSnack({
					title: 'Oops!',
					description:
						'Ocorreu um erro no servidor, nosso suporte já está sendo notificado.',
					type: 'danger',
				})
			}
		})()
	}, [addSnack])

	useEffect(() => {
		;(async () => {
			try {
				const { data } = await api.get(`/products/${product_id || ''}`)
				setInitialData(data)
			} catch {
				addSnack({
					title: 'erro',
					description: 'Algum erro ocorreu no servidor',
					type: 'danger',
				})
			}
		})()
	}, [addSnack, product_id])
	const handleSubmit = useCallback(
		async (data: FormNewProductData) => {
			const formData = {
				category: data.category,
				name: data.name,
				price: Number(data.price.replace(',', '.')),
			}
			try {
				formRef.current?.setErrors({})
				const schema = Yup.object().shape({
					name: Yup.string().required('Dê um nome ao produto'),
					// category: Yup.string().required('Selecione uma categoria'),
					price: Yup.number()
						.required('Coloque um preço válido')
						.typeError('Coloque um preço válido'),
				})
				await schema.validate(formData, {
					abortEarly: false,
				})

				await api.post('/products', {
					...formData,
					category: selectedCategory,
				})
				addSnack({
					type: 'success',
					title: 'Sucesso!',
					description: 'O produto foi adicionado.',
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
				addSnack({
					title: 'Oops!',
					description:
						'Ocorreu um erro no servidor, nosso suporte já está sendo notificado.',
					type: 'danger',
				})
			}
		},
		[addSnack, history, selectedCategory],
	)

	const handleChange = useCallback((newValue: any) => {
		setSelectedCategory(newValue?.value)
	}, [])

	const handleClickCancel = useCallback(() => {
		history.push('/produtos')
	}, [history])

	return (
		<>
			<PageHeader
				title="Cadastrar produto"
				description="Adicione um novo produto à sua lista"
			/>
			<Container>
				<Form onSubmit={handleSubmit} ref={formRef} initialData={initialData}>
					<Input label="Nome" name="name" />

					<Creatable
						isClearable
						name="category"
						data={categories}
						onChange={handleChange}
						options={categories}
						placeholder="Digite a categoria..."
						styles={{
							singleValue: styles => ({
								...styles,
								color: '#E9E3FF',
							}),
							input: styles => ({
								...styles,
								color: '#E9E3FF',
							}),
							placeholder: styles => ({
								...styles,
								color: 'rgba(233,227,255,0.8)',
							}),
							control: styles => ({
								...styles,
								background: 'rgba(99,83,159,0.33)',
								border: '1px solid #e9e3ff',
								height: '54px',
							}),
							option: styles => ({
								...styles,
								width: '360px',
								color: '#1F1449',
							}),
							container: styles => ({
								...styles,
								width: '360px',
								marginBottom: '12px',
							}),
						}}
					/>

					<InputMoney label="Preço" name="price" />
					<div className="button-group">
						<Button
							label="Cancelar"
							variant="cancel"
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

export default NewProduct
