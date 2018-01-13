<template lang="pug">
  #redgirl-list.wrapper-content
    c-header(:menuNames="menuNames")
      .toolbar(slot="right")
        .selecter
          .label
            | 性别:
          el-select(v-model="sexSelect", @change="sexTypeSelect")
            el-option(v-for="item in sexOptions", :key="item.value", :label="item.label", :value="item.value")
        .selecter
          .label
            | 红娘类型:
          el-select(v-model="redgirlSelect", @change="redgirlTypeSelect")
            el-option(v-for="item in redgirlTypeOptions", :key="item.value", :label="item.label", :value="item.value")
        .searcher
          .select
            el-select(v-model="searchType", @change="searchTypeSelect")
              el-option(v-for="item in searchOptions", :key="item.value", :label="item.label", :value="item.value")
          .input
            el-input(placeholder="搜索", icon="search", v-model="searchText", :on-icon-click="handleSeach")
        .btn.btn-export(@click="$refs['protocal-modal'].show()")
          | 导出
    protocal-modal(ref="protocal-modal", @sure="exportInfo()")
    .wrapper-list-content
      .wrapper-list-middle
        .list
          el-table(:data='tableData', :border="true", row-class-name="notices-row")
            el-table-column(label-class-name='notices-header', align='center', width="77", prop='number', label='序号', fixed="left")
            el-table-column(label-class-name='notices-header', align='center', prop='name', label='姓名')
            el-table-column(label-class-name='notices-header', align='center', prop='sex', label='性别')
            el-table-column(label-class-name='notices-header', align='center', prop='type', label='红娘类型')
            el-table-column(label-class-name='notices-header', align='center', prop='phone', label='联系电话')
            el-table-column(label-class-name='notices-header', align='center', prop='marryDeptName', label='所属机构')
            el-table-column(label-class-name='notices-header', align='center', prop='cardNo', label='身份证号')
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
  import protocalModal from '../../../../common/modal/protocalModal.vue'

  export default {
    name: 'namelistActivity',
    components: {
      CHeader,
      CPage,
      protocalModal
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
            value: '3',
            label: '身份证号'
          },
          {
            value: '4',
            label: '红娘姓名'
          }
        ],
        sexSelect: '',
        sexOptions: [
          {
            value: '',
            label: '请选择'
          },
          {
            value: '1',
            label: '男'
          },
          {
            value: '2',
            label: '女'
          }
        ],
        redgirlSelect: '',
        redgirlTypeOptions: [
          {
            value: '',
            label: '请选择'
          },
          {
            value: '0',
            label: '个人红娘'
          },
          {
            value: '1',
            label: '机构红娘'
          }
        ],
        menuNames: [
          {
            name: '红娘管理',
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
      ...mapActions(['resetPage', 'loadMatchmaker', 'deleteMatchmaker', 'exportMatchmaker', 'goBack']),
      loadData () {
        let keyParam = {
          audit: -1, // 查询所有,-1忽略audit状态
          sex: this.sexSelect,
          type: this.redgirlSelect,
          searchType: this.searchType,
          searchText: this.searchText
        }
        this.loadMatchmaker(keyParam).then((data) => {
          let list = []
          let i = 0
          for (let item of data.list) {
            let o = {
              number: i,
              id: item.id,
              name: item.name,
              sex: this.sexFilter(item.sex),
              phone: item.phone,
              type: this.matchmakerTypeFilter(item.type),
              marryDeptName: item.marryDeptName,
              cardNo: item.cardNo

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
        if (this.searchType === '0') {
          this.$alert('请选择搜索类型', '提示', {
            confirmButtonText: '确定',
            callback: action => {
            }
          })
          return
        }
        this.resetChangePage()
        this.loadData()
      },
      searchTypeSelect (data) {
        this.searchType = data
      },
      sexTypeSelect (data) {
        this.sexSelect = data
        this.loadData()
      },
      redgirlTypeSelect (data) {
        this.redgirlSelect = data
        this.loadData()
      },
      detail (id) {
        this.$router.push(`detail/${id}`)
      },
      del (id) {
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteMatchmaker(id).then((data) => {
            this.loadData()
          })
        }).catch(() => {
        })
      },
      exportInfo () {
        let keyParam = {
          audit: -1, // 查询所有,-1忽略audit状态
          sex: this.sexSelect,
          type: this.redgirlSelect,
          searchType: this.searchType,
          searchText: this.searchText
        }
        const newTab = window.open('about:blank')
        this.exportMatchmaker(keyParam).then((url) => {
          newTab.location.href = url
        })
      }
    }
  }
</script>

<style lang="less">
  @import "../common/common";
</style>
