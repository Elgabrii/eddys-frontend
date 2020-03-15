import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Landing from '../views/Landing/Landing'
import Login from '../views/Login/Login'
const Routes = () => {
  return (
    <Switch>
      <Route exact path="/" component={Landing} />
      <Route path="/login" component={Login} />
    </Switch>
  )
}
export default Routes
