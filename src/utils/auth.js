import Cookies from 'js-cookie'

const TokenKey = 'hrSass_token'
const TimeKey = 'hrSass_time'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function setTime(time) {
  Cookies.set(TimeKey, time)
}

export function getTime() {
  return Cookies.get(TimeKey)
}
