import { createReducer, createActions } from 'reduxsauce'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  signInStart: [],
  signInSuccess: ['token'],
  signInFailure: ['error'],
  getUserSuccess: ['user'],
  getUserFailure: ['error'],
  signOut: [],
  clearError: [],
  setError: ['error'],
  checkUserSessionStart: [],
  checkUserSessionSuccess: ['user'],
  checkUserSessionFailure: ['error'],
})

export const UserTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = {
  user: {},
  isGettingUser: false,
  isLogin: false,
  token: null
}

/* ------------- Reducers ------------- */
const signInStart = (state) => ({
  ...state,
  isGettingUser: true,
})
const signInSuccess = (state, { token }) => ({
  ...state,
  isGettingUser: false,
  isLogin: true,
  token: token,
})
const getUserSuccess = (state, { user }) => ({
  ...state,
  isGettingUser: false,
  isLogin: true,
  ...user,
})

const signOut = (state) => INITIAL_STATE

const checkUserSessionStart = state => ({
  ...state,
  isGettingUser: true,
  isLogin: false,
})
const checkUserSessionSuccess = (state, { user }) => ({
  ...state,
  isLogin: true,
  isGettingUser: false,
  ...user
})

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.SIGN_IN_START]: signInStart,
  [Types.SIGN_IN_SUCCESS]: signInSuccess,
  [Types.GET_USER_SUCCESS]: getUserSuccess,
  [Types.SIGN_OUT]: signOut,
  [Types.CHECK_USER_SESSION_START]: checkUserSessionStart,
  [Types.CHECK_USER_SESSION_SUCCESS]: checkUserSessionSuccess,
})
