import React from 'react'
import { useHistory } from 'react-router-dom'

import { Container, SideBar, TopBar, Main } from './styles'

const AppContainer: React.FC = ({ children }) => {
	const history = useHistory()

	const handleClickTitle = () => {
		history.push('/')
	}
	return (
		<Container>
			<SideBar></SideBar>
			<TopBar>
				<title onClick={handleClickTitle}> beSystem </title>
			</TopBar>
			<Main>{children}</Main>
		</Container>
	)
}

export default AppContainer
