import React, { useState } from 'react'

import { Container } from './styles'

interface ToastProps {
	label: string
	className?: string
}

const Toast: React.FC<ToastProps> = ({ children, label, className }) => {
	const [hovered, setHovered] = useState(false)

	return (
		<Container
			className={className}
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
