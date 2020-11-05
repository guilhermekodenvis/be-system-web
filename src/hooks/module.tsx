import React, { createContext, useCallback, useContext, useState } from 'react'
// import { v4 } from 'uuid'

interface ModuleContextData {
	moduleName: string
	changeModule(name: 'requests' | 'cashier' | 'products'): void
}

const ModuleContext = createContext<ModuleContextData>({} as ModuleContextData)

const ModuleProvider: React.FC = ({ children }) => {
	const [moduleName, setModuleName] = useState('')
	const changeModule = useCallback((name: string) => {
		setModuleName(name)
	}, [])
	return (
		<ModuleContext.Provider value={{ moduleName, changeModule }}>
			{children}
		</ModuleContext.Provider>
	)
}

function useModule(): ModuleContextData {
	const context = useContext(ModuleContext)

	if (!context) {
		throw new Error('useModule must be used within a ModuleContext.Provider')
	}

	return context
}

export { ModuleProvider, useModule }
