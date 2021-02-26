import axios from '@/utils/request'
/**
 *  获取员工的简单列表
 * **/
export function getEmployeeSimple() {
  return axios({
    url: '/sys/user/simple'
  })
}
