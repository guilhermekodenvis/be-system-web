import React, { useState } from 'react'
import { FiMinus, FiPlus } from 'react-icons/fi'
import { useHistory } from 'react-router-dom'
import Button from '../../components/Button'

import { Container, Product, BottomNavigation } from './styles'

interface Category {
	name: string
}

interface Product {
	name: string
	price: number
	quantity: number
	observation: string
}

const ProductsToRequest: React.FC = () => {
	const [categories, setCategories] = useState<Category[]>()
	const [products, setProducts] = useState<Product[]>()
	const history = useHistory()
	return (
		<Container>
			<h1>Anotar pedido</h1>
			<p>
				Clique no produto para anotar. Selecione a quantidade desejada pelo
				cliente e envie o pedido para a cozinha.
			</p>
			<div>
				<strong>
					Total: <span>R$ 9,00</span>
				</strong>
				<Button
					label="Detalhes"
					variant="secundary-outline"
					onClick={() => history.push('/detalhes-do-pedido')}
				/>
			</div>
			<div className="products-list">
				<Product>
					<strong>Suco de acerola</strong>
					<p>R$ 9,00</p>
					<div className="quantity">
						<span>Qtd.</span>
						<button className="less">
							<FiMinus />
						</button>
						<span>1</span>
						<button className="more">
							<FiPlus />
						</button>
					</div>
				</Product>
			</div>

			<BottomNavigation>
				<ul>
					<li className="active">Bebida</li>
					<li>Prato feito</li>
					<li>Porções</li>
					<li>Acompanhamento</li>
					<li>Pizzas</li>
				</ul>
			</BottomNavigation>
			<div className="bt-send-to-kitchen">
				<Button variant="primary" size="big" label="Enviar para cozinha" />
			</div>
		</Container>
	)
}

export default ProductsToRequest
