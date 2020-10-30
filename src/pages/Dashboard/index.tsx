import React, { useEffect, useState } from 'react'

import { FiPlus } from 'react-icons/fi'
import { useHistory } from 'react-router-dom'
import { Container, FAB, TableRequest } from './styles'

import addToCartIcon from '../../assets/add-to-cart.svg'

interface TableRequest {
	table_number: number
	accumulated: number
}

const Dashboard: React.FC = () => {
	const [tableRequests, setTableRequests] = useState<TableRequest[]>()
	const history = useHistory()
	useEffect(() => {
		setTableRequests([
			{
				table_number: 3,
				accumulated: 29.9,
			},
			{
				table_number: 7,
				accumulated: 19.9,
			},
			{
				table_number: 13,
				accumulated: 292.9,
			},
			{
				table_number: 43,
				accumulated: 2.9,
			},
		])
	}, [])

	return (
		<Container>
			<h1>Pedidos em aberto</h1>
			<p>Clique na mesa para ver os pedidos</p>
			<div className="tables">
				{tableRequests?.map((tableRequest, i) => (
					<TableRequest key={i}>
						<h2>Mesa {tableRequest.table_number}</h2>
						<p>Valor total: {tableRequest.accumulated}</p>
						<button
							onClick={() =>
								history.push(`/adicionar-produto/${tableRequest.table_number}`)
							}
						>
							<img src={addToCartIcon} alt="add to cart" />
						</button>
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
