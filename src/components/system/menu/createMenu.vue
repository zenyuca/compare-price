<template lang="pug">
  #createNotice.wrapper-content
    c-header.wrapper-createNotice-header(:menuNames="menuNames")
    .wrapper-createNotice-content
      .wrapper-createNotice-middle
        el-tree(ref="tree-menus", :data="menus", node-key="id", :show-checkbox="false", :accordion="true", :props="defaultProps", :expand-on-click-node="false", :render-content="renderContent", @node-click="nodeClick")
        el-dialog(:title='title', v-model='addboxStatus', size='large')
          el-form(:model='menu', ref='password', label-width='100px')
            el-row()
              el-col(:span="11")
                el-form-item(label='父ID：', prop='parentId')
                  el-input(v-model='menu.parentId', disabled="disabled")
                el-form-item(label='父菜单名：', prop='parentName', v-if="method === 1")
                  el-input(v-model='menu.parentName', disabled="disabled")
                el-form-item(label='菜单等级：', prop='level')
                  el-input(v-model='menu.level', type="number", min="1", disabled="disabled")
                el-form-item(label='ID：', prop='id')
                  el-input(v-model='menu.id', placeholder="请输入ID")
                el-form-item(label='路由：', prop='route')
                  el-input(v-model='menu.route', placeholder="请输入路由名称")
                el-form-item(label='菜单名：', prop='name')
                  el-input(v-model='menu.name', placeholder="请输入菜单名")
                el-form-item(label='菜单标题：', prop='titleName')
                  el-input(v-model='menu.titleName', placeholder="请输入标题菜单")
                el-form-item(label='排序等级：', prop='sort')
                  el-input(v-model='menu.sort', placeholder="请输入排序等级", type="number", min="1")
                el-form-item(label='图标：', prop='icon')
                  el-input(v-model='menu.icon', placeholder="请输入图标名称")
                el-form-item(label='预览：', prop='icon')
                  .preview
                    i(:class="menu.icon")
                    span.name
                      | {{menu.name}}
              el-col(:span="11", :push="1")
                el-form-item(label='路由配置：', prop='icon')
                  textarea.routes(contenteditable="contenteditable", v-model="menu.routeSet")
          .dialog-footer(slot='footer', style='text-align: center')
            el-button(type='primary', @click='addMenu')
              | 确 定
            el-button(@click='addboxStatus = false')
              | 取 消
</template>

<script>
  import CHeader from '../../common/header/cHeader.vue'
  import { mapGetters, mapActions } from 'vuex'
  import filters from '../../../core/filters'
  import { getAllMenu, createMenu, modifyMenu, deleteMenu } from '../../../core/api/system/systemApi'
  export default {
    name: 'createNotice',
    components: {
      CHeader
    },
    beforeRouteEnter (to, from, next) {
      next()
    },
    data () {
      return {
        menuNames: [
          {
            name: '创建菜单',
            route: '',
            on: true
          }
        ],
        title: '',
        method: 1,    // 1： 添加； 2： 修改
        addboxStatus: false,
        menu: {
          id: '',
          parentId: '',
          parentName: '',
          name: '',
          icon: '',
          route: '',
          routeSet: '',
          titileName: '',
          sort: 0,
          level: 1
        },
        menus: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        }
      }
    },
    created () {
      this.loadData()
    },
    mounted () {
    },
    computed: {
      ...mapGetters(['getPage'])
    },
    methods: {
      ...filters,
      ...mapActions(['loadAllDept', 'createNotice', 'loadSendDetails', 'uploadFile', 'goBack']),
      loadData () {
        getAllMenu().then((data) => {
          this.menus = data
        })
      },
      nodeClick (data, node, nodeCom) {
      },
      remove (store, data) {
        this.$confirm(`真的要删除《${data.name}》？此操作将无法恢复, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteMenu({id: data.id}).then((data2) => {
            this.store.remove(data)
          })
        }).catch(() => {
        })
      },
      append (store, data) {
        this.store = store
        this.data = data
        this.menu = {}
        this.menu.parentId = data.id
        this.menu.parentName = data.name
        this.menu.id = data.id
        this.menu.level = data.level + 1
        this.addboxStatus = true
        this.title = '添加子菜单'
        this.method = 1
      },
      edit (store, data) {
        this.store = store
        this.data = data
        this.menu.seq = data.seq
        this.menu.parentId = data.parentId
        this.menu.id = data.id
        this.menu.name = data.name
        this.menu.sort = data.sort
        this.menu.level = data.level
        this.menu.route = data.route
        this.menu.routeSet = data.routeSet
        this.menu.titleName = data.titleName
        this.menu.icon = data.icon
        this.addboxStatus = true
        this.title = '修改菜单'
        this.method = 2
      },
      addMenu () {
        if (this.method === 1) {
          createMenu(this.menu).then((data) => {
            if (typeof data === 'string') {
              this.$alert(data, '提示', {
                confirmButtonText: '确定',
                callback: action => {
                }
              })
            } else {
              this.store.append(data, this.data)
              this.addboxStatus = false
            }
          })
        } else {
          modifyMenu(this.menu).then((data) => {
            if (typeof data === 'string') {
              this.$alert(data, '提示', {
                confirmButtonText: '确定',
                callback: action => {
                }
              })
            } else {
              data.children = this.store.currentNode.data.children
              this.store.currentNode.data = data
              this.addboxStatus = false
            }
          })
        }
      },
      renderContent (h, { node, data, store }) {
        return h('div', {
          attrs: {
            style: 'display: inline-block; flex: 1; z-index: 100;'
          }
        }, [
          h('span', {}, [
            h('span', {
              attrs: {
                style: 'font-size: 14px'
              }
            }, data.name)
          ]),
          h('span', {
            attrs: {
              style: 'float: right; margin-right: 20px'
            }
          }, [
            h('el-button', {
              attrs: {
                size: 'mini',
                type: 'success'
              },
              on: {
                '!click': () => { this.append(store, data) }
              }
            }, '添加'),
            h('el-button', {
              attrs: {
                size: 'mini',
                type: 'success'
              },
              on: {
                '!click': () => { this.edit(store, data) }
              }
            }, '修改'),
            h('el-button', {
              attrs: {
                size: 'mini',
                type: 'danger'
              },
              on: {
                '!click': () => { this.remove(store, data) }
              }
            }, '删除')
          ])
        ])
      }
    }
  }
</script>

<style lang="less">
  .el-tree-node__content {
    display: flex;
    .el-tree-node__expand-icon {
      margin-top: 13px;
    }
  }
  .preview {
    i {
      margin-right: 10px;
    }
    i, span {
      vertical-align: middle;
    }
  }
  .routes {
    padding: 15px;
    width: 100%;
    min-height: 450px;
    font-size: 14px;
    line-height: 20px;
    border-radius: 4px;
    border: 1px solid;
    outline: none;
    resize: none;
  }
</style>
