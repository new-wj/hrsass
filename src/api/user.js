import axios from '@/utils/request'

export function login(data) {
  return axios({
    method: 'POST',
    url: '/sys/login',
    data
  })
}

export function getUserInfo() {
  return axios({
    url: '/sys/profile',
    method: 'post'
  })
}

export function getUserDetail(id) {
  return axios({
    url: '/sys/user/' + id
  })
}
