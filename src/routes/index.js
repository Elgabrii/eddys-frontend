import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Login from '../views/Login/Login'
import Orders from 'views/Orders/Orders'
import Products from 'views/Products/Products'
import Categories from 'views/Categories/Categories';
import Messages from 'views/Messages/Messages';
import Catering from 'views/Catering/Catering';
import Zones from 'views/Zones/Zones';

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
    path: '/catering',
    component: Catering
  },
  {
    path: '/orders',
    component: Orders,
  },
  {
    path: '/categories',
    component: Categories
  },
  {
    path: '/messages',
    component: Messages
  },
  {
    path: '/zones',
    component: Zones
  }
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
