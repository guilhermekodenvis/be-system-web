import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import printJS from 'print-js'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'
import Button from '../../components/Button'
import Input from '../../components/Input'
import InputMoney from '../../components/InputMoney'
import PageHeader from '../../components/PageHeader'
import { useModule } from '../../hooks/module'
import { useSnack } from '../../hooks/snack'
import api from '../../services/api'
import convertNumberToBRLCurrency from '../../utils/convertNumberToBRLCurrency'

import { Container } from './styles'

interface DataBleedCashier {
	value: string
	password: string
}

interface Cashier {
	money_in_cashier: number
}

const BleedCashier: React.FC = () => {
	const history = useHistory()
	const formRef = useRef<FormHandles>(null)
	const { addSnack } = useSnack()
	const { changeModule } = useModule()
	const [valueInCashier, setValueInCashier] = useState(0)

	const handleClickCancel = useCallback(() => {
		history.push('/dashboard')
	}, [history])

	const handleSubmit = useCallback(
		async (formData: DataBleedCashier) => {
			formRef.current?.setErrors({})
			const formattedNumber = Number(formData.value.replace(',', '.'))
			// eslint-disable-next-line no-restricted-globals
			if (isNaN(formattedNumber)) {
				formRef.current?.setErrors({ value: 'Coloque um valor válido.' })
			}

			try {
				const { data } = await api.post('/cashier/bleed', {
					value: formattedNumber,
					password: formData.password,
				})

				printJS(data.invoice)

				addSnack({
					type: 'success',
					title: 'Sucesso!',
					description: 'Sangria registrada',
				})

				history.push('/caixa')
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

	useEffect(() => {
		changeModule('cashier')
		;(async () => {
			try {
				const { data } = await api.get<Cashier>('/cashier/')
				setValueInCashier(data.money_in_cashier)
			} catch {
				addSnack({
					title: 'Erro no servidor',
					description: 'Recarregue a página, nossa equipe já foi alertada.',
					type: 'danger',
				})
			}
		})()
	}, [addSnack, changeModule])

	return (
		<Container data-testid="bleed-cashier-page">
			<PageHeader
				title="Realizar sangria"
				description="Informe o valor de sangria que será retirado"
			/>

			<Form onSubmit={handleSubmit} ref={formRef}>
				<div className="left">
					<InputMoney
						label="Valor de sangria"
						name="value"
						data-testid="money-input"
					/>
					<Input
						data-testid="password-input"
						label="Sua senha"
						name="password"
						type="password"
						style={{ width: 360 }}
					/>
				</div>
				<div className="right">
					<strong>Valor estimado em caixa</strong>
					<span>{convertNumberToBRLCurrency(valueInCashier)}</span>
				</div>
				<div className="button-group">
					<Button
						data-testid="cancel-button"
						label="Cancelar"
						variant="cancel"
						size="normal"
						type="button"
						onClick={handleClickCancel}
					/>
					<Button
						data-testid="open-cashier-button"
						label="Confirmar"
						variant="primary"
						size="normal"
						type="submit"
					/>
				</div>
			</Form>
		</Container>
	)
}

export default BleedCashier
