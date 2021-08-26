import request from '@/utils/request'

export function getDept(params) {
  return request({
    url: '/getDept',
    method: 'get',
    params
  })
}
