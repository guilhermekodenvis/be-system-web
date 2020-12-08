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
import typeToCashierMovimentName from '../../utils/typeToCashierMovimentName'

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
				const { data } = await api.get('/cashier')
				setCashierMoviments(data)
			} catch {
				addSnack({
					type: 'danger',
					title: 'Oops!',
					description:
						'Algum erro aconteceu, nosso suporte já está sendo informado, use ctrl + f5.',
				})
			}
		})()

		changeModule('cashier')
	}, [addSnack, changeModule])

	const cashierMovimentsElement = useMemo(() => {
		return cashierMoviments?.cashier_moviments?.map((cashierMoviment, i) => {
			return (
				<tr key={i}>
					<td>{typeToCashierMovimentName(cashierMoviment.action)}</td>
					<td>{convertNumberToBRLCurrency(cashierMoviment.value)}</td>
				</tr>
			)
		})
	}, [cashierMoviments])

	const handleSubmit = useCallback(
		async (data: FormData) => {
			try {
				await api.post('/cashier/close', data)

				addSnack({
					type: 'success',
					title: 'Sucesso!',
					description: 'O agora o caixa está fechado.',
				})

				history.push('/cashier')
			} catch {
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
			<Container data-testid="close-cashier-page">
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
							<Button
								data-testid="close-cashier-button"
								label="Confirmar e fechar caixa"
								type="submit"
							/>
						</Form>
					</Right>
				</div>
			</Container>
		</>
	)
}

export default CloseCashier
