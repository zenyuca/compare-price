const menus = [
  {
    id: '/index',
    name: '首页',
    route: '/index',
    single: true,
    routeSet: [
      {
        path: '/index',
        componentPath: 'business/interest/love/index.vue'
      }
    ]
  },
  {
    id: '/vegetable/zhaobiao',
    name: '菜品招标管理',
    icon: '',
    children: [
      {
        id: '/vegetable/zhaobiao/rou',
        parentId: '/vegetable/zhaobiao',
        name: '菜品招标',
        route: '/vegetable/zhaobiao/cai',
        routeSet: [
          {
            path: '/vegetable/zhaobiao/cai',
            componentPath: 'vegetable/zhaobiao/cai.vue'
          }
        ]
      },
      {
        id: '/vegetable/zhaobiao/rou',
        parentId: '/vegetable/zhaobiao',
        name: '肉类招标',
        route: '/vegetable/zhaobiao/rou',
        routeSet: [
          {
            path: '/vegetable/zhaobiao/rou',
            componentPath: 'vegetable/zhaobiao/rou.vue'
          }
        ]
      },
      {
        id: '/vegetable/zhaobiao/rou',
        parentId: '/vegetable/zhaobiao',
        name: '干杂招标',
        route: '/vegetable/zhaobiao/gan',
        routeSet: [
          {
            path: '/vegetable/zhaobiao/gan',
            componentPath: 'vegetable/zhaobiao/gan.vue'
          }
        ]
      },
      {
        id: '/vegetable/zhaobiao/rou',
        parentId: '/vegetable/zhaobiao',
        name: '水产招标',
        route: '/vegetable/zhaobiao/shui',
        routeSet: [
          {
            path: '/vegetable/zhaobiao/shui',
            componentPath: 'vegetable/zhaobiao/shui.vue'
          }
        ]
      },
      {
        id: '/vegetable/zhaobiao/rou',
        parentId: '/vegetable/zhaobiao',
        name: '其他招标',
        route: '/vegetable/zhaobiao/other',
        routeSet: [
          {
            path: '/vegetable/zhaobiao/other',
            componentPath: 'vegetable/zhaobiao/other.vue'
          }
        ]
      }
    ]
  },
  {
    id: '/vegetable',
    name: '菜品投标结果',
    icon: '',
    children: [
      {
        id: '/vegetable/toubiao/rou',
        parentId: '/vegetable/toubiao',
        name: '菜品投标',
        route: '/vegetable/toubiao/cai',
        routeSet: [
          {
            path: '/vegetable/toubiao/cai',
            componentPath: 'vegetable/toubiao/cai.vue'
          }
        ]
      },
      {
        id: '/vegetable/toubiao/rou',
        parentId: '/vegetable/toubiao',
        name: '肉类投标',
        route: '/vegetable/toubiao/rou',
        routeSet: [
          {
            path: '/vegetable/toubiao/rou',
            componentPath: 'vegetable/toubiao/rou.vue'
          }
        ]
      },
      {
        id: '/vegetable/toubiao/rou',
        parentId: '/vegetable/toubiao',
        name: '干杂投标',
        route: '/vegetable/toubiao/gan',
        routeSet: [
          {
            path: '/vegetable/toubiao/gan',
            componentPath: 'vegetable/toubiao/gan.vue'
          }
        ]
      },
      {
        id: '/vegetable/toubiao/rou',
        parentId: '/vegetable/toubiao',
        name: '水产投标',
        route: '/vegetable/toubiao/shui',
        routeSet: [
          {
            path: '/vegetable/toubiao/shui',
            componentPath: 'vegetable/toubiao/shui.vue'
          }
        ]
      },
      {
        id: '/vegetable/toubiao/rou',
        parentId: '/vegetable/toubiao',
        name: '其他投标',
        route: '/vegetable/toubiao/other',
        routeSet: [
          {
            path: '/vegetable/toubiao/other',
            componentPath: 'vegetable/toubiao/other.vue'
          }
        ]
      }
    ]
  },
  {
    id: '/vegetable/dailishang',
    name: '代理商管理',
    icon: '',
    role: 1,
    children: [
      {
        id: '/vegetable/dailishang',
        parentId: '/vegetable/dailishang',
        name: '代理商',
        route: '/vegetable/dailishang/list',
        routeSet: [
          {
            path: '/vegetable/dailishang/list',
            componentPath: 'vegetable/dailishang/dailishang.vue'
          }
        ]
      }
    ]
  },
  {
    id: '/vegetable/image',
    name: '图片管理',
    icon: '',
    role: 1,
    children: [
      {
        id: '/vegetable/image',
        parentId: '/vegetable/image',
        name: '图片',
        route: '/vegetable/image/list',
        routeSet: [
          {
            path: '/vegetable/image/list',
            componentPath: 'vegetable/image/image.vue'
          }
        ]
      }
    ]
  },
  {
    id: '/vegetable/notice',
    name: '注意事项',
    route: '/vegetable/notice',
    single: true,
    routeSet: [
      {
        path: '/vegetable/notice',
        componentPath: 'vegetable/notice.vue'
      }
    ]
  }
]

function getRoutes (list, menus, loginUser) {
  if (!menus) return
  for (let item of menus) {
    if (loginUser.role === 0) {
      if (item.role === 1) {
        continue
      }
    }
    if (item.routeSet) {
      for (let route of item.routeSet) {
        list.push(route)
      }
    }
    if (item.children) {
      getRoutes(list, item.children, loginUser)
    }
  }
}

function initMenu (router, loginUser) {
  let list = []
  getRoutes(list, menus, loginUser)
  initRouter(router, list)
}

function initRouter (router, list) {
  let routerList = []
  for (let item of list) {
    item.component = () => import(`@com/${item.componentPath}`)
    routerList.push(item)
  }

  let routerObject = [
    {
      path: '',
      component: () => import('@com/common/menu/menu.vue'),
      children: routerList
    }
  ]
  router.addRoutes(routerObject)
}

function getMenus (loginUser) {
  let list = []
  if (!menus) return
  for (let item of menus) {
    if (loginUser.role === 0) {
      if (item.role === 1) {
        continue
      }
    }
    list.push(item)
  }
  return list
}

export {
  initMenu,
  getMenus
}