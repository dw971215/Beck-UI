import request from '@/utils/request'

// 查询商品列表
export function listGood(query) {
  return request({
    url: '/business/good/list',
    method: 'get',
    params: query
  })
}

// 查询商品详细
export function getGood(id) {
  return request({
    url: '/business/good/' + id,
    method: 'get'
  })
}

// 新增商品
export function addGood(data) {
  return request({
    url: '/business/good',
    method: 'post',
    data: data
  })
}

// 修改商品
export function updateGood(data) {
  return request({
    url: '/business/good',
    method: 'put',
    data: data
  })
}

// 删除商品
export function delGood(id) {
  return request({
    url: '/business/good/' + id,
    method: 'delete'
  })
}

// 导出商品
export function exportGood(query) {
  return request({
    url: '/business/good/export',
    method: 'get',
    params: query
  })
}