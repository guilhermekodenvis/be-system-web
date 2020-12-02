import React, { useCallback, useState } from 'react'
import { useHistory } from 'react-router-dom'

import { FiLogOut, FiMenu, FiX } from 'react-icons/fi'
import { Container, TopBar, Main } from './styles'

import SideMenu from '../SideMenu'
import { useAuth } from '../../hooks/auth'
import { useSnack } from '../../hooks/snack'
import Toast from '../Toast'

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
		<Container open={menuOpen} data-testid="container-appcontainer">
			<TopBar>
				<div className="open-close">
					{menuOpen ? (
						<FiX
							data-testid="menu-x"
							size={24}
							onClick={e => setMenuOpen(false)}
						/>
					) : (
						<FiMenu
							data-testid="menu-menu"
							size={24}
							onClick={e => setMenuOpen(true)}
						/>
					)}
				</div>
				<title onClick={handleClickTitle} data-testid="besystem-title">
					{' '}
					beSystem{' '}
				</title>
				<Toast className="logout" label="Logout">
					<FiLogOut
						size={24}
						onClick={handleLogout}
						data-testid="signout-button"
					/>
				</Toast>
			</TopBar>
			<SideMenu open={menuOpen} />
			<Main>{children}</Main>
		</Container>
	)
}

export default AppContainer
