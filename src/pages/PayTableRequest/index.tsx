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
		;(async () => {
			const { data } = await api.get('/cashier-moviments/situation')
			if (!data.isOpen) {
				history.push('/abrir-caixa')
				addSnack({
					title: 'Atenção!',
					description: 'O caixa precisa estar aberto para anotar pagamentos.',
					type: 'warning',
				})
			}
		})()
	}, [addSnack, history])

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

	const total = useMemo(() => {
		return tableRequest.products?.reduce(
			(a, b) => a + (b.product_price * b.quantity || 0),
			0,
		)
	}, [tableRequest.products])

	const totalFormatted = useMemo(() => {
		return new Intl.NumberFormat('pt-BR', {
			currency: 'BRL',
			style: 'currency',
		}).format(total)
	}, [total])

	const paid = useMemo(() => {
		return paymentMethods.reduce((a, b) => Number(a) + Number(b.value), 0)
	}, [paymentMethods])

	const paidFormatted = useMemo(() => {
		return new Intl.NumberFormat('pt-BR', {
			currency: 'BRL',
			style: 'currency',
		}).format(paid)
	}, [paid])

	const rest = useMemo(() => {
		if (total < paid) {
			return 0
		}
		return total - paid || 0
	}, [paid, total])

	const restFormatted = useMemo(() => {
		return new Intl.NumberFormat('pt-BR', {
			currency: 'BRL',
			style: 'currency',
		}).format(rest)
	}, [rest])

	const payback = useMemo(() => {
		if (paid > total) {
			return paid - total
		}
		return 0
	}, [paid, total])

	const paybackFormatted = useMemo(() => {
		return new Intl.NumberFormat('pt-BR', {
			currency: 'BRL',
			style: 'currency',
		}).format(payback)
	}, [payback])

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
			history.push('/')
		} catch (err) {
			console.log(err)
		}
	}, [addSnack, history, payback, paymentMethods, table_id])

	const namefyPaymentMethod = useCallback((paymentMethod: number) => {
		if (paymentMethod === 1) {
			return 'Débito'
		}
		if (paymentMethod === 2) {
			return 'Crédito'
		}
		if (paymentMethod === 3) {
			return 'Dinheiro'
		}
		return 'error'
	}, [])

	return (
		<Container>
			<PageHeader
				title={`Pagar pedido da mesa ${tableRequest.number}`}
				description="Detalhes do pedido e pagamento"
			/>

			<Body>
				<Left>
					<div className="payment-info">
						<div>
							<strong>Total</strong>
							<span>{totalFormatted}</span>
						</div>
						<div>
							<strong>Pago</strong>
							<span>{paidFormatted}</span>
						</div>
						<div>
							<strong>Restante</strong>
							<span>{restFormatted}</span>
						</div>
						<div>
							<strong>Troco</strong>
							<span>{paybackFormatted}</span>
						</div>
					</div>
					<div className="title-payment">
						<h2>Pagamentos</h2>
						<Button
							label="Finalizar e imprimir"
							onClick={handleClickCloseRequest}
						/>
					</div>
					<Form onSubmit={handleSubmit}>
						<InputMoney label="Valor" name="value" />
						<SelectInput
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
						<button type="submit">
							<FiPlusCircle size={24} />
						</button>
					</Form>
					<PaymentList>
						{paymentMethods.map((paymentMethod, i) => {
							return (
								<li key={i}>
									<p>
										{new Intl.NumberFormat('pt-BR', {
											style: 'currency',
											currency: 'BRL',
										}).format(paymentMethod.value)}
									</p>
									<p>{namefyPaymentMethod(paymentMethod.type)}</p>
									<Toast label="Remover">
										<button onClick={() => handleDelete(i)}>
											<FiTrash2 size={24} />
										</button>
									</Toast>
								</li>
							)
						})}
					</PaymentList>
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
						<tbody>
							{tableRequest.products?.map((product, i) => {
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
					</table>
				</Right>
			</Body>
		</Container>
	)
}

export default PayTableRequest
