import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { FiMinus, FiPlus } from 'react-icons/fi'
import { useHistory, useParams } from 'react-router-dom'
import Button from '../../components/Button'
import api from '../../services/api'

import { Container, Product, BottomNavigation } from './styles'

interface Product {
	id: string
	name: string
	price: number
	quantity: number
	observation: string
	category: string
}

interface CartProduct {
	product_id: string
	quantity: number
	product_price: number
	product_name: string
	observation: string
}

const ProductsToRequest: React.FC = () => {
	const history = useHistory()
	const [products, setProducts] = useState<Product[]>([])
	const [activedCategory, setActivedCategory] = useState<number>(0)
	const [productsInCart, setProductsInCart] = useState<CartProduct[]>([])
	const { table_id } = useParams<{ table_id: string }>()

	const handleIncrementCart = useCallback((product: Product) => {
		const newQtt = product.quantity + 1 || 1
		setProducts(prev => {
			const newList = [...prev]
			const prevIndex = newList.findIndex(prod => prod.id === product.id)
			newList[prevIndex].quantity = newQtt
			return [...newList]
		})

		setProductsInCart(prev => {
			const newList = [...prev]
			const prevIndex = newList.findIndex(
				prod => prod.product_id === product.id,
			)

			if (prevIndex >= 0) {
				newList[prevIndex].quantity = newQtt
			} else {
				const newProductToCart = {
					product_id: product.id,
					quantity: newQtt,
					product_price: product.price,
					product_name: product.name,
					observation: 'obs',
				}
				newList.push(newProductToCart)
			}
			return [...newList]
		})
	}, [])

	const handleDecrementCart = useCallback((product: Product) => {
		console.log('oui')
	}, [])

	const handleClickSendToKitchen = useCallback(async () => {
		const response = await api.post('/table-request/add-products', {
			products: [...productsInCart],
			table_id,
		})
		console.log(response.data)
	}, [productsInCart])

	useEffect(() => {
		console.log(productsInCart)
	}, [productsInCart])

	useEffect(() => {
		;(async () => {
			const { data } = await api.get('/products')
			setProducts(data)
		})()
	}, [])

	const unduplicadCategories = useMemo(() => {
		const categories = products?.map(product => product.category.trim())
		return Array.from(new Set(categories))
	}, [products])

	const categories = useMemo(() => {
		return unduplicadCategories.map((category, i) => {
			return (
				<li
					className={`${activedCategory === i && 'active'}`}
					key={i}
					onClick={() => {
						setActivedCategory(i)
					}}
				>
					{category}
				</li>
			)
		})
	}, [unduplicadCategories, activedCategory])

	const filteredProducts = useMemo(() => {
		return products?.filter(
			product =>
				product.category.trim() === unduplicadCategories[activedCategory],
		)
	}, [unduplicadCategories, activedCategory, products])

	const productList = useMemo(() => {
		return filteredProducts?.map((product, i) => {
			return (
				<Product key={i}>
					<strong>{product.name}</strong>
					<p>
						{new Intl.NumberFormat('pt-BR', {
							style: 'currency',
							currency: 'BRL',
						}).format(product.price)}
					</p>
					<div className="quantity">
						<span>Qtd.</span>
						<button
							className="less"
							onClick={() => {
								handleDecrementCart(product)
							}}
						>
							<FiMinus />
						</button>
						<span>{product.quantity || 0}</span>
						<button
							className="more"
							onClick={() => {
								handleIncrementCart(product)
							}}
						>
							<FiPlus />
						</button>
					</div>
				</Product>
			)
		})
	}, [filteredProducts])

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
					disabled
					label="Detalhes"
					variant="secundary-outline"
					onClick={() => history.push('/detalhes-do-pedido')}
				/>
			</div>
			<div className="products-list">{productList}</div>

			<BottomNavigation>
				<ul>{categories}</ul>
			</BottomNavigation>
			<div className="bt-send-to-kitchen">
				<Button
					variant="primary"
					size="big"
					label="Enviar para cozinha"
					onClick={handleClickSendToKitchen}
				/>
			</div>
		</Container>
	)
}

export default ProductsToRequest
