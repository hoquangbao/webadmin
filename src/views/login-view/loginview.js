import React from 'react'
import { connect } from 'react-redux'

//app components
const SignIn = React.lazy(() => import('../../components/sign-in'))

const LoginView = (props) => {
  console.log('rendering login view')
  return (<>
    <SignIn/>
  </>)
}

LoginView.propTypes = {}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = (dispatch) => ({})

export default connect(mapStateToProps, mapDispatchToProps)(LoginView)
