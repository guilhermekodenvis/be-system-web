import React, { useEffect, useMemo, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import Button from '../../components/Button'
import PageHeader from '../../components/PageHeader'
import { useModule } from '../../hooks/module'
import { useSnack } from '../../hooks/snack'
import api from '../../services/api'
import convertNumberToBRLCurrency from '../../utils/convertNumberToBRLCurrency'

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
	const { addSnack } = useSnack()
	useEffect(() => {
		;(async () => {
			try {
				const { data } = await api.get(`/table-request/${table_id}`)
				setTableRequest(data)
			} catch {
				addSnack({
					title: 'Erro!',
					description:
						'Ocorreu um erro no servidor, nossa equipe já está sendo avisada. Recarregue a página',
					type: 'danger',
				})
			}
		})()
	}, [addSnack, table_id])
	const { changeModule } = useModule()

	useEffect(() => {
		changeModule('requests')
	}, [changeModule])

	const mappedProducts = useMemo(() => {
		return tableRequest?.products.map((product, i) => {
			return (
				<RequestItem key={i} data-testid="product-element-in-list">
					<strong>
						{product.quantity}x {product.product_name}
					</strong>
					<p>
						Total:{' '}
						<span>{convertNumberToBRLCurrency(product.product_price)}</span>
					</p>
				</RequestItem>
			)
		})
	}, [tableRequest])

	const totalValue = useMemo(() => {
		return (
			tableRequest?.products.reduce(
				(a, b) => a + b.product_price * b.quantity,
				0,
			) || 0
		)
	}, [tableRequest])
	return (
		<Container data-testid="table-request-details-page">
			<PageHeader
				title={`Mesa ${tableRequest?.number}`}
				description={`Veja os pedidos da mesa ${tableRequest?.number}.`}
			/>
			<div className="top">
				<strong>
					Total: <span>{convertNumberToBRLCurrency(totalValue)}</span>
				</strong>
				<Button
					data-testid="bt-add-products"
					label="ADICIONAR"
					variant="secundary-outline"
					onClick={() => history.push(`/adicionar-produto/${tableRequest?.id}`)}
				/>
			</div>
			<RequestList>{mappedProducts}</RequestList>
		</Container>
	)
}

export default TableRequestDetails
