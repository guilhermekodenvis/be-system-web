import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import api from '../../services/api'

import { Container } from './styles'

const Cashier: React.FC = () => {
	const history = useHistory()
	useEffect(() => {
		;(async () => {
			try {
				const { data } = await api.get('/cashier-moviments/situation')
				if (!data.isOpen) {
					history.push('abrir-caixa')
				} else {
					history.push('fechar-caixa')
				}
			} catch (err) {
				console.log(err)
			}
		})()
	}, [history])
	return <Container></Container>
}

export default Cashier
