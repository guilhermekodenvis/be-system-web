import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import Button from '../../components/Button'
import { useModule } from '../../hooks/module'
import api from '../../services/api'

import { Container, RequestItem, RequestList } from './styles'

interface TableRequest {
	id: string
	number: number
	products: Array<Products>
}

interface Products {
	quantity: number
	product_price: number
	product_name: string
}

const TableRequestDetails: React.FC = () => {
	const history = useHistory()
	const { table_id } = useParams<{ table_id: string }>()
	const [tableRequest, setTableRequest] = useState<TableRequest>()
	useEffect(() => {
		;(async () => {
			const { data } = await api.get(`/table-request/${table_id}`)
			setTableRequest(data)
		})()
	}, [table_id])
	const { changeModule } = useModule()

	useEffect(() => {
		changeModule('requests')
	}, [changeModule])

	return (
		<Container>
			<h1>Mesa {tableRequest?.number}</h1>
			<p>Veja os pedidos da mesa {tableRequest?.number}.</p>
			<div className="top">
				<strong>
					Total:{' '}
					<span>
						{new Intl.NumberFormat('pt-BR', {
							currency: 'BRL',
							style: 'currency',
						}).format(
							tableRequest?.products.reduce(
								(a, b) => a + (b.product_price * b.quantity || 0),
								0,
							) || 0,
						)}
					</span>
				</strong>
				<Button
					label="ADICIONAR"
					variant="secundary-outline"
					onClick={() => history.push(`/adicionar-produto/${tableRequest?.id}`)}
				/>
			</div>
			<RequestList>
				{tableRequest?.products.map((product, i) => {
					return (
						<RequestItem key={i}>
							<strong>
								{product.quantity}x {product.product_name}
							</strong>
							<p>
								Total:{' '}
								<span>
									{new Intl.NumberFormat('pt-BR', {
										style: 'currency',
										currency: 'BRL',
									}).format(product.product_price)}
								</span>
							</p>
						</RequestItem>
					)
				})}
			</RequestList>
		</Container>
	)
}

export default TableRequestDetails
