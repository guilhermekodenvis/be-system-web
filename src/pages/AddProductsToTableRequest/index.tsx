import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { FiMinus, FiPlus } from 'react-icons/fi'
import { useHistory, useParams } from 'react-router-dom'
import printJS from 'print-js'
import { Form } from '@unform/web'
import Button from '../../components/Button'
import PageHeader from '../../components/PageHeader'
import { useModule } from '../../hooks/module'
import { useSnack } from '../../hooks/snack'
import api from '../../services/api'

import { Container, Product, BottomNavigation, Quantity } from './styles'
import convertNumberToBRLCurrency from '../../utils/convertNumberToBRLCurrency'
import Modal from '../../components/Modal'
import Input from '../../components/Input'

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

const AddProductsToTableRequest: React.FC = () => {
	const history = useHistory()
	const [products, setProducts] = useState<Product[]>([])
	const [activedCategory, setActivedCategory] = useState<number>(0)
	const [productsInCart, setProductsInCart] = useState<CartProduct[]>([])
	const { table_id } = useParams<{ table_id: string }>()
	const { addSnack } = useSnack()
	const { changeModule } = useModule()
	const [showModal, setShowModal] = useState(false)
	const [
		currentProductToSetObservation,
		setCurrentProductToSetObservation,
	] = useState<Product>({} as Product)

	useEffect(() => {
		changeModule('requests')
	}, [changeModule])

	useEffect(() => {
		;(async () => {
			try {
				const { data } = await api.get('/products')
				setProducts(data)
			} catch {
				addSnack({
					title: 'Erro no servidor',
					description:
						'Recarregue e tente novamente. Nossa equipe já está sendo avisada do problema.',
					type: 'danger',
				})
			}
		})()
	}, [addSnack])

	const handleIncrementCart = useCallback((product: Product) => {
		const newQtt = product.quantity + 1
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
					// observation: '',
				}
				newList.push(newProductToCart as CartProduct)
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
		try {
			const response = await api.post('/table-request/add-products', {
				products: [...productsInCart],
				table_id,
			})
			addSnack({
				title: 'Pronto!',
				description: 'O pedido foi enviado para a cozinha',
				type: 'success',
			})
			history.push('/dashboard')
			printJS(response.data.download)
		} catch {
			addSnack({
				title: 'Erro!',
				description: 'Algum erro ocorreu no servidor, tente novamente',
				type: 'danger',
			})
		}
	}, [addSnack, history, productsInCart, table_id])

	const handleCloseModal = useCallback(() => {
		setShowModal(false)
	}, [])
	const handleOpenModal = useCallback(() => {
		setShowModal(true)
	}, [])

	const handleClickAddObservation = useCallback(
		(product: Product) => {
			handleOpenModal()
			setCurrentProductToSetObservation(product)
		},
		[handleOpenModal],
	)

	const handleObservationSubmit = useCallback(
		({ observation }: { observation: string }) => {
			setProductsInCart(prev => {
				const newList = [...prev]
				const unchangedProductIndex = newList.findIndex(
					prod => prod.product_id === currentProductToSetObservation.id,
				)

				newList[unchangedProductIndex].observation = observation
				return [...newList]
			})
			handleCloseModal()
		},
		[currentProductToSetObservation.id, handleCloseModal],
	)

	const unduplicadCategories = useMemo(() => {
		const categories = products?.map(product => product.category.trim())
		return Array.from(new Set(categories))
	}, [products])

	const categories = useMemo(() => {
		return unduplicadCategories.map((category, i) => {
			return (
				<li
					data-testid="category-item"
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
				<Product key={i} data-testid="product-item">
					<strong>{product.name}</strong>
					<p>
						<span>Preço </span>
						{convertNumberToBRLCurrency(product.price)}
					</p>

					<div>
						{product.quantity > 0 && (
							<Button
								data-testid="observation-button"
								style={{ maxWidth: '100% !important' }}
								label="Adicionar observação"
								variant="secundary-outline"
								onClick={e => handleClickAddObservation(product)}
							/>
						)}

						<Quantity>
							{product.quantity > 0 && product.quantity ? (
								<button
									data-testid="less-button"
									className="less"
									onClick={() => {
										handleDecrementCart(product)
									}}
								>
									<FiMinus size={24} />
								</button>
							) : (
								<button data-testid="less-button" className="less" disabled>
									<FiMinus size={24} />
								</button>
							)}
							<span>{product.quantity || 0}</span>
							<button
								data-testid="more-button"
								className="more"
								onClick={() => {
									handleIncrementCart(product)
								}}
							>
								<FiPlus size={24} />
							</button>
						</Quantity>
					</div>
				</Product>
			)
		})
	}, [
		filteredProducts,
		handleClickAddObservation,
		handleDecrementCart,
		handleIncrementCart,
	])

	const finalPrice = useMemo(() => {
		return (
			productsInCart.reduce((a, b) => a + b.product_price * b.quantity, 0) || 0
		)
	}, [productsInCart])

	return (
		<>
			<PageHeader
				title="Anotar pedido"
				description="Clique no produto para anotar. Selecione a quantidade desejada pelo
				cliente e envie o pedido para a cozinha."
			/>
			<Container data-testid="add-products-to-table-request-page">
				<div className="total">
					<strong>
						Total:{' '}
						<span data-testid="final-total-price">
							{convertNumberToBRLCurrency(finalPrice)}
						</span>
					</strong>
				</div>
				<div className="products-list">{productList}</div>

				<BottomNavigation>
					<ul>{categories}</ul>
				</BottomNavigation>
				<div className="bt-send-to-kitchen">
					<Button
						data-testid="send-to-kitchen-button"
						variant="primary"
						size="big"
						label="Enviar para cozinha"
						onClick={handleClickSendToKitchen}
					/>
				</div>
			</Container>
			<Modal
				closeModal={handleCloseModal}
				openModal={handleOpenModal}
				open={showModal}
			>
				<Form onSubmit={handleObservationSubmit}>
					<Input
						label="Observação"
						name="observation"
						data-testid="observation-field"
					/>
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-around',
							paddingTop: '24px',
						}}
					>
						<Button
							data-testid="cancel-modal-button"
							variant="cancel"
							label="Não, cancelar"
							onClick={handleCloseModal}
						/>

						<Button
							data-testid="continue-modal-button"
							variant="primary"
							label="Continuar"
							type="submit"
						/>
					</div>
				</Form>
			</Modal>
		</>
	)
}

export default AddProductsToTableRequest
