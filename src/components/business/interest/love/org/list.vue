<template lang="pug">
  #redgirl-list.wrapper-content
    c-header(:menuNames="menuNames")
      .toolbar(slot="right")
        .searcher
          .select
            el-select(v-model="searchType", @change="searchTypeSelect")
              el-option(v-for="item in searchOptions", :key="item.value", :label="item.label", :value="item.value")
          .input
            el-input(placeholder="搜索", icon="search", v-model="searchText", :on-icon-click="handleSeach")
        .btn.btn-export(@click="exportInfo")
          | 导出
    .wrapper-list-content
      .wrapper-list-middle
        .list
          el-table(:data='tableData', :border="true", row-class-name="notices-row")
            el-table-column(label-class-name='notices-header', align='center', width="77", prop='number', label='序号', fixed="left")
            el-table-column(label-class-name='notices-header', align='center', prop='name', label='机构名称')
            el-table-column(label-class-name='notices-header', align='center', prop='organizCode', label='三证合一代码（组织机构代码）')
            el-table-column(label-class-name='notices-header', align='center', prop='chargePerson', label='负责人')
            el-table-column(label-class-name='notices-header', align='center', prop='phone', label='联系电话')
            el-table-column(label-class-name='notices-header', align='center', prop='address', label='单位地址')
            el-table-column(label-class-name='notices-header', align='center', max-width="80", prop='status', label='操作', fixed="right")
              template(slot-scope='scope')
                el-button.btn-edit(type='text', size='small', @click="detail(scope.row.id)")
                  | 查看
                el-button.btn-del(type='text', size='small', @click="del(scope.row.id)")
                  | 删除
          .bar-page
            c-page(:callBack="loadData")
</template>

<script>
  import CHeader from '../../../../common/header/cHeader.vue'
  import CPage from '../../../../common/page/cPage.vue'
  import { bindTableWhellEvent, fixedHeight } from '../../../../../core/utils/event'
  import filters from '../../../../../core/filters'
  import { mapGetters, mapActions } from 'vuex'
  export default {
    name: 'namelistActivity',
    components: {
      CHeader,
      CPage
    },
    beforeRouteEnter (to, from, next) {
      next()
    },
    data () {
      return {
        currentPage: 1,
        searchType: '1',
        searchText: '',
        searchOptions: [
          {
            value: '',
            label: '请选择'
          },
          {
            value: '1',
            label: '联系电话'
          },
          {
            value: '2',
            label: '负责人'
          },
          {
            value: '3',
            label: '单位地址'
          }
        ],
        menuNames: [
          {
            name: '机构管理',
            route: '',
            on: true
          }
        ],
        tableData: []
      }
    },
    created () {
      this.resetPage()
      this.loadData()
    },
    destroyed () {
    },
    mounted () {
      this.$nextTick(() => {
        bindTableWhellEvent()
        fixedHeight()
      })
    },
    computed: {
      ...mapGetters(['getPage'])
    },
    methods: {
      ...filters,
      ...mapActions(['resetPage', 'loadFindHLDepartment', 'deleteHLDepartment', 'exportHLDepartment']),
      loadData () {
        let keyParam = {
          audit: -1, // 查询所有,-1忽略audit状态
          searchType: this.searchType,
          searchText: this.searchText
        }
        this.loadFindHLDepartment(keyParam).then((data) => {
          let list = []
          let i = 0
          for (let item of data.list) {
            let o = {
              number: i,
              id: item.id,
              name: item.name,
              organizCode: item.organizCode,
              phone: item.phone,
              chargePerson: item.chargePerson,
              address: item.address
            }
            list.push(o)
          }
          this.tableData = list
          this.getPage.total = data.total
        })
      },
      resetChangePage () {
        this.getPage.page = 1
        this.notices = []
        this.getPage.hasNextPage = true
      },
      handleSeach () {
        this.resetChangePage()
        this.loadData()
      },
      searchTypeSelect (data) {
        this.searchType = data
      },
      detail (id) {
        this.$router.push(`org/detail/${id}`)
      },
      del (id) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteHLDepartment(id).then((dta) => {
            this.loadData()
          })
        }).catch(() => {
        })
      },
      exportInfo () {
        let keyParam = {
          audit: -1, // 查询所有,-1忽略audit状态
          searchType: this.searchType,
          searchText: this.searchText
        }
        const newTab = window.open('about:blank')
        this.exportHLDepartment(keyParam).then((url) => {
          newTab.location.href = url
        })
      }
    }
  }
</script>

<style lang="less">
  @import "../common/common";
</style>
