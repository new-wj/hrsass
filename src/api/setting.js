import axios from '@/utils/request'

/**
 * 获取角色列表
 * @param {*} page  页码
 * @param {*} pagesize 每页显示条数
 */
export function getRoleList(page = 1, pagesize = 10) {
  return axios({
    url: '/sys/role',
    params: {
      page,
      pagesize
    }
  })
}

/**
 * 删除角色
 * @param {*} id 角色id
 */
export function delRole(id) {
  return axios({
    method: 'DELETE',
    url: '/sys/role/' + id
  })
}

/**
 * 新增角色
 * @param {*} data 角色数据
 */
export function addRole(data) {
  return axios({
    method: 'POST',
    url: '/sys/role',
    data
  })
}
/**
 * 根据ID获取角色详情
 * @param {*} id 角色ID
 */
export function getRoleDetail(id) {
  return axios({
    url: '/sys/role/' + id
  })
}

/**
 * 修改角色
 * @param {*} data 修改角色数据
 */
export function editRole(data) {
  return axios({
    method: 'PUT',
    url: '/sys/role/' + data.id,
    data
  })
}

export function getCompanyById(id) {
  return axios({
    url: `/company/${id}`
  })
}

/**
 * 给角色分配权限
 */
export function assignPerm(data) {
  return axios({
    url: '/sys/role/assignPrem',
    method: 'put',
    data
  })
}
