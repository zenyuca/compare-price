export default (router, vm) => {
  router.beforeEach((to, from, next) => {
    // alert(to.path)
    next()
  })
}
