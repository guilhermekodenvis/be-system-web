import React, { useCallback } from 'react'
import { FiCoffee, FiEdit, FiInbox, FiServer } from 'react-icons/fi'

import { useHistory } from 'react-router-dom'
import { Container, Profile, MenuList, MenuItem } from './styles'

import { useModule } from '../../hooks/module'
import Toast from '../Toast'
import { useAuth } from '../../hooks/auth'

interface SideMenuProps {
	open: boolean
}

const SideMenu: React.FC<SideMenuProps> = ({ open }) => {
	const { user } = useAuth()
	const { moduleName } = useModule()
	const history = useHistory()
	const handleOpenRequests = useCallback(() => {
		history.push('/')
	}, [history])
	const handleOpenCashierPage = useCallback(() => {
		history.push('/caixa')
	}, [history])
	const handleOpenProducts = useCallback(() => {
		history.push('/produtos')
	}, [history])

	const handleClickEditProfile = useCallback(() => {
		history.push('/editar-perfil')
	}, [history])

	return (
		<Container open={open} data-testid="sidemenu-component">
			<Profile>
				{user && (
					<div>
						<div className="top">
							<img src={user.avatar_url} alt={user.restaurant_name} />
							<Toast label="Editar perfil">
								<FiEdit
									size={24}
									onClick={handleClickEditProfile}
									data-testid="open-profile"
								/>
							</Toast>
						</div>
						<strong>{user.restaurant_name}</strong>
						<p>{user.email}</p>
					</div>
				)}
			</Profile>
			<MenuList>
				<MenuItem
					data-testid="request-menu-item"
					active={moduleName === 'requests'}
					onClick={handleOpenRequests}
				>
					<FiServer size={24} />
					Pedidos
				</MenuItem>
				<MenuItem
					data-testid="cashier-menu-item"
					active={moduleName === 'cashier'}
					onClick={handleOpenCashierPage}
				>
					<FiInbox size={24} />
					Caixa
				</MenuItem>
				<MenuItem
					data-testid="products-menu-item"
					active={moduleName === 'products'}
					onClick={handleOpenProducts}
				>
					<FiCoffee size={24} />
					Produtos
				</MenuItem>
			</MenuList>
		</Container>
	)
}

export default SideMenu
