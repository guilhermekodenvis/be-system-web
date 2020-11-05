import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'
import * as Yup from 'yup'
import Button from '../../components/Button'
import Input from '../../components/Input'
import { useModule } from '../../hooks/module'
import { useSnack } from '../../hooks/snack'
import api from '../../services/api'
import getValidationErrors from '../../utils/getValidationErrors'

import { Container, Details, Header, Relatory } from './styles'

interface FormData {
	observation: string
}

interface CashierMoviment {
	action: number
	value: number
}

const CloseCashier: React.FC = () => {
	const { changeModule } = useModule()
	const [cashierMoviments, setCashierMoviments] = useState<CashierMoviment[]>(
		[],
	)
	const formRef = useRef<FormHandles>(null)
	const { addSnack } = useSnack()
	const history = useHistory()

	useEffect(() => {
		;(async () => {
			try {
				const { data } = await api.get('/cashier-moviments')
				setCashierMoviments(data)
			} catch (err) {
				console.log(err.message)
			}
		})()

		changeModule('cashier')
	}, [changeModule])

	const cashierMovimentsElement = useMemo(() => {
		console.log(cashierMoviments)
		return cashierMoviments.map((cashierMoviment, i) => {
			return (
				<tr key={i}>
					<td>{cashierMoviment.action}</td>
					<td>{cashierMoviment.value}</td>
				</tr>
			)
		})
	}, [cashierMoviments])

	const handleSubmit = useCallback(
		async (data: FormData) => {
			try {
				formRef.current?.setErrors({})
				const schema = Yup.object().shape({
					observation: Yup.string().required(),
				})

				await schema.validate(data, {
					abortEarly: false,
				})

				const resp = await api.post('/cashier-moviments/close', data)
				addSnack({
					type: 'success',
					title: 'Sucesso!',
					description: 'O agora o caixa está fechado.',
				})

				console.log(resp.data)

				history.push('/')
			} catch (err) {
				if (err instanceof Yup.ValidationError) {
					addSnack({
						type: 'danger',
						title: 'Oops!',
						description: 'Corrija os campos para cadastrar o produto.',
					})
					const errors = getValidationErrors(err)

					formRef.current?.setErrors(errors)

					return
				}

				console.log(err)

				// addToast({
				// 	type: 'error',
				// 	title: 'Erro na autenticação',
				// 	description: 'Ocorreu um erro ao fazer login, cheque as credenciais.',
				// })
			}
		},
		[addSnack, history],
	)

	return (
		<>
			<Header>
				<h1>Fechar o caixa</h1>
				<p>Confirme toda a movimentação e feche o caixa.</p>
			</Header>
			<Container>
				<div>
					<Details>
						<div>
							<strong>Dinheiro em caixa</strong>
							<p>R$ 2000,00</p>
						</div>
						<div>
							<strong>Faturamento toal</strong>
							<p>R$ 6000,00</p>
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
				<div>
					<Form onSubmit={handleSubmit} ref={formRef}>
						<Input label="Obervação" name="observation" />
						<Button label="Confirmar e fechar caixa" type="submit" />
					</Form>
				</div>
			</Container>
		</>
	)
}

export default CloseCashier
