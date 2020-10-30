import React from 'react'
import { useHistory } from 'react-router-dom'
import Button from '../../components/Button'

import { Container, RequestItem, RequestList } from './styles'

const TableRequestDetails: React.FC = () => {
	const history = useHistory()
	return (
		<Container>
			<h1>Mesa 07</h1>
			<p>Veja os pedidos da mesa 07.</p>
			<div className="top">
				<strong>
					Total: <span>R$ 9,00</span>
				</strong>
				<Button
					label="Detalhes"
					variant="secundary-outline"
					onClick={() => history.push('/adicionar-produto/3')}
				/>
			</div>
			<RequestList>
				<RequestItem>
					<strong>2x Suco de acerola</strong>
					<p>
						Total: <span>R$ 18,00</span>
					</p>
				</RequestItem>
				<RequestItem>
					<strong>2x Suco de acerola</strong>
					<p>
						Total: <span>R$ 18,00</span>
					</p>
				</RequestItem>
				<RequestItem>
					<strong>2x Suco de acerola</strong>
					<p>
						Total: <span>R$ 18,00</span>
					</p>
				</RequestItem>
				<RequestItem>
					<strong>2x Suco de acerola</strong>
					<p>
						Total: <span>R$ 18,00</span>
					</p>
				</RequestItem>
				<RequestItem>
					<strong>2x Suco de acerola</strong>
					<p>
						Total: <span>R$ 18,00</span>
					</p>
				</RequestItem>
				<RequestItem>
					<strong>2x Suco de acerola</strong>
					<p>
						Total: <span>R$ 18,00</span>
					</p>
				</RequestItem>
			</RequestList>
		</Container>
	)
}

export default TableRequestDetails
