import request from '@/utils/request'

// 查询商品规格分类列表
export function listSpecs(query) {
  return request({
    url: '/business/specs/list',
    method: 'get',
    params: query
  })
}

// 查询商品规格分类详细
export function getSpecs(id) {
  return request({
    url: '/business/specs/' + id,
    method: 'get'
  })
}

// 新增商品规格分类
export function addSpecs(data) {
  return request({
    url: '/business/specs',
    method: 'post',
    data: data
  })
}

// 修改商品规格分类
export function updateSpecs(data) {
  return request({
    url: '/business/specs',
    method: 'put',
    data: data
  })
}

// 删除商品规格分类
export function delSpecs(id) {
  return request({
    url: '/business/specs/' + id,
    method: 'delete'
  })
}

// 导出商品规格分类
export function exportSpecs(query) {
  return request({
    url: '/business/specs/export',
    method: 'get',
    params: query
  })
}

// 改变属性状态修改
export function changeDefaultStatus(id, status) {
  const data = {
    id: id,
    isDefault: status
  }
  return request({
    url: '/business/specs/changeStatus',
    method: 'put',
    data: data
  })
}
