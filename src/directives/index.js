// 负责管理所有的自定义指令
// v-imgerror="备用图地址"
export const imgerror = {
  // el 指令所在的元素
  // binding 指令的相关信息对象, binding.value 指令的值
  inserted(el, binding) {
    // console.log(el, bindings)
    el.onerror = function() {
      // console.log('图片加载失败了'), 设置备用图片地址
      el.src = binding.value
    }
  }
}
