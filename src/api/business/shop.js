import request from '@/utils/request'

// 查询商户门店列表
export function listShop(query) {
  return request({
    url: '/business/shop/list',
    method: 'get',
    params: query
  })
}

// 查询商户门店详细
export function getShop(id) {
  return request({
    url: '/business/shop/' + id,
    method: 'get'
  })
}

// 新增商户门店
export function addShop(data) {
  return request({
    url: '/business/shop',
    method: 'post',
    data: data
  })
}

// 修改商户门店
export function updateShop(data) {
  return request({
    url: '/business/shop',
    method: 'put',
    data: data
  })
}

// 删除商户门店
export function delShop(id) {
  return request({
    url: '/business/shop/' + id,
    method: 'delete'
  })
}

// 导出商户门店
export function exportShop(query) {
  return request({
    url: '/business/shop/export',
    method: 'get',
    params: query
  })
}