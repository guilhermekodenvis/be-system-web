import { Form } from '@unform/web'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { FiPlusCircle, FiTrash2 } from 'react-icons/fi'
import { useHistory, useParams } from 'react-router-dom'
import Button from '../../components/Button'
import InputMoney from '../../components/InputMoney'
import PageHeader from '../../components/PageHeader'
import SelectInput from '../../components/SelectInput'
import Toast from '../../components/Toast'
import { useModule } from '../../hooks/module'
import { useSnack } from '../../hooks/snack'
import api from '../../services/api'
import convertNumberToBRLCurrency from '../../utils/convertNumberToBRLCurrency'
import typeToCashierMovimentName from '../../utils/typeToCashierMovimentName'

import { Container, Body, Left, Right, PaymentList } from './styles'

interface DataForm {
	value: string
	type: number
}

interface PaymentMethod {
	value: number
	type: number
}

interface TableRequest {
	number: number
	total: number
	products: Array<Products>
}

interface Products {
	product_name: string
	quantity: number
	product_price: number
}

const PayTableRequest: React.FC = () => {
	const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
	const [tableRequest, setTableRequest] = useState<TableRequest>(
		{} as TableRequest,
	)
	const { changeModule } = useModule()
	const { addSnack } = useSnack()
	const { table_id } = useParams<{ table_id: string }>()
	const history = useHistory()

	useEffect(() => {
		changeModule('cashier')
	}, [changeModule])

	const handleSubmit = useCallback(({ value, type }: DataForm) => {
		const realValue = Number(value.replace(',', '.'))
		setPaymentMethods(prev => [
			...prev,
			{ value: realValue, type: Number(type) },
		])
	}, [])

	const handleDelete = useCallback((i: number) => {
		setPaymentMethods(prev => {
			const dup = [...prev]
			dup.splice(i, 1)
			return [...dup]
		})
	}, [])

	useEffect(() => {
		;(async () => {
			const { data } = await api.get(`/table-request/${table_id}`)
			setTableRequest(data)
		})()
	}, [table_id])

	const paid = useMemo(() => {
		return paymentMethods.reduce((a, b) => Number(a) + Number(b.value), 0)
	}, [paymentMethods])

	const rest = useMemo(() => {
		if (tableRequest.total < paid) {
			return 0
		}
		return tableRequest.total - paid || 0
	}, [paid, tableRequest.total])

	const payback = useMemo(() => {
		if (paid > tableRequest.total) {
			return paid - tableRequest.total
		}
		return 0
	}, [paid, tableRequest.total])

	const handleClickCloseRequest = useCallback(async () => {
		try {
			if (payback > 0) {
				await api.post('/cashier-moviments/finish-payment', {
					payments: [...paymentMethods, { type: 5, value: payback }],
					table_id,
				})
			} else {
				await api.post('/cashier-moviments/finish-payment', {
					payments: paymentMethods,
					table_id,
				})
			}
			addSnack({
				title: 'Sucesso!',
				description: 'O pagamento foi finalizado',
				type: 'success',
			})
			history.push('/caixa')
		} catch (err) {
			addSnack({
				title: 'Erro!',
				description:
					'Deu um erro no servidor, nossos mestres da programação estão cuidando disso. Recarregue e tente novamente',
				type: 'danger',
			})
		}
	}, [addSnack, history, payback, paymentMethods, table_id])

	const paymentList = useMemo(() => {
		return paymentMethods.map((paymentMethod, i) => {
			return (
				<li key={i} data-testid="payment-item">
					<p>
						{new Intl.NumberFormat('pt-BR', {
							style: 'currency',
							currency: 'BRL',
						}).format(paymentMethod.value)}
					</p>
					<p>{typeToCashierMovimentName(paymentMethod.type)}</p>
					<Toast label="Remover">
						<button
							data-testid="delete-payment-button"
							onClick={() => handleDelete(i)}
						>
							<FiTrash2 size={24} />
						</button>
					</Toast>
				</li>
			)
		})
	}, [handleDelete, paymentMethods])

	const tableRequestList = useMemo(() => {
		return tableRequest.products?.map((product, i) => {
			return (
				<tr key={i} data-testid="product-element">
					<td>{product.quantity}</td>
					<td>{product.product_name}</td>
					<td>{convertNumberToBRLCurrency(product.product_price)}</td>
				</tr>
			)
		})
	}, [tableRequest])

	return (
		<Container data-testid="pay-table-request-page">
			<PageHeader
				title={`Pagar pedido da mesa ${tableRequest.number}`}
				description="Detalhes do pedido e pagamento"
			/>

			<Body>
				<Left>
					<div className="payment-info">
						<div>
							<strong>Total</strong>
							<span data-testid="total">
								{convertNumberToBRLCurrency(tableRequest.total)}
							</span>
						</div>
						<div>
							<strong>Pago</strong>
							<span data-testid="paid">{convertNumberToBRLCurrency(paid)}</span>
						</div>
						<div>
							<strong>Restante</strong>
							<span data-testid="rest">{convertNumberToBRLCurrency(rest)}</span>
						</div>
						<div>
							<strong>Troco</strong>
							<span data-testid="payback">
								{convertNumberToBRLCurrency(payback)}
							</span>
						</div>
					</div>
					<div className="title-payment">
						<h2>Pagamentos</h2>
						<Button
							data-testid="close-and-print-button"
							label="Finalizar e imprimir"
							onClick={handleClickCloseRequest}
						/>
					</div>
					<Form onSubmit={handleSubmit}>
						<InputMoney label="Valor" name="value" data-testid="money-field" />
						<SelectInput
							dataTestId="payment-method-field"
							data={[
								{
									label: 'Débito',
									value: 1,
								},
								{
									label: 'Crédito',
									value: 2,
								},
								{
									label: 'Dinheiro',
									value: 3,
								},
							]}
							name="type"
							label="Método"
						/>
						<button type="submit" data-testid="add-payment-method-button">
							<FiPlusCircle size={24} />
						</button>
					</Form>
					<PaymentList>{paymentList}</PaymentList>
				</Left>
				<Right>
					<h2>Lista de pedidos</h2>
					<table>
						<thead>
							<tr>
								<th>Qtd.</th>
								<th>Produto</th>
								<th>Preço</th>
							</tr>
						</thead>
						<tbody>{tableRequestList}</tbody>
					</table>
				</Right>
			</Body>
		</Container>
	)
}

export default PayTableRequest
