import React from 'react'

import { AuthProvider } from './auth'
import { SnackProvider } from './snack'
import { ModuleProvider } from './module'

const AppProvider: React.FC = ({ children }) => (
	<AuthProvider>
		<SnackProvider>
			<ModuleProvider>{children}</ModuleProvider>
		</SnackProvider>
	</AuthProvider>
)

export default AppProvider
