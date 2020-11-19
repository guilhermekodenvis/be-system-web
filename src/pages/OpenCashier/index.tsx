import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import React, { useCallback, useEffect, useRef } from 'react'
import { useHistory } from 'react-router-dom'
import Button from '../../components/Button'
import Input from '../../components/Input'
import InputMoney from '../../components/InputMoney'
import PageHeader from '../../components/PageHeader'
import { useModule } from '../../hooks/module'
import { useSnack } from '../../hooks/snack'
import api from '../../services/api'

import { Container } from './styles'

interface DataOpenCashier {
	value: string
	password: string
}
const OpenCashier: React.FC = () => {
	const history = useHistory()
	const { addSnack } = useSnack()
	const formRef = useRef<FormHandles>(null)

	const handleSubmit = useCallback(
		async (formData: DataOpenCashier) => {
			formRef.current?.setErrors({})
			const formattedNumber = Number(formData.value.replace(',', '.'))
			// eslint-disable-next-line no-restricted-globals
			if (isNaN(formattedNumber)) {
				formRef.current?.setErrors({ value: 'Coloque um valor válido.' })
			}

			try {
				await api.post('/cashier-moviments/open', {
					value: formattedNumber,
					password: formData.password,
				})

				addSnack({
					type: 'success',
					title: 'Sucesso!',
					description: 'O caixa está aberto.',
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
	const { changeModule } = useModule()

	useEffect(() => {
		changeModule('cashier')
	}, [changeModule])

	const handleClickCancel = useCallback(() => {
		history.push('/')
	}, [history])
	return (
		<Container>
			<PageHeader
				title="Abrir o caixa"
				description="Informe o valor inicial do caixa para iniciar as movimentações do dia"
			/>

			<Form onSubmit={handleSubmit} ref={formRef}>
				<InputMoney label="Valor inicial" name="value" />
				<Input
					label="Sua senha"
					name="password"
					type="password"
					style={{ width: 360 }}
				/>
				<div className="button-group">
					<Button
						label="Cancelar"
						variant="cancel"
						size="normal"
						type="button"
						onClick={handleClickCancel}
					/>
					<Button
						label="Salvar"
						variant="primary"
						size="normal"
						type="submit"
					/>
				</div>
			</Form>
		</Container>
	)
}

export default OpenCashier
