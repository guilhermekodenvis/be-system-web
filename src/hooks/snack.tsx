import React, { createContext, useCallback, useContext, useState } from 'react'
import { v4 } from 'uuid'

import SnackContainer from '../components/SnackContainer'

export interface SnackMessage {
	id: string
	type?: 'success' | 'danger' | 'warning'
	title: string
	description?: string
}

export interface SnackContextData {
	addSnack(message: Omit<SnackMessage, 'id'>): string
	removeSnack(id: string): void
}

const SnackContext = createContext<SnackContextData>({} as SnackContextData)

const SnackProvider: React.FC = ({ children }) => {
	const [messages, setMessages] = useState<SnackMessage[]>([])

	const addSnack = useCallback(
		({ type, title, description }: Omit<SnackMessage, 'id'>) => {
			const id = v4()

			const toast = {
				id,
				type,
				title,
				description,
			}

			setMessages(state => [...state, toast])

			return id
		},
		[],
	)

	const removeSnack = useCallback((id: string) => {
		setMessages(state => state.filter(message => message.id !== id))
	}, [])

	return (
		<SnackContext.Provider value={{ addSnack, removeSnack }}>
			{children}
			<SnackContainer messages={messages} />
		</SnackContext.Provider>
	)
}

function useSnack(): SnackContextData {
	const context = useContext(SnackContext)

	return context
}

export { SnackProvider, useSnack }
