import React, { useState } from 'react'

import { Container } from './styles'

interface ToastProps {
	label: string
}

const Toast: React.FC<ToastProps> = ({ children, label }) => {
	const [hovered, setHovered] = useState(false)

	return (
		<Container
			onMouseOver={e => setHovered(true)}
			onMouseOut={e => setHovered(false)}
			hovered={hovered}
		>
			{children}
			<div>{label}</div>
		</Container>
	)
}

export default Toast
