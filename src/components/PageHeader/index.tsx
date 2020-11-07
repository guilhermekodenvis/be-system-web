import React from 'react'
import { FiArrowLeft } from 'react-icons/fi'
import { useHistory } from 'react-router-dom'

import { Container } from './styles'

interface PageHeaderProps {
	title: string
	description?: string
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, description }) => {
	const history = useHistory()
	return (
		<Container>
			<div>
				<h1>{title}</h1>
				<button onClick={e => history.goBack()}>
					<FiArrowLeft /> VOLTAR
				</button>
			</div>
			<p>{description}</p>
		</Container>
	)
}

export default PageHeader
