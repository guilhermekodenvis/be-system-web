import React, { useEffect, useMemo, useState } from 'react'
import { FiDollarSign, FiList } from 'react-icons/fi'
import { useHistory } from 'react-router-dom'
import Button from '../../components/Button'
import PageHeader from '../../components/PageHeader'
import Toast from '../../components/Toast'
import { useModule } from '../../hooks/module'
import { useSnack } from '../../hooks/snack'
import api from '../../services/api'

import { Container, Main, Left, Right, ButtonGroup, Table } from './styles'

interface TableRequestDetails {
	id: string
	number: number
	total: number
	products: Array<Product>
}

interface Product {
	quantity: number
	product_name: string
	product_price: number
}

type TableRequest = Omit<TableRequestDetails, 'products'>

const Cashier: React.FC = () => {
	const [tableDetailsId, setTableDetailsId] = useState('')
	const [details, setDetails] = useState<TableRequestDetails>(
		{} as TableRequestDetails,
	)
	const [tableRequests, setTableRequests] = useState<Array<TableRequest>>([])
	const { addSnack } = useSnack()

	const { changeModule } = useModule()

	useEffect(() => {
		changeModule('cashier')
	}, [changeModule])

	const history = useHistory()
	useEffect(() => {
		;(async () => {
			try {
				const { data } = await api.get('/cashier/situation')
				if (!data.isOpen) {
					history.push('abrir-caixa')
				}
			} catch {
				addSnack({
					title: 'Oops',
					description:
						'Algum erro ocorreu no servidor, nosso suporte já está sendo notificado.',
					type: 'danger',
				})
			}
		})()
	}, [addSnack, history])

	useEffect(() => {
		;(async () => {
			try {
				const response = await api.get('/table-request')
				setTableRequests(response.data)
			} catch {
				addSnack({
					title: 'Oops',
					description:
						'Algum erro ocorreu no servidor, nosso suporte já está sendo notificado.',
					type: 'danger',
				})
			}
		})()
	}, [addSnack])

	useEffect(() => {
		if (tableDetailsId !== '') {
			;(async () => {
				try {
					const response = await api.get(`table-request/${tableDetailsId}`)
					setDetails(response.data)
				} catch {
					addSnack({
						title: 'Erro!',
						description:
							'Ocorreu um erro no servidor, nossa equipe já está sendo notificada',
						type: 'danger',
					})
				}
			})()
		}
	}, [addSnack, tableDetailsId])

	const allTableRequestsElement = useMemo(() => {
		const elementTableRequests = tableRequests.map(tableRequest => {
			return (
				<li key={tableRequest.id}>
					<h3>Mesa {tableRequest.number}</h3>
					<p>
						Total:{' '}
						{new Intl.NumberFormat('pt-BR', {
							currency: 'BRL',
							style: 'currency',
						}).format(tableRequest.total)}
					</p>
					<ButtonGroup>
						<Toast label="Detalhes">
							<button
								data-testid="bt-details"
								onClick={e => setTableDetailsId(tableRequest.id)}
							>
								<FiList size={24} />
							</button>
						</Toast>
						<Toast label="Pagar">
							<button
								data-testid="bt-payment"
								onClick={() => history.push(`finalizar/${tableRequest.id}`)}
							>
								<FiDollarSign size={24} />
							</button>
						</Toast>
					</ButtonGroup>
				</li>
			)
		})

		return elementTableRequests
	}, [history, tableRequests])

	const tableDetailsElement = useMemo(() => {
		if (Object.keys(details).length === 0 && details.constructor === Object) {
			return (
				<>
					<h2>Selecione uma mesa para ver os detalhes...</h2>
				</>
			)
		}
		return (
			<>
				<h2>Detalhes do pedido da mesa {details.number}</h2>
				<div>
					<div>
						<strong>
							Total{' '}
							{new Intl.NumberFormat('pt-BR', {
								currency: 'BRL',
								style: 'currency',
							}).format(details.total)}
						</strong>
					</div>
					<Button
						variant="primary"
						label="Pagamento"
						onClick={() => history.push(`finalizar/${details.id}`)}
					/>
				</div>
				<Table>
					<thead>
						<tr>
							<th>Qtd.</th>
							<th>Produto</th>
							<th>Preço</th>
						</tr>
					</thead>
					<tbody>
						{details.products?.map((product, i) => {
							return (
								<tr key={i}>
									<td>{product.quantity}</td>
									<td>{product.product_name}</td>
									<td>
										{new Intl.NumberFormat('pt-BR', {
											style: 'currency',
											currency: 'BRL',
										}).format(product.product_price)}
									</td>
								</tr>
							)
						})}
					</tbody>
				</Table>
			</>
		)
	}, [details, history])

	const buttonCloseCashier = useMemo(() => {
		return allTableRequestsElement.length === 0 ? (
			<Button
				label="Fechar caixa"
				variant="primary"
				onClick={e => history.push('fechar-caixa')}
			/>
		) : (
			<Toast label="Só é possível fechar o caixa sem pedidos em aberto.">
				<Button label="Fechar caixa" variant="primary" disabled />
			</Toast>
		)
	}, [allTableRequestsElement.length, history])

	return (
		<Container>
			<PageHeader
				title="Caixa aberto"
				description="Realize o pagamento e a confirmação do pedido por aqui."
			/>
			<Main>
				<Left>
					<Button label="realizar sangria" variant="secundary" />
					{buttonCloseCashier}
					<h2>Pedidos em andamento</h2>
					<ul>{allTableRequestsElement}</ul>
				</Left>
				<Right>{tableDetailsElement}</Right>
			</Main>
		</Container>
	)
}

export default Cashier
