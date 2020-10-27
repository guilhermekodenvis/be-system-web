import React, { useEffect, useState } from 'react'
import { FiArrowLeft, FiTrash2, FiEdit3 } from 'react-icons/fi'
import api from '../../services/api'

import { Container, Header, Table, ActionsGroup } from './styles'

interface Product {
	id: string
	name: string
	category: string
	priceFormatted: string
	price: string
}

const Products: React.FC = () => {
	const [products, setProducts] = useState<Omit<Product[], 'price'>>()

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
			<Container>
				<Header>
					<div>
						<h1>Meus produtos</h1>
						<button>
							<FiArrowLeft /> VOLTAR
						</button>
					</div>
					<p>Visualize sua lista de produtos</p>
				</Header>
			</Container>
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
								<FiEdit3 />
								<FiTrash2 />
							</ActionsGroup>
						</tr>
					))}
				</tbody>
			</Table>
		</>
	)
}

export default Products
