import request from '@/utils/request'

export function getAssessment(params) {
  return request({
    url: '/getAssessments',
    method: 'get',
    params
  })
}
