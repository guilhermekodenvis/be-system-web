/* eslint-disable no-useless-escape */
import { useField } from '@unform/core'
import React, {
	ChangeEvent,
	InputHTMLAttributes,
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react'

import { Container } from './styles'

interface InputMoneyProps extends InputHTMLAttributes<HTMLInputElement> {
	name: string
	label: string
}

const InputMoney: React.FC<InputMoneyProps> = ({ name, label, ...rest }) => {
	const inputRef = useRef(null)
	const [inputMoneyValue, setInputMoneyValue] = useState('')
	const { fieldName, defaultValue, registerField, error } = useField(name)

	useEffect(() => {
		registerField({
			name: fieldName,
			ref: inputRef.current,
			path: 'value',
		})
	}, [fieldName, registerField])

	const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
		e.preventDefault()
		const { value } = e.target
		const validNumber = value.replace(/\D/g, '')
		const position = validNumber.length - 2
		const output = [
			validNumber.slice(0, position),
			',',
			validNumber.slice(position),
		].join('')

		setInputMoneyValue(output)
	}, [])

	return (
		<Container data-testid="input-money-component">
			<label htmlFor={name}>{label}</label>
			<div>
				<p>R$</p>
				<input
					onChange={handleInputChange}
					value={inputMoneyValue}
					placeholder="0,00"
					ref={inputRef}
					type="text"
					name={name}
					id={name}
					defaultValue={defaultValue}
					autoComplete="off"
					{...rest}
				/>
			</div>
			{error && <span className="error">{error}</span>}
		</Container>
	)
}

export default InputMoney
