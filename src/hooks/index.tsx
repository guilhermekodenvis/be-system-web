import React from 'react'

import { AuthProvider } from './auth'
import { SnackProvider } from './snack'

const AppProvider: React.FC = ({ children }) => (
	<AuthProvider>
		<SnackProvider>{children}</SnackProvider>
	</AuthProvider>
)

export default AppProvider
