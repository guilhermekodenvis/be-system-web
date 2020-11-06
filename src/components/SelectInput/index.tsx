import { useField } from '@unform/core'
import React, { SelectHTMLAttributes, useEffect, useRef } from 'react'

import { Container } from './styles'

interface Selectables {
	label: string
	value: number | string
}

interface SelectInputProps {
	data: Array<Selectables>
	name: string
	label: string
}

const SelectInput: React.FC<SelectInputProps> = ({ data, name, label }) => {
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
			<select
				ref={inputRef}
				name={name}
				id={name}
				defaultValue={defaultValue}
				autoComplete="off"
			>
				{data.map((option, i) => {
					return (
						<option key={i} value={option.value}>
							{option.label}
						</option>
					)
				})}
			</select>
			{error && <span className="error">{error}</span>}
		</Container>
	)
}

export default SelectInput
