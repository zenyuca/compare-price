import Vue from 'vue'

Vue.axios.interceptors.request.use(function (config) {
  // console.log(JSON.stringify(config, null, 2))
  return config
}, function (error) {
  return Promise.reject(error)
})

Vue.axios.interceptors.response.use(function (response) {
  // console.log(JSON.stringify(response, null, 2))
  // let {menu, status} = response
  // if (status === 200) {
  //   return
  // }
  // console.log(menu, status)
  return response
}, function (error) {
  return Promise.reject(error)
})
