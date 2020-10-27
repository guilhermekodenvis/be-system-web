import React, { InputHTMLAttributes, useEffect, useRef } from 'react'
import { useField } from '@unform/core'

import { Container } from './styles'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	name: string
	label: string
}

const Input: React.FC<InputProps> = ({ name, label, ...rest }) => {
	const inputRef = useRef(null)
	const { fieldName, defaultValue, registerField, error } = useField(name)

	useEffect(() => {
		registerField({
			name: fieldName,
			ref: inputRef.current,
			path: 'value',
		})
	}, [fieldName, registerField])

	return (
		<Container>
			<label htmlFor={name}>{label}</label>
			<input
				ref={inputRef}
				type="text"
				name={name}
				id={name}
				defaultValue={defaultValue}
				autoComplete="off"
				{...rest}
			/>
			{error && <span className="error">{error}</span>}
		</Container>
	)
}

export default Input
