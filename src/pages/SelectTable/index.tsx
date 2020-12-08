import { Form } from '@unform/web'
import React, {
	SyntheticEvent,
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react'
import * as Yup from 'yup'
import { FormHandles } from '@unform/core'
import { useHistory } from 'react-router-dom'
import Button from '../../components/Button'
import Input from '../../components/Input'
import getValidationErrors from '../../utils/getValidationErrors'

import { Container } from './styles'
import api from '../../services/api'
import { useModule } from '../../hooks/module'
import PageHeader from '../../components/PageHeader'
import Modal from '../../components/Modal'
import { useSnack } from '../../hooks/snack'

interface ContinueToRequestFormData {
	table_number: string
}

const SelectTable: React.FC = () => {
	const { changeModule } = useModule()

	const [showModal, setShowModal] = useState(false)
	const [tableNumber, setTableNumber] = useState('')
	const handleCloseModal = useCallback(() => {
		setShowModal(false)
	}, [])

	const handleOpenModal = useCallback(() => {
		setShowModal(true)
	}, [])

	useEffect(() => {
		changeModule('requests')
	}, [changeModule])
	const history = useHistory()
	const formRef = useRef<FormHandles>(null)
	const { addSnack } = useSnack()

	const handleSubmit = useCallback(
		async (formData: ContinueToRequestFormData) => {
			try {
				const {
					data: { id },
				} = await api.post('/table-request', formData)

				history.push(`/adicionar-produto/${id}`)
			} catch {
				addSnack({
					type: 'danger',
					title: 'Erro no servidor',
					description: 'Recarregue a página e tente novamente.',
				})
			}
		},
		[addSnack, history],
	)

	const handleClickSubmit = useCallback(
		async (e: SyntheticEvent) => {
			e.preventDefault()
			try {
				const response = await api.get(
					`table-request/verify-table/${tableNumber}`,
				)
				if (response.data.is_available) {
					formRef.current?.submitForm()
				} else {
					handleOpenModal()
				}
			} catch {
				addSnack({
					title: 'Ooops',
					description:
						'Algum erro ocorreu no servidor, já estamos resolvendo. Tente novamente',
					type: 'danger',
				})
			}
		},
		[addSnack, handleOpenModal, tableNumber],
	)
	return (
		<>
			<PageHeader
				title="Novo pedido"
				description="Indique a mesa para continuar."
			/>
			<Container data-testid="select-table-page">
				<Form onSubmit={handleSubmit} ref={formRef}>
					<Input
						data-testid="table-number-input"
						label="Número da mesa"
						name="table_number"
						type="number"
						onChange={e => setTableNumber(e.target.value)}
					/>
					<div className="bt-group">
						<Button
							data-testid="cancel-button"
							label="Cancelar"
							variant="cancel"
							onClick={e => history.push('/dashboard')}
						/>
						<Button
							data-testid="continue-button"
							label="continuar"
							size="big"
							type="submit"
							onClick={handleClickSubmit}
						/>
					</div>
				</Form>
			</Container>
			<Modal
				closeModal={handleCloseModal}
				openModal={handleOpenModal}
				open={showModal}
				title="Atenção"
			>
				<p>
					A mesa selecionada já possui pedidos em aberto. A mesa informada é a
					correta?
				</p>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-around',
						paddingTop: '24px',
					}}
				>
					<Button
						data-testid="cancel-bt-modal"
						variant="cancel"
						label="Não, cancelar"
						onClick={handleCloseModal}
					/>
					<Button
						data-testid="continue-bt-modal"
						variant="primary"
						label="Sim, continuar"
						onClick={formRef?.current?.submitForm}
					/>
				</div>
			</Modal>
		</>
	)
}

export default SelectTable
