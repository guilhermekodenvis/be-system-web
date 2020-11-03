import { Form } from '@unform/web'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { FiPlusCircle, FiTrash2 } from 'react-icons/fi'
import { useParams } from 'react-router-dom'
import Button from '../../components/Button'
import Input from '../../components/Input'
import { useAuth } from '../../hooks/auth'
import { useModule } from '../../hooks/module'
import api from '../../services/api'

import { Container, Header, Body, Left, Right, PaymentList } from './styles'

interface DataForm {
	value: number
	type: string
}

interface PaymentMethod {
	value: number
	type: string
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

	useEffect(() => {
		changeModule('cashier')
	}, [changeModule])
	const {
		user: { id: user_id },
	} = useAuth()
	const { table_id } = useParams<{ table_id: string }>()
	const handleSubmit = useCallback((data: DataForm) => {
		setPaymentMethods(prev => [...prev, data])
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
			console.log(data)
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
				setPaymentMethods(prev => [...prev, { type: '5', value: payback }])
			}
			const { data } = await api.post('/cashier-moviments/finish-payment', {
				payments: paymentMethods,
			})

			console.log(data)
		} catch (err) {
			console.log(err)
		}
	}, [payback, paymentMethods])

	return (
		<Container>
			<Header>
				<h1>Pagar pedido</h1>
				<p>Detalhes do pedido e pagamento</p>
			</Header>
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
						<Input label="Valor" name="value" />
						<Input label="" name="type" />
						<button>
							<FiPlusCircle size={24} />
						</button>
					</Form>
					<PaymentList>
						{paymentMethods.map((paymentMethod, i) => {
							return (
								<li key={i}>
									<p>{paymentMethod.value}</p>
									<p>{paymentMethod.type}</p>
									<button onClick={() => handleDelete(i)}>
										<FiTrash2 size={24} />
									</button>
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
