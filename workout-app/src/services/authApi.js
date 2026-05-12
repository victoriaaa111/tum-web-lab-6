import { apiRequest } from './apiClient'

export function login(email, password) {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export function signup(username, email, password) {
  return apiRequest('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ username, email, password }),
  })
}

export function logout() {
  return apiRequest('/auth/logout', { method: 'POST' })
}

export function getMe() {
  return apiRequest('/auth/me')
}
