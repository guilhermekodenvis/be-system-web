import React from 'react'
import { Switch, Route as ReactDOMRoute } from 'react-router-dom'

import Route from './Route'

import Dashboard from '../pages/Dashboard'
import Login from '../pages/Login'
import Register from '../pages/Register'
import ForgetPassword from '../pages/ForgetPassword'
import NewPassword from '../pages/ForgetPassword/NewPassword'
import NewProduct from '../pages/NewProduct'
import Products from '../pages/Products'
import OpenCashier from '../pages/OpenCashier'
import AppContainer from '../components/AppContainer'
import Error404 from '../pages/Error404'
import ProductsToRequest from '../pages/ProductsToRequest'
import TableRequestDetails from '../pages/TableRequestDetails'
import SelectTable from '../pages/SelectTable'

const Routes: React.FC = () => (
	<Switch>
		<Route path="/login" component={Login} />
		<Route path="/registrar" component={Register} />
		<Route path="/esqueci-a-senha" exact component={ForgetPassword} />
		<Route path="/esqueci-a-senha/:token" component={NewPassword} />
		<AppContainer>
			<Route exact path="/" component={Dashboard} isPrivate />

			<Route exact path="/novo-produto" component={NewProduct} isPrivate />
			<Route exact path="/produtos" component={Products} isPrivate />
			<Route exact path="/abrir-caixa" component={OpenCashier} isPrivate />
			<Route
				path="/adicionar-produto/:table_id"
				component={ProductsToRequest}
				isPrivate
			/>
			{/* <Route
				path="/pedidos/:table-request-id"
				component={ProductsToRequest}
				isPrivate
			/> */}
			<Route
				path="/detalhes-do-pedido"
				component={TableRequestDetails}
				isPrivate
			/>
			<Route path="/novo-pedido" component={SelectTable} isPrivate />
		</AppContainer>
		{/* <ReactDOMRoute path="*">
			<Error404 />
		</ReactDOMRoute> */}
	</Switch>
)

export default Routes
