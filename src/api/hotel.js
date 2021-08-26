import request from '@/utils/request'

// 获取房型列表
export function getHotelList(query) {
  return request({
    url: '/subscribe/getSubscribeHouse',
    method: 'get',
    params: query
  })
}

// 添加房型列表
export function createHotelDetail(data) {
  return request({
    url: '/subscribe/addSubscribeHouse',
    method: 'post',
    data
  })
}

// 编辑房型列表/subscribe/getSubscribeRegister
export function updateHotelDetail(data) {
  return request({
    url: '/subscribe/updateSubscribeHouse',
    method: 'post',
    data
  })
}

// 获取预约列表/subscribe/addSubscribeRegister
export function getSubscribeRegister(params) {
  return request({
    url: '/subscribe/getSubscribeRegister',
    method: 'get',
    params
  })
}

// 添加用户预约信息
export function addSubscribeRegister(data) {
  return request({
    url: '/subscribe/addSubscribeRegister',
    method: 'post',
    data
  })
}

// 删除房型
export function deleteSubscribeHouse(params) {
  return request({
    url: '/subscribe/deleteSubscribeHouse',
    method: 'delete',
    params
  })
}
