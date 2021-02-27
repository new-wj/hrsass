import axios from '@/utils/request'
export function getDepartmentList() {
  return axios({
    url: '/company/department'
  })
}

/**
 * 删除部门
 * @param {string} id 删除的部门id
 */
export function delDepartment(id) {
  return axios({
    method: 'delete',
    url: `/company/department/${id}`
  })
}

/**
 * 新增部门
 * @param {Object} data 新增的部门对象参数
 */
export function addDepartment(data) {
  return axios({
    method: 'POST',
    url: '/company/department',
    data
  })
}

/**
 * 根据id查询部门详情
 * @param {String} id 部门id
 */
export function getDept(id) {
  return axios({
    url: `/company/department/${id}`
  })
}

export function editDepartment(data) {
  return axios({
    method: 'PUT',
    url: `/company/department/${data.id}`,
    data
  })
}
