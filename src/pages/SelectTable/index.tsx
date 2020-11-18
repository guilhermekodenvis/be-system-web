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
	const handleSubmit = useCallback(
		async (formData: ContinueToRequestFormData) => {
			try {
				formRef.current?.setErrors({})

				const schema = Yup.object().shape({
					table_number: Yup.number()
						.required('Informe a mesa')
						.typeError('A mesa precisa ser um número.'),
				})

				await schema.validate(formData, {
					abortEarly: false,
				})

				const {
					data: { id },
				} = await api.post('/table-request', formData)

				history.push(`/adicionar-produto/${id}`)
			} catch (err) {
				if (err instanceof Yup.ValidationError) {
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
		[history],
	)

	const handleClickSubmit = useCallback(
		async (e: SyntheticEvent) => {
			e.preventDefault()
			try {
				const response = await api.get(
					`table-request/verify-table/${tableNumber}`,
				)
				console.log(response.data)
				if (response.data.is_available) {
					formRef.current?.submitForm()
				} else {
					handleOpenModal()
				}
			} catch (err) {
				console.log(err)
			}
		},
		[handleOpenModal, tableNumber],
	)
	return (
		<>
			<PageHeader
				title="Novo pedido"
				description="Indique a mesa para continuar."
			/>
			<Container>
				<Form onSubmit={handleSubmit} ref={formRef}>
					<Input
						label="Número da mesa"
						name="table_number"
						onChange={e => setTableNumber(e.target.value)}
					/>
					<div className="bt-group">
						<Button
							label="Cancelar"
							variant="cancel"
							onClick={e => history.push('')}
						/>
						<Button
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
						variant="cancel"
						label="Não, cancelar"
						onClick={handleCloseModal}
					/>
					<Button
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
