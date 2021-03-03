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

/**
 * 添加员工
 * @param {*} data
 */
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

/**
 * 导入表格
 * @param {*} data
 */
export function importEmployee(data) {
  return axios({
    url: '/sys/user/batch',
    method: 'post',
    data
  })
}

/**
 * 更新员工信息
 * @param {*} data
 */
export function saveUserDetailById(data) {
  return axios({
    url: `/sys/user/${data.id}`,
    method: 'put',
    data
  })
}

/**
 * 根据id读取详细数据
 * @param {*} id
 */
export function getPersonalDetail(id) {
  return axios({
    url: `/employees/${id}/personalInfo`
  })
}

/**
 * 更新用户详细信息
 * @param {*} data
 */
export function updatePersonal(data) {
  return axios({
    method: 'PUT',
    url: `/employees/${data.userId}/personalInfo`,
    data
  })
}

/**
 * 获取用户岗位信息
 * @param {*} id
 */
export function getJobDetail(id) {
  return axios({
    url: `/employees/${id}/jobs`
  })
}

/**
 * 保存用户岗位信息
 * @param {*} data
 */
export function updateJob(data) {
  return axios({
    url: `/employees/${data.userId}/jobs`,
    method: 'PUT',
    data
  })
}
