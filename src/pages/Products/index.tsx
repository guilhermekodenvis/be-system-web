import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { FiTrash2, FiEdit3 } from 'react-icons/fi'
import { useHistory } from 'react-router-dom'
import Button from '../../components/Button'
import PageHeader from '../../components/PageHeader'
import Toast from '../../components/Toast'
import { useModule } from '../../hooks/module'
import { useSnack } from '../../hooks/snack'
import api from '../../services/api'
import convertNumberToBRLCurrency from '../../utils/convertNumberToBRLCurrency'

import { Table, ActionsGroup } from './styles'

interface Product {
	id: string
	name: string
	category: string
	price: number
}

const Products: React.FC = () => {
	const [products, setProducts] = useState<Product[]>([])
	const history = useHistory()
	const { changeModule } = useModule()
	const { addSnack } = useSnack()

	useEffect(() => {
		changeModule('products')
	}, [changeModule])

	useEffect(() => {
		;(async () => {
			try {
				const { data } = await api.get<Product[]>('/products')

				setProducts(data)
			} catch {
				addSnack({
					title: 'Erro',
					description:
						'Ocorreu um erro no servidor, nossa equipe já está cuidando disso, tente novamente',
					type: 'danger',
				})
			}
		})()
	}, [addSnack])

	const handleClickEdit = useCallback(
		(productId: string) => {
			history.push(`editar-produto/${productId}`)
		},
		[history],
	)

	const handleClickDelete = useCallback(
		async (productId: string) => {
			try {
				await api.delete(`products/${productId}`)
				addSnack({
					title: 'Sucesso!',
					description: 'O produto foi deletado.',
					type: 'success',
				})

				const newProducts = products?.filter(
					product => product.id !== productId,
				)

				setProducts(newProducts)
			} catch (err) {
				addSnack({
					title: 'Oops!',
					description: 'Algo deu errado, tente novamente.',
					type: 'danger',
				})
			}
		},
		[addSnack, products],
	)

	const productsList = useMemo(() => {
		if (products.length === 0) {
			return (
				<h2>
					Ainda não há produtos. Cadastre um novo clicando no botão acima.
				</h2>
			)
		}
		return (
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
					{products.map(product => (
						<tr key={product.id} data-testid="product-element">
							<td>{product.name}</td>
							<td>{product.category}</td>
							<td>{convertNumberToBRLCurrency(product.price)}</td>
							<ActionsGroup>
								<div>
									<Toast label="Editar">
										<FiEdit3
											data-testid="edit-button"
											color="#e6be4c"
											onClick={e => handleClickEdit(product.id)}
										/>
									</Toast>
									<Toast label="Excluir">
										<FiTrash2
											data-testid="delete-button"
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
		)
	}, [handleClickDelete, handleClickEdit, products])

	return (
		<div data-testid="products-page">
			<PageHeader
				title="Meus produtos"
				description="Essa é sua lista de produtos, edite, delete ou insira novos."
			/>
			<Button
				data-testid="go-to-new-product-page-button"
				label="Novo produto"
				variant="primary"
				style={{ marginLeft: 'auto', display: 'block', marginRight: '96px' }}
				onClick={e => history.push('/novo-produto')}
			/>

			{productsList}
		</div>
	)
}

export default Products
