import React, { Suspense, useEffect } from 'react'
import { connect } from 'react-redux'
import { Switch, Route, Redirect } from 'react-router-dom'
//routes
import { authRoutes as routes } from '../../_routes'
//app components

const AuthLayout = (props) => {
  const renderRoutes = (routes = {}, userRole = '') =>
    routes.map(({ key, component: Component, componentProps, path, name, exact, rolesAccess }) => {
      return Component && rolesAccess.includes(userRole) ? (
        <Route
          key={key || path}
          path={path}
          exact={exact}
          name={name}
          render={(props) => <Component {...props} {...componentProps} />}
        />
      ) : null
    })
  useEffect(() => {
    // const { isLogin } = props
    // if(isLogin) {
    //   props.push('/app/dashboard')
    // }
  }, [])

  return (
      <div className="auth-layout">
        <Suspense fallback={<></>}>
          <Switch>
            {renderRoutes(routes)}
            <Redirect to="/404" />
          </Switch>
        </Suspense>
        <Suspense fallback={<></>}></Suspense>
      </div>
    )
}
AuthLayout.propTypes = {}

const mapStateToProps = (state) => ({
})

export default connect(mapStateToProps)(AuthLayout)
