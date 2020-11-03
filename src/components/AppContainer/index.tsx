import React from 'react'
import { useHistory } from 'react-router-dom'

import { Container, TopBar, Main } from './styles'

import SideMenu from '../SideMenu'

const AppContainer: React.FC = ({ children }) => {
	const history = useHistory()

	const handleClickTitle = () => {
		history.push('/')
	}
	return (
		<Container>
			<TopBar>
				<title onClick={handleClickTitle}> beSystem </title>
			</TopBar>
			<SideMenu />
			<Main>{children}</Main>
		</Container>
	)
}

export default AppContainer
