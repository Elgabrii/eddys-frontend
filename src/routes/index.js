import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Login from '../views/Login/Login'
import Orders from 'views/Orders/Orders'
import Products from 'views/Products/Products'


const routes = [
  {
    path: '/',
    component: Products,
  },
  {
    path: '/login',
    component: Login,
  },
  {
    path: '/orders',
    component: Orders,
  },
]

const Routes = () => {
  return (
    <Switch>
      {routes.map((route) => (
        <Route
          exact
          key={route.path}
          path={route.path}
          component={route.component}
        />
      ))}
    </Switch>
  )
}
export default Routes
