import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import Routes from './routes'
import GlobalStyles from './styles/global'

import AppProvider from './hooks'

const App: React.FC = () => (
	<>
		<BrowserRouter>
			<AppProvider>
				<Routes />
			</AppProvider>
		</BrowserRouter>
		<GlobalStyles />
	</>
)
export default App
