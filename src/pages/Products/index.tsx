import React, { useEffect, useState } from 'react'
import { FiTrash2, FiEdit3 } from 'react-icons/fi'
import PageHeader from '../../components/PageHeader'
import Toast from '../../components/Toast'
import { useModule } from '../../hooks/module'
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

	const { changeModule } = useModule()

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
	return (
		<>
			<PageHeader
				title="Meus produtos"
				description="Essa é sua lista de produtos, edite, delete ou insira novos."
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
										<FiEdit3 color="#e6be4c" />
									</Toast>
									<Toast label="Excluir">
										<FiTrash2 color="#d95267" />
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
