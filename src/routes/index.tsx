import React from 'react'
import { Switch } from 'react-router-dom'

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
// import Error404 from '../pages/Error404'
import AddProductsToTableRequest from '../pages/AddProductsToTableRequest'
import TableRequestDetails from '../pages/TableRequestDetails'
import SelectTable from '../pages/SelectTable'
import PayTableRequest from '../pages/PayTableRequest'
import CloseCashier from '../pages/CloseCashier'
import Cashier from '../pages/Cashier'
import EditProfile from '../pages/EditProfile'

const Routes: React.FC = () => (
	<Switch>
		<Route path="/login" component={Login} />
		<Route path="/registrar" component={Register} />
		<Route path="/esqueci-a-senha" exact component={ForgetPassword} />
		<Route path="/esqueci-a-senha/:token" component={NewPassword} />
		<AppContainer>
			<Route exact path="/" component={Dashboard} isPrivate />
			<Route exact path="/dashboard" component={Dashboard} isPrivate />
			<Route exact path="/editar-perfil" component={EditProfile} isPrivate />

			<Route exact path="/novo-produto" component={NewProduct} isPrivate />
			<Route exact path="/produtos" component={Products} isPrivate />
			<Route
				path="/editar-produto/:product_id"
				component={NewProduct}
				isPrivate
			/>

			<Route
				path="/adicionar-produto/:table_id"
				component={AddProductsToTableRequest}
				isPrivate
			/>
			<Route
				path="/detalhes-do-pedido/:table_id"
				component={TableRequestDetails}
				isPrivate
			/>
			<Route path="/novo-pedido" component={SelectTable} isPrivate />
			<Route
				path="/finalizar/:table_id"
				component={PayTableRequest}
				isPrivate
			/>
			<Route exact path="/caixa" component={Cashier} isPrivate />
			<Route exact path="/abrir-caixa" component={OpenCashier} isPrivate />
			<Route exact path="/fechar-caixa" component={CloseCashier} isPrivate />
		</AppContainer>
		{/* <ReactDOMRoute path="*">
			<Error404 />
		</ReactDOMRoute> */}
	</Switch>
)

export default Routes
