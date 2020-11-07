import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import React, { useCallback, useEffect, useRef } from 'react'
import { FiArrowLeft } from 'react-icons/fi'
import { useHistory } from 'react-router-dom'
import * as Yup from 'yup'
import Button from '../../components/Button'
import Input from '../../components/Input'
import InputMoney from '../../components/InputMoney'
import PageHeader from '../../components/PageHeader'
import { useModule } from '../../hooks/module'
import { useSnack } from '../../hooks/snack'
import api from '../../services/api'
import getValidationErrors from '../../utils/getValidationErrors'

import { Container } from './styles'

interface DataOpenCashier {
	value: string
}
const OpenCashier: React.FC = () => {
	const history = useHistory()
	const { addSnack } = useSnack()
	const formRef = useRef<FormHandles>(null)

	const handleSubmit = useCallback(
		async (data: DataOpenCashier) => {
			formRef.current?.setErrors({})
			const formattedNumber = Number(data.value.replace(',', '.'))
			if (isNaN(formattedNumber)) {
				formRef.current?.setErrors({ value: 'Coloque um valor válido.' })
			}

			try {
				const resp = await api.post('/cashier-moviments/open', {
					value: formattedNumber,
				})

				addSnack({
					type: 'success',
					title: 'Sucesso!',
					description: 'O caixa está aberto.',
				})

				console.log(resp.data)

				history.push('/')
			} catch (err) {
				console.log(err)
			}
		},
		[addSnack, history],
	)
	const { changeModule } = useModule()

	useEffect(() => {
		changeModule('cashier')
	}, [changeModule])

	const handleClickCancel = useCallback(() => {
		console.log('cancelou')
	}, [])
	return (
		<Container>
			<PageHeader
				title="Abrir o caixa"
				description="Informe o valor inicial do caixa para iniciar as movimentações do dia"
			/>

			<Form onSubmit={handleSubmit} ref={formRef}>
				<InputMoney label="Valor inicial" name="value" />
				<div className="button-group">
					<Button
						label="Cancelar"
						variant="secundary"
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
