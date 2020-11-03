import { Form } from '@unform/web'
import React, { useCallback, useEffect } from 'react'
import { FiArrowLeft } from 'react-icons/fi'
import Button from '../../components/Button'
import Input from '../../components/Input'
import { useModule } from '../../hooks/module'

import { Container, Header } from './styles'

interface DataOpenCashier {
	value: string
}
const OpenCashier: React.FC = () => {
	const handleSubmit = useCallback((data: DataOpenCashier) => {
		console.log(data)
	}, [])
	const { changeModule } = useModule()

	useEffect(() => {
		changeModule('cashier')
	}, [changeModule])

	const handleClickCancel = useCallback(() => {
		console.log('cancelou')
	}, [])
	return (
		<Container>
			<Header>
				<div>
					<h1>Abrir caixa</h1>
					<button>
						<FiArrowLeft /> VOLTAR
					</button>
				</div>
				<p>
					Só será possível começar a anotar pedidos após a abertura do caixa.
				</p>
			</Header>
			<Form onSubmit={handleSubmit}>
				<Input label="Qual o valor inicial do caixa?" name="value" />
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
