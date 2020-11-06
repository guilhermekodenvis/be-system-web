import React, { useEffect, useState } from 'react'

import { FiDollarSign, FiList, FiPlus, FiShoppingCart } from 'react-icons/fi'
import { useHistory } from 'react-router-dom'
import { Container, FAB, TableRequest, ButtonGroup } from './styles'

import api from '../../services/api'
import { useModule } from '../../hooks/module'
import { useSnack } from '../../hooks/snack'

interface TableRequest {
	id: string
	number: number
	products: Products[]
}

interface Products {
	product_price: number
	quantity: number
}

const Dashboard: React.FC = () => {
	const [tableRequests, setTableRequests] = useState<TableRequest[]>()
	const history = useHistory()
	const { changeModule } = useModule()
	const { addSnack } = useSnack()
	useEffect(() => {
		;(async () => {
			const { data } = await api.get('/table-request/')
			console.log(data)
			setTableRequests(data)
		})()
		changeModule('requests')
	}, [changeModule])

	return (
		<Container>
			<h1>Pedidos em aberto</h1>
			<p>Clique na mesa para ver os pedidos</p>
			<div className="tables">
				{tableRequests?.map((tableRequest, i) => (
					<TableRequest key={i}>
						<h2>Mesa {tableRequest.number}</h2>
						<p>
							Total:{' '}
							{new Intl.NumberFormat('pt-BR', {
								currency: 'BRL',
								style: 'currency',
							}).format(
								tableRequest.products?.reduce(
									(a, b) => a + (b.product_price * b.quantity || 0),
									0,
								) || 0,
							)}
						</p>
						<ButtonGroup>
							<button
								onClick={() =>
									history.push(`detalhes-do-pedido/${tableRequest.id}`)
								}
							>
								<FiList size={24} />
							</button>
							<button
								onClick={() =>
									history.push(`adicionar-produto/${tableRequest.id}`)
								}
							>
								<FiShoppingCart size={24} />
							</button>
							<button
								onClick={() => history.push(`finalizar/${tableRequest.id}`)}
							>
								<FiDollarSign size={24} />
							</button>
						</ButtonGroup>
					</TableRequest>
				))}
			</div>
			<FAB onClick={() => history.push('/novo-pedido')}>
				<FiPlus size={24} />
			</FAB>
		</Container>
	)
}

export default Dashboard
