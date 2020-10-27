import React from 'react'
import { useTransition } from 'react-spring'

import Snack from './Snack'

import { SnackMessage } from '../../hooks/snack'
import { Container } from './styles'

interface SnackContainerProps {
	messages: SnackMessage[]
}

const SnackContainer: React.FC<SnackContainerProps> = ({ messages }) => {
	const messagesWithTransitions = useTransition(
		messages,
		message => message.id,
		{
			from: { right: '-120%', opacity: 0 },
			enter: { right: '0%', opacity: 1 },
			leave: { right: '-120%', opacity: 0 },
		},
	)

	return (
		<Container>
			{messagesWithTransitions.map(({ item, key, props }) => (
				<Snack key={key} style={props} message={item} />
			))}
		</Container>
	)
}

export default SnackContainer
