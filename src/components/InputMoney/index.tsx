import { useField } from '@unform/core'
import React, { InputHTMLAttributes, useEffect, useRef } from 'react'

import { Container } from './styles'

interface InputMoneyProps extends InputHTMLAttributes<HTMLInputElement> {
	name: string
	label: string
}

const InputMoney: React.FC<InputMoneyProps> = ({ name, label, ...rest }) => {
	const inputRef = useRef(null)
	const { fieldName, defaultValue, registerField, error } = useField(name)

	useEffect(() => {
		registerField({
			name: fieldName,
			ref: inputRef.current,
			path: 'value',
			setValue(ref: any, value: string) {
				ref.setInputValue(value)
			},
			clearValue(ref: any) {
				ref.setInputValue('')
			},
		})
	}, [fieldName, registerField])

	return (
		<Container>
			<label htmlFor={name}>{label}</label>
			<div>
				<p>R$</p>
				<input
					ref={inputRef}
					type="text"
					name={name}
					id={name}
					defaultValue={defaultValue}
					autoComplete="off"
					{...rest}
					onChange={e => e.preventDefault()}
				/>
			</div>
			{error && <span className="error">{error}</span>}
		</Container>
	)
}

export default InputMoney
