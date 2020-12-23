import React, { Component, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Route, Redirect } from 'react-router-dom'

function PrivateRoute({ component: Component, isLogin, ...rest }) {
  const [open, setOpen] = React.useState(false);

  return <>
    <Route
      {...rest}
      render={(props) =>
        isLogin ? (
          <Component {...props} />
        ) : (
            <Redirect to="/login" />
          )
      }
    />
  </>

}

export default connect(state => ({
  isLogin: state.user.isLogin
}), dispatch => ({
}))(PrivateRoute)
