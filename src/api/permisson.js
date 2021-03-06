import axios from '@/utils/request'

/**
 * 获取权限列表
 */
export function getPermissionList() {
  return axios({
    url: '/sys/permission'
  })
}

/**
 * 新增权限
 * @param {*} data
 * @returns
 */
export function addPermission(data) {
  return axios({
    method: 'POST',
    url: '/sys/permission',
    data
  })
}

/**
 * 更新权限
 * @param {*} data
 * @returns
 */
export function updatePermission(data) {
  return axios({
    method: 'PUT',
    url: `/sys/permission/${data.id}`,
    data
  })
}

/**
 * 获取权限详情
 * @param {*} id
 */
export function getPermissionDetail(id) {
  return axios({
    url: `/sys/permission/${id}`
  })
}

/**
 * 删除权限
 */
export function delPermission(id) {
  return axios({
    method: 'DELETE',
    url: `/sys/permission/${id}`
  })
}
