import request from '@/utils/request'

// 查询用户列表
export function listCustomer(query) {
  return request({
    url: '/business/customer/list',
    method: 'get',
    params: query
  })
}

// 查询用户详细
export function getCustomer(id) {
  return request({
    url: '/business/customer/' + id,
    method: 'get'
  })
}

// 新增用户
export function addCustomer(data) {
  return request({
    url: '/business/customer',
    method: 'post',
    data: data
  })
}

// 修改用户
export function updateCustomer(data) {
  return request({
    url: '/business/customer',
    method: 'put',
    data: data
  })
}

// 删除用户
export function delCustomer(id) {
  return request({
    url: '/business/customer/' + id,
    method: 'delete'
  })
}

// 导出用户
export function exportCustomer(query) {
  return request({
    url: '/business/customer/export',
    method: 'get',
    params: query
  })
}