import React, { useCallback } from 'react'
import { FiCoffee, FiEdit, FiInbox, FiServer } from 'react-icons/fi'

import { useHistory } from 'react-router-dom'
import { Container, Profile, MenuList, MenuItem } from './styles'

import { useModule } from '../../hooks/module'
import Toast from '../Toast'

const SideMenu: React.FC = () => {
	const { moduleName } = useModule()
	const history = useHistory()
	const handleOpenRequests = useCallback(() => {
		history.push('/')
	}, [history])
	const handleOpenCashierPage = useCallback(() => {
		history.push('/abrir-caixa')
	}, [history])
	const handleOpenProducts = useCallback(() => {
		history.push('/produtos')
	}, [history])

	return (
		<Container>
			<Profile>
				<div>
					<div className="top">
						<img
							src="https://static-images.ifood.com.br/image/upload//capa/04c26c34-33c3-4e34-a861-0bc11c3eacf8/202005040942_uHie_@2x.jpeg"
							alt="comidinhas vinhola"
						/>
						<Toast label="Editar perfil">
							<FiEdit size={24} />
						</Toast>
					</div>
					<strong>Comidinhas</strong>
					<p>comidinhas@gmail.com</p>
				</div>
			</Profile>
			<MenuList>
				<MenuItem
					active={moduleName === 'requests'}
					onClick={handleOpenRequests}
				>
					<FiServer size={24} />
					Pedidos
				</MenuItem>
				<MenuItem
					active={moduleName === 'cashier'}
					onClick={handleOpenCashierPage}
				>
					<FiInbox size={24} />
					Caixa
				</MenuItem>
				<MenuItem
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
