import React, { useCallback, useEffect, useState } from 'react'
import { FiTrash2, FiEdit3 } from 'react-icons/fi'
import { useHistory } from 'react-router-dom'
import Button from '../../components/Button'
import PageHeader from '../../components/PageHeader'
import Toast from '../../components/Toast'
import { useModule } from '../../hooks/module'
import { useSnack } from '../../hooks/snack'
import api from '../../services/api'

import { Table, ActionsGroup } from './styles'

interface Product {
	id: string
	name: string
	category: string
	priceFormatted: string
	price: string
}

const Products: React.FC = () => {
	const [products, setProducts] = useState<Omit<Product[], 'price'>>()
	const history = useHistory()
	const { changeModule } = useModule()
	const { addSnack } = useSnack()

	useEffect(() => {
		changeModule('products')
	}, [changeModule])

	useEffect(() => {
		;(async () => {
			const { data } = await api.get<Product[]>('/products')
			const productsFormatted = data.map(product => {
				return {
					...product,
					priceFormatted: Number(product.price).toLocaleString('pt-br', {
						style: 'currency',
						currency: 'BRL',
					}),
				}
			})
			setProducts(productsFormatted)
		})()
	}, [])

	const handleClickEdit = useCallback(
		(productId: string) => {
			history.push(`editar-produto/${productId}`)
		},
		[history],
	)

	const handleClickDelete = useCallback(
		async (productId: string) => {
			try {
				const response = await api.delete(`products/${productId}`)
				addSnack({
					title: 'Sucesso!',
					description: 'O produto foi deletado.',
					type: 'success',
				})

				const newProducts = products?.filter(
					product => product.id !== productId,
				)

				setProducts(newProducts)

				console.log(response.data)
			} catch (err) {
				console.log(err)
				addSnack({
					title: 'Oops!',
					description: 'Algo deu errado, tente novamente.',
					type: 'danger',
				})
			}
		},
		[addSnack, products],
	)
	return (
		<>
			<PageHeader
				title="Meus produtos"
				description="Essa é sua lista de produtos, edite, delete ou insira novos."
			/>
			<Button
				label="Novo"
				variant="primary"
				style={{ marginLeft: 'auto', display: 'block', marginRight: '96px' }}
				onClick={e => history.push('novo-produto')}
			/>
			<Table>
				<thead>
					<tr>
						<th>Nome</th>
						<th>Categoria</th>
						<th>Preço</th>
						<th>Ações</th>
					</tr>
				</thead>
				<tbody>
					{products?.map(product => (
						<tr key={product.id}>
							<td>{product.name}</td>
							<td>{product.category}</td>
							<td>{product.priceFormatted}</td>
							<ActionsGroup>
								<div>
									<Toast label="Editar">
										<FiEdit3
											color="#e6be4c"
											onClick={e => handleClickEdit(product.id)}
										/>
									</Toast>
									<Toast label="Excluir">
										<FiTrash2
											color="#d95267"
											onClick={e => handleClickDelete(product.id)}
										/>
									</Toast>
								</div>
							</ActionsGroup>
						</tr>
					))}
				</tbody>
			</Table>
		</>
	)
}

export default Products
