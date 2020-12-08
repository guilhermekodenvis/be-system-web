import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { FiDollarSign, FiList, FiPlus, FiShoppingCart } from 'react-icons/fi'
import { useHistory } from 'react-router-dom'
import { Container, FAB, TableRequest, ButtonGroup, DashEmpty } from './styles'

import api from '../../services/api'
import { useModule } from '../../hooks/module'
import { useSnack } from '../../hooks/snack'
import PageHeader from '../../components/PageHeader'
import Toast from '../../components/Toast'
import convertNumberToBRLCurrency from '../../utils/convertNumberToBRLCurrency'

interface TableRequest {
	id: string
	number: number
	total: number
}

const Dashboard: React.FC = () => {
	const [tableRequests, setTableRequests] = useState<TableRequest[]>()
	const history = useHistory()
	const [isCashierOpen, setIsCashierOpen] = useState(false)
	const { changeModule } = useModule()
	const { addSnack } = useSnack()

	useEffect(() => {
		;(async () => {
			try {
				const { data } = await api.get('/table-request')
				setTableRequests(data)
			} catch {
				addSnack({
					title: 'Erro',
					description:
						'Houve um erro interno no servidor, nossa equipe já está sendo avisada. Tente novamente',
					type: 'danger',
				})
			}
		})()
		changeModule('requests')
	}, [addSnack, changeModule])

	useEffect(() => {
		;(async () => {
			try {
				const { data } = await api.get('/cashier/situation')
				setIsCashierOpen(data.isOpen)
			} catch {
				addSnack({
					title: 'Erro',
					description:
						'Houve um erro interno no servidor, nossa equipe já está sendo avisada. Tente novamente',
					type: 'danger',
				})
			}
		})()
	}, [addSnack])

	const handleFABClick = useCallback(() => {
		if (isCashierOpen) {
			history.push('/novo-pedido')
		} else {
			addSnack({
				title: 'Atenção',
				description:
					'Você ainda não pode anotar pedidos, pois não há nenhum caixa aberto no momento.',
				type: 'warning',
			})
			history.push('/caixa')
		}
	}, [addSnack, history, isCashierOpen])

	const emptyDashMessage = useMemo(() => {
		return (
			tableRequests?.length === 0 && (
				<DashEmpty>
					<h2 data-testid="empty-data-message">
						Parece que não há nenhuma mesa ocupada no momento...
					</h2>
					{!isCashierOpen && (
						<h2 data-testid="closed-cashier-message">
							O caixa ainda está fechado. Abra-o para anotar pedidos.
						</h2>
					)}
				</DashEmpty>
			)
		)
	}, [isCashierOpen, tableRequests])

	const tableRequestList = useMemo(() => {
		return tableRequests?.map((tableRequest, i) => (
			<TableRequest key={i} data-testid="table-request">
				<h2>Mesa {tableRequest.number}</h2>
				<p>Total: {convertNumberToBRLCurrency(tableRequest.total)}</p>
				<ButtonGroup>
					<button
						data-testid="details-button"
						onClick={() =>
							history.push(`detalhes-do-pedido/${tableRequest.id}`)
						}
					>
						<Toast label="Detalhes">
							<FiList size={24} />
						</Toast>
					</button>
					<button
						data-testid="add-products-button"
						onClick={() => history.push(`adicionar-produto/${tableRequest.id}`)}
					>
						<Toast label="Anotar">
							<FiShoppingCart size={24} />
						</Toast>
					</button>
					<button
						onClick={() => history.push(`finalizar/${tableRequest.id}`)}
						data-testid="payment-button"
					>
						<Toast label="Pagar">
							<FiDollarSign size={24} />
						</Toast>
					</button>
				</ButtonGroup>
			</TableRequest>
		))
	}, [history, tableRequests])

	return (
		<Container data-testid="dashboard-page">
			<PageHeader
				title="Pedidos em aberto"
				description="Clique na mesa para ver os pedidos"
				noBackButton
			/>
			<div className="tables">
				{emptyDashMessage}

				{tableRequestList}
			</div>
			<FAB onClick={handleFABClick} data-testid="fab-button">
				<FiPlus size={24} />
			</FAB>
		</Container>
	)
}

export default Dashboard
