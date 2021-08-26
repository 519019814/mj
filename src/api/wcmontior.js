import request from '@/utils/request'

export function getWcList(params) {
  return request({
    url: '/getWcMontior',
    method: 'get',
    params
  })
}
// 获取区域
export function getWcArea(data) {
  return request({
    url: '/getWcArea',
    method: 'get',
    data
  })
}
// 获取单个
export function getWcInfo(params) {
  return request({
    url: '/getWcInfo',
    method: 'get',
    params
  })
}
