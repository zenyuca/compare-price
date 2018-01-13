<template lang="pug">
  #memberSelectCom
    .right
      header
        .btn-select
          | 选择接收人
        .btn-filter(:class="{'on': openFilter}", @click="toggleFilter()")
          | 筛选
        .btn-all(:class="{'on': isAllSelected}", @click="toggleAllSelected()")
          | 全部
      section
        el-tree(:data="contacts", show-checkbox, :indent="25", node-key="id", :render-content="renderContent", :default-expanded-keys="[0]", :default-checked-keys="[0]", :props="defaultProps", ref="tree")
      .panel-filter(v-show="openFilter")
        .row(v-for="dept in depts")
          .panel-filter-header
            .item
              el-checkbox(v-model="dept.selected", @change="toggleDept(dept)")
                | {{ dept.name }}
          .panel-filter-section
            .item(v-for="job in dept.children")
              el-checkbox(v-model="job.selected", @change="toggleJob(job)")
                | {{ job.name }}
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import _ from 'lodash'
  import { Loading } from 'element-ui'
  import filters from '../../../core/filters'

  export default {
    name: 'memberSelectCom',
    components: {
    },
    beforeRouteEnter (to, from, next) {
      next()
    },
    props: {
    },
    data () {
      return {
        contacts: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        loadingInstance: null,
        loadDone: false,
        openFilter: false,
        isAllSelected: true,
        currentDeptLevel: 1,
        sendeeId: {},
        depts: [],
        btnName: ''
      }
    },
    created () {
      this.loadContactsData()
      this._initDeptsLable()
    },
    mounted () {
    },
    computed: {
      ...mapGetters(['getAccount'])
    },
    methods: {
      ...filters,
      ...mapActions(['loadAllDept', 'findSendeeId']),
      getNodes () {
        return this.$refs.tree.getCheckedNodes()
      },
      setNodes (nodes) {
        this.$refs.tree.setCheckedNodes(nodes)
      },
      loadContactsData () {
        this.loadingInstance = Loading.service({text: '工会信息较多，正拼命加载中...'})
        this.loadAllDept({}).then((data) => {
          this.contacts = data
          this.$nextTick(() => {
            if (this.loadingInstance) {
              this.$refs.tree.setCheckedNodes(this.contacts)
              this.loadingInstance.close()
            }
          })
        })
      },
      renderContent (h, { node, data, store }) {
        if (data.userid) {
          if (!data.avatar) {
            data.avatar = '/static/image/avatar-boy.jpg'
          }

          return h('div', {
            attrs: {
              class: 'contact-item'
            }
          }, [
            h('img', {
              attrs: {
                class: 'contact-avatar',
                src: data.avatar
              }
            }),
            h('div', {
              attrs: {
                class: 'contact-name'
              }
            }, data.name),
            h('div', {
              attrs: {
                class: 'contact-job'
              }
            }, this.positionTypeFilter(data.positionType))
          ], data.name)
        } else {
          return h('span', {
            attrs: {
              class: 'contact-item dept'
            }
          }, data.name)
        }
      },
      toggleFilter () {
        this.openFilter = !this.openFilter
        this.isAllSelected = false
        if (!this.openFilter) {
          this.findSendeeId(this.sendeeId).then((data) => {
            this.$refs.tree.setCheckedNodes(data)
            this.isAllSelected = this._isAllSelectedForFilter()
          })
        }
      },
      _isAllSelectedForFilter () {
        for (let p in this.sendeeId) {
          if (this.sendeeId[p].toString() !== [1, 2, 3].toString()) {
            return false
          }
        }
        return true
      },
      toggleAllSelected () {
        this.isAllSelected = !this.isAllSelected
        if (this.isAllSelected) {
          for (let p in this.sendeeId) {
            this.sendeeId[p] = [1, 2, 3]
          }
        } else {
          for (let p in this.sendeeId) {
            this.sendeeId[p] = []
          }
        }
        this.openFilter = false
        this.findSendeeId(this.sendeeId).then((data) => {
          this.$refs.tree.setCheckedNodes(data)
          this._initDeptsLable()
        })
      },
      _getDeptLabel () {
        this.currentDeptLevel = this.getAccount.deptLevel
        switch (this.currentDeptLevel) {
          case 1:
            return ['本工会', '下级工会', '下下级工会']
          case 2:
            return ['本工会', '下级工会']
          case 3:
            return ['本工会']
        }
      },
      _initDeptsLable () {
        let lables = this._getDeptLabel()
        let jobs = ['主席', '副主席', '委员']
        let list = []
        lables.forEach((e, i) => {
          let children = []
          jobs.forEach((c, j) => {
            children.push({
              id: (j + 1),
              parentId: (i + 1),
              name: c,
              selected: false
            })
          })
          list.push({
            id: (i + 1),
            name: e,
            selected: false,
            children
          })
          this.sendeeId[(i + 1)] = []
        })
        this.depts = list
      },
      toggleDept (dept) {
        let children = this._findDeptChildren(dept.id)
        this._setDeptChildren(children, dept.selected)
        if (dept.selected) {
          this.sendeeId[dept.id] = [1, 2, 3]
        } else {
          this.sendeeId[dept.id] = []
        }
      },
      toggleJob (job) {
        if (this._isAllSelected(this._findDeptChildren(job.parentId))) {
          this._findDept(job.parentId).selected = true
        }
        if (job.selected) {
          this.sendeeId[job.parentId].push(job.id)
        } else {
          this._findDept(job.parentId).selected = false
          _.remove(this.sendeeId[job.parentId], (e) => {
            if (e === job.id) {
              return true
            }
          })
        }
      },
      _findDeptChildren (deptId) {
        return this._findDept(deptId).children
      },
      _findDept (deptId) {
        for (let item of this.depts) {
          if (deptId === item.id) {
            return item
          }
        }
      },
      _setDeptChildren (list, selected) {
        for (let item of list) {
          item.selected = selected
        }
      },
      _isAllSelected (list) {
        for (let item of list) {
          if (!item.selected) {
            return false
          }
        }
        return true
      },
      _isAllUnselected (list) {
        for (let item of list) {
          if (item.selected) {
            return false
          }
        }
        return true
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
  @import "../../common/less/common";

  @content-height: 100%;
  @contacts-header-height: 72px;
  @wrapper-btn-bar-height: 80px;
  @rightWidth: 435px;

  #memberSelectCom {
    height: 100%;
    .right {
      width: @rightWidth;
      position: relative;
      header {
        height: @contacts-header-height;
        padding: 21px 0;
        box-sizing: border-box;
        .btn-select, .btn-all, .btn-filter {
          display: inline-block;
          font-size: 14px;
        }
        .btn-select {
          width: 96px;
          height: 30px;
          line-height: 30px;
          color: #ffffff;
          background-color: #9aa1ae;
          text-align: center;
          border-radius: 0px 15px 15px 0px;
        }
        .btn-all, .btn-filter {
          float: right;
          width: 68px;
          height: 28px;
          line-height: 28px;
          border: 1px solid #9AA1AE;
          border-radius: 4px;
          text-align: center;
          margin-right: 20px;
          cursor: pointer;
          &.on {
            color: #477CBE;
            border: 1px solid #477CBE;
          }
        }
        .btn-all {
          .icon {
            display: inline-block;
            margin-right: 3px;
            img {
              width: 18px;
              height: 14px;
              vertical-align: sub;
            }
          }
        }
      }
      section {
        height: calc(~"100% - 25px - "@contacts-header-height);
        border-top: 1px solid #F0F0F0;
        margin: 0 10px;
        margin-bottom: 20px;
        overflow: auto;
        z-index: 2;
      }
      .panel-filter {
        position: absolute;
        top: 72px;
        left: 20px;
        width: 390px;
        z-index: 2;
        border: 1px solid #F0F0F0;
        box-shadow: 0px 3px 5px #F0F0F0;
        box-shadow: 1px 0px 3px #F0F0F0;
        box-shadow: -1px 0px 3px #F0F0F0;
        border-radius: 4px;
        background-color: #ffffff;
        padding-top: 30px;
        padding-left: 30px;
        box-sizing: border-box;
        font-size: 14px;
        color: #121212;
        .row {
          height: 74px;
          margin-bottom: 24px;
          .panel-filter-header, .panel-filter-section {

          }
          .panel-filter-section {
            margin-top: 15px;
          }
          .item {
            display: inline-block;
            width: 115px;
            height: 20px;
            line-height: 20px;
            .icon {
              display: inline-block;
              width: 20px;
              height: 20px;
              border: 1px solid #9AA1AE;
              border-radius: 50%;
              margin-right: 13px;
              vertical-align: middle;
              cursor: pointer;
              img {
                width: 20px;
                height: 20px;
              }
              &.on {
                border: 1px solid transparent;
                background-color: #477CBE;
              }
            }
          }
        }
      }
    }
    // 对 tree 的修正
    .contact-item, .contact-avatar, .contact-name-job {
      display: inline-block;
    }
    .dept {
      color: #9AA1AE;
      font-size: 14px;
    }
    .contact-item {
      flex: 1;
      padding: 12px 0;
      line-height: 32px;
      .contact-avatar, .contact-name, .contact-job {
        float: left;
      }
      .contact-avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        margin-right: 11px;
        margin-left: 6px;
      }
      .contact-name{
        color: #4D4D4D;
        font-size: 14px;
      }
      .contact-job {
        float: right;
        color: #9AA1AE;
        font-size: 14px;
      }
    }

    .el-tree {
      border: 0;
      padding-right: 17px;
      padding-bottom: 20px;
      .el-tree-node__content {
        line-height: 56px;
        height: 56px;
        &:hover {
          background-color: transparent;
        }
      }
      .el-tree-node__children {
        .el-tree-node {
          .el-tree-node__content {
            display: flex;
            .contact-item {
              border-bottom: 1px solid #F0F0F0;
            }
            .el-tree-node__expand-icon {
              margin-top: 22px;
              margin-right: 10px;
            }
          }
          &:last-child {
            .contact-item {
              border-bottom: none;
            }
          }
        }
      }
    }
  }
</style>
