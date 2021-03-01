import axios from '@/utils/request'
/**
 *  获取员工的简单列表
 * **/
export function getEmployeeSimple() {
  return axios({
    url: '/sys/user/simple'
  })
}

/**
 * 获取员工数据
 * @param {*} page 页码
 * @param {*} size 每页数据条数
 */
export function getEmployeeList(page = 1, size = 10) {
  return axios({
    url: '/sys/user',
    params: {
      page,
      size
    }
  })
}

export function addEmployee(data) {
  return axios({
    url: '/sys/user',
    method: 'POST',
    data
  })
}

/**
 * 删除员工
 * @param {*} id 员工id
 */
export function delEmployee(id) {
  return axios({
    method: 'DELETE',
    url: `/sys/user/${id}`
  })
}
