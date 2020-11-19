/* eslint-disable indent */
import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'
import Button from '../../components/Button'
import Input from '../../components/Input'
import PageHeader from '../../components/PageHeader'
import { useModule } from '../../hooks/module'
import { useSnack } from '../../hooks/snack'
import api from '../../services/api'
import convertNumberToBRLCurrency from '../../utils/convertNumberToBRLCurrency'

import { Container, Details, Relatory, Right } from './styles'

interface FormData {
	observation: string
}

interface CashierMoviment {
	action: number
	value: number
}

interface CloseCashier {
	cashier_moviments: CashierMoviment[]
	money_in_cashier: number
	brute_total_money: number
}

const CloseCashier: React.FC = () => {
	const { changeModule } = useModule()
	const [cashierMoviments, setCashierMoviments] = useState<CloseCashier>(
		{} as CloseCashier,
	)
	const formRef = useRef<FormHandles>(null)
	const { addSnack } = useSnack()
	const history = useHistory()

	useEffect(() => {
		;(async () => {
			try {
				const { data } = await api.get('/cashier-moviments')
				console.log(data)
				setCashierMoviments(data)
			} catch (err) {
				console.log(err)
			}
		})()

		changeModule('cashier')
	}, [changeModule])

	const convertType = useCallback((type: number) => {
		if (type === 0) {
			return 'Abertura'
		}
		if (type === 1) {
			return 'Débito'
		}
		if (type === 2) {
			return 'Crédito'
		}
		if (type === 3) {
			return 'Dinheiro'
		}
		if (type === 4) {
			return 'Sangria'
		}
		if (type === 5) {
			return 'Troco'
		}
		if (type === 6) {
			return 'Fechamento'
		}
		return ''
	}, [])

	const cashierMovimentsElement = useMemo(() => {
		return cashierMoviments?.cashier_moviments?.map((cashierMoviment, i) => {
			return (
				<tr key={i}>
					<td>{convertType(cashierMoviment.action)}</td>
					<td>{convertNumberToBRLCurrency(cashierMoviment.value)}</td>
				</tr>
			)
		})
	}, [cashierMoviments, convertType])

	const handleSubmit = useCallback(
		async (data: FormData) => {
			try {
				await api.post('/cashier-moviments/close', data)

				addSnack({
					type: 'success',
					title: 'Sucesso!',
					description: 'O agora o caixa está fechado.',
				})

				history.push('/')
			} catch (err) {
				console.log(err)
				addSnack({
					type: 'danger',
					title: 'Oops!',
					description: 'A senha informada está incorreta.',
				})
			}
		},
		[addSnack, history],
	)

	return (
		<>
			<PageHeader
				title="Fechar o caixa"
				description="Confirme toda a movimentação e feche o caixa."
			/>
			<Container>
				<div>
					<Details>
						<div>
							<strong>Dinheiro em caixa</strong>
							<p>
								{convertNumberToBRLCurrency(cashierMoviments?.money_in_cashier)}
							</p>
						</div>
						<div>
							<strong>Valor bruto total</strong>
							<p>
								{convertNumberToBRLCurrency(
									cashierMoviments?.brute_total_money,
								)}
							</p>
						</div>
					</Details>
					<Relatory>
						<h2>Relatório de caixa</h2>
						<table>
							<thead>
								<tr>
									<th>Tipo</th>
									<th>Valor</th>
								</tr>
							</thead>
							<tbody>{cashierMovimentsElement}</tbody>
						</table>
					</Relatory>
				</div>
				<div style={{ marginTop: 0 }}>
					<Right>
						<h2>Continue para fechar</h2>
						<Form onSubmit={handleSubmit} ref={formRef}>
							<Input label="Obervação" name="observation" />
							<Input
								label="Sua senha"
								name="password"
								type="password"
								style={{ width: 360 }}
							/>
							<Button label="Confirmar e fechar caixa" type="submit" />
						</Form>
					</Right>
				</div>
			</Container>
		</>
	)
}

export default CloseCashier
