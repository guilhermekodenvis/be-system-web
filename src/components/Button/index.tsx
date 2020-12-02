import React, { ButtonHTMLAttributes } from 'react'

import { Container } from './styles'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	label: string
	variant?: 'primary' | 'secundary' | 'secundary-outline' | 'cancel'
	size?: 'normal' | 'big'
}

const Button: React.FC<ButtonProps> = ({ label, ...rest }) => {
	return (
		<Container type="button" data-testid="button-component" {...rest}>
			{label}
		</Container>
	)
}

export default Button
