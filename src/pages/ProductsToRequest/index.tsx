import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { FiMinus, FiPlus } from 'react-icons/fi'
import { useHistory, useParams } from 'react-router-dom'
import printJS from 'print-js'
import Button from '../../components/Button'
import PageHeader from '../../components/PageHeader'
import { useModule } from '../../hooks/module'
import { useSnack } from '../../hooks/snack'
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
	const { addSnack } = useSnack()
	const { changeModule } = useModule()

	useEffect(() => {
		changeModule('requests')
	}, [changeModule])

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
		const newQtt = product.quantity - 1
		setProducts(prev => {
			const newList = [...prev]
			const findIndex = newList.findIndex(
				prevProd => prevProd.id === product.id,
			)
			newList[findIndex].quantity = newQtt
			return [...newList]
		})

		setProductsInCart(prev => {
			const newList = [...prev]
			const findIndex = newList.findIndex(
				prevProd => prevProd.product_id === product.id,
			)
			newList[findIndex].quantity = newQtt
			if (newQtt === 0) {
				newList.splice(findIndex, 1)
			}
			return [...newList]
		})
	}, [])

	const handleClickSendToKitchen = useCallback(async () => {
		const response = await api.post('/table-request/add-products', {
			products: [...productsInCart],
			table_id,
		})
		if (response) {
			addSnack({
				title: 'Pronto!',
				description: 'O pedido foi enviado para a cozinha',
				type: 'success',
			})
			history.push('/')
			printJS(response.data.download)
		}
	}, [addSnack, history, productsInCart, table_id])

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
						<span>Preço </span>
						{new Intl.NumberFormat('pt-BR', {
							style: 'currency',
							currency: 'BRL',
						}).format(product.price)}
					</p>
					<div className="quantity">
						<span>Qtd.</span>
						<div>
							{product.quantity > 0 && product.quantity && (
								<button
									className="less"
									onClick={() => {
										handleDecrementCart(product)
									}}
								>
									<FiMinus size={24} />
								</button>
							)}
							<span>{product.quantity || 0}</span>
							<button
								className="more"
								onClick={() => {
									handleIncrementCart(product)
								}}
							>
								<FiPlus size={18} />
							</button>
						</div>
					</div>
				</Product>
			)
		})
	}, [filteredProducts, handleDecrementCart, handleIncrementCart])

	const finalPrice = useMemo(() => {
		return new Intl.NumberFormat('pt-BR', {
			currency: 'BRL',
			style: 'currency',
		}).format(
			productsInCart.reduce(
				(a, b) => a + (b.product_price * b.quantity || 0),
				0,
			) || 0,
		)
	}, [productsInCart])

	return (
		<>
			<PageHeader
				title="Anotar pedido"
				description="Clique no produto para anotar. Selecione a quantidade desejada pelo
				cliente e envie o pedido para a cozinha."
			/>
			<Container>
				<div className="total">
					<strong>
						Total: <span>{finalPrice}</span>
					</strong>
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
		</>
	)
}

export default ProductsToRequest
