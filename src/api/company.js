import request from '@/utils/request'

export function getCompanyList(params) {
  return request({
    url: '/getCompanyList',
    method: 'get',
    params
  })
}

export function getCompanyInfo(params) {
  return request({
    url: '/getCompanyInfo',
    method: 'get',
    params
  })
}
