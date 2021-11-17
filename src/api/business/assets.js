import request from '@/utils/request'

// 查询用户资产列表
export function listAssets(query) {
  return request({
    url: '/business/assets/list',
    method: 'get',
    params: query
  })
}

// 查询用户资产详细
export function getAssets(id) {
  return request({
    url: '/business/assets/' + id,
    method: 'get'
  })
}

// 新增用户资产
export function addAssets(data) {
  return request({
    url: '/business/assets',
    method: 'post',
    data: data
  })
}

// 修改用户资产
export function updateAssets(data) {
  return request({
    url: '/business/assets',
    method: 'put',
    data: data
  })
}

// 删除用户资产
export function delAssets(id) {
  return request({
    url: '/business/assets/' + id,
    method: 'delete'
  })
}

// 导出用户资产
export function exportAssets(query) {
  return request({
    url: '/business/assets/export',
    method: 'get',
    params: query
  })
}