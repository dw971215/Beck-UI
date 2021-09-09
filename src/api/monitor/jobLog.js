import request from '@/utils/request'

const api =  '/api'

// 查询调度日志列表
export function listJobLog(query) {
  return request({
    url: api + '/monitor/jobLog/list',
    method: 'get',
    params: query
  })
}

// 删除调度日志
export function delJobLog(jobLogId) {
  return request({
    url: api + '/monitor/jobLog/' + jobLogId,
    method: 'delete'
  })
}

// 清空调度日志
export function cleanJobLog() {
  return request({
    url: api +  '/monitor/jobLog/clean',
    method: 'delete'
  })
}

// 导出调度日志
export function exportJobLog(query) {
  return request({
    url: api +  '/monitor/jobLog/export',
    method: 'get',
    params: query
  })
}