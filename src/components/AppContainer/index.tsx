import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'

import { FiMenu, FiX } from 'react-icons/fi'
import { Container, TopBar, Main } from './styles'

import SideMenu from '../SideMenu'

const AppContainer: React.FC = ({ children }) => {
	const history = useHistory()
	const [menuOpen, setMenuOpen] = useState(true)

	const handleClickTitle = () => {
		history.push('/')
	}

	return (
		<Container open={menuOpen}>
			<TopBar>
				<div className="open-close">
					{menuOpen ? (
						<FiX size={24} onClick={e => setMenuOpen(false)} />
					) : (
						<FiMenu size={24} onClick={e => setMenuOpen(true)} />
					)}
				</div>
				<title onClick={handleClickTitle}> beSystem </title>
			</TopBar>
			<SideMenu open={menuOpen} />
			<Main>{children}</Main>
		</Container>
	)
}

export default AppContainer
