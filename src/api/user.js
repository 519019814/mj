import request from '@/utils/request'

export function login(data) {
  data.placeId = 1
  return request({
    url: '/login/password/check',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/login/password/getuser',
    method: 'get',
    params: {
      token
    }
  })
}

export function logout() {
  return request({
    url: '/verify/logout',
    method: 'post'
  })
}
// 获取用户列表
export function getUsers(params) {
  return request({
    url: '/getUsers',
    method: 'get',
    params
  })
}
