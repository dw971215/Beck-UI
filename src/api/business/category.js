import request from '@/utils/request'

// 查询商品分类列表
export function listCategory(query) {
  return request({
    url: '/business/category/list',
    method: 'get',
    params: query
  })
}

// 查询商品分类详细
export function getCategory(id) {
  return request({
    url: '/business/category/' + id,
    method: 'get'
  })
}

// 新增商品分类
export function addCategory(data) {
  return request({
    url: '/business/category',
    method: 'post',
    data: data
  })
}

// 修改商品分类
export function updateCategory(data) {
  return request({
    url: '/business/category',
    method: 'put',
    data: data
  })
}

// 删除商品分类
export function delCategory(id) {
  return request({
    url: '/business/category/' + id,
    method: 'delete'
  })
}

// 导出商品分类
export function exportCategory(query) {
  return request({
    url: '/business/category/export',
    method: 'get',
    params: query
  })
}