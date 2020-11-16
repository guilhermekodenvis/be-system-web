import React, { useCallback, useState } from 'react'
import { useHistory } from 'react-router-dom'

import { FiLogOut, FiMenu, FiX } from 'react-icons/fi'
import { Container, TopBar, Main } from './styles'

import SideMenu from '../SideMenu'
import { useAuth } from '../../hooks/auth'
import { useSnack } from '../../hooks/snack'

const AppContainer: React.FC = ({ children }) => {
	const history = useHistory()
	const [menuOpen, setMenuOpen] = useState(false)
	const { signOut } = useAuth()
	const { addSnack } = useSnack()

	const handleClickTitle = () => {
		history.push('/')
	}

	const handleLogout = useCallback(() => {
		signOut()
		addSnack({
			title: 'Volte sempre',
			type: 'success',
		})
	}, [addSnack, signOut])

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
				<div className="logout">
					<FiLogOut size={24} onClick={handleLogout} />
				</div>
			</TopBar>
			<SideMenu open={menuOpen} />
			<Main>{children}</Main>
		</Container>
	)
}

export default AppContainer
