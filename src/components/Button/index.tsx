import React, { ButtonHTMLAttributes } from 'react'

import { Container } from './styles'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	label: string
	variant?: 'primary' | 'secundary'
	size?: 'normal' | 'big'
}

const Button: React.FC<ButtonProps> = ({ label, ...rest }) => {
	return (
		<Container type="button" {...rest}>
			{label}
		</Container>
	)
}

export default Button
