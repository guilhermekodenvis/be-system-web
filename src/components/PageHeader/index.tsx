import React from 'react'
import { FiArrowLeft } from 'react-icons/fi'
import { useHistory } from 'react-router-dom'

import { Container } from './styles'

interface PageHeaderProps {
	title: string
	description?: string
	noBackButton?: boolean
}

const PageHeader: React.FC<PageHeaderProps> = ({
	title,
	description,
	noBackButton,
}) => {
	const history = useHistory()
	return (
		<Container>
			<div>
				<h1>{title}</h1>
				{!noBackButton && (
					<button
						data-testid="backbutton-pageheader"
						onClick={e => history.goBack()}
					>
						<FiArrowLeft /> VOLTAR
					</button>
				)}
			</div>
			<p>{description}</p>
		</Container>
	)
}

export default PageHeader
