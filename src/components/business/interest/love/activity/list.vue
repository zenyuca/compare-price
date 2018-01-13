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
        .btn.btn-export(@click="create")
          | 发起活动
    .wrapper-list-content
      .wrapper-list-middle
        .list
          el-table(:data='tableData', :border="true", row-class-name="notices-row")
            el-table-column(label-class-name='notices-header', align='center', width="77", prop='number', label='序号', fixed="left")
            el-table-column(label-class-name='notices-header', :show-overflow-tooltip="true", align='center', prop='name', label='活动名称')
            el-table-column(label-class-name='notices-header', :show-overflow-tooltip="true", align='center', prop='ActivityTime', label='活动时间')
            el-table-column(label-class-name='notices-header', :show-overflow-tooltip="true", align='center', prop='entryTime', label='报名时间')
            el-table-column(label-class-name='notices-header', :show-overflow-tooltip="true", align='center', prop='sponsor', label='发起单位')
            el-table-column(label-class-name='notices-header', :show-overflow-tooltip="true", align='center', prop='chargePerson', label='单位负责人')
            el-table-column(label-class-name='notices-header', :show-overflow-tooltip="true", align='center', prop='phone', label='联系电话')
            el-table-column(label-class-name='notices-header', :show-overflow-tooltip="true", align='center', prop='entry', label='报名权限')
            el-table-column(label-class-name='notices-header', :show-overflow-tooltip="true", align='center', prop='current', label='报名人数')
            el-table-column(label-class-name='notices-header', :show-overflow-tooltip="true", align='center', prop='signCurrent', label='签到人数')
            el-table-column(label-class-name='notices-header', :show-overflow-tooltip="true", align='center', prop='status', label='活动状态')
            el-table-column(label-class-name='notices-header', align='center', min-width="250", prop='status', label='操作', fixed="right")
              template(slot-scope='scope')
                el-button.btn-edit(type='text', size='small', @click="detail(scope.row.id)")
                  | 查看/编辑
                el-button.btn-edit(type='text', size='small', @click="qrCode(scope.row.ticket)")
                  | 签到二维码
                el-button.btn-edit(type='text', size='small', @click="namelist(scope.row.id)")
                  | 名单管理
                el-button.btn-edit(type='text', size='small', @click="census(scope.row.id)")
                  | 活动统计
                el-button.btn-del(type='text', size='small', @click="del(scope.row.id)")
                  | 删除
          .bar-page
            c-page(:callBack="loadData")
        el-dialog(v-model="show",size="tiny")
          h1(style="text-align: center;font-weight: bold")
            |活动二维码
            img(width="100%",:src="code",alt="活动二维码")
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
        show: false,
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
            label: '发起单位'
          },
          {
            value: '2',
            label: '负责人'
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
            name: '活动管理',
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
      ...mapActions(['resetPage', 'loadHLActivity', 'deleteHLActivity', 'goBack']),
      loadData () {
        let keyParam = {
          audit: -1, // 查询所有,-1忽略audit状态
          sex: this.sexSelect,
          type: this.redgirlSelect,
          searchType: this.searchType,
          searchText: this.searchText
        }
        this.loadHLActivity(keyParam).then((data) => {
          let list = []
          let i = 0
          for (let item of data.list) {
            let o = {
              number: i,
              id: item.id,
              name: item.name,
              ActivityTime: new Date(item.start).Format('yyyy-MM-dd hh:mm') + '----' + new Date(item.end).Format('yyyy-MM-dd hh:mm'),
              entryTime: new Date(item.entryStart).Format('yyyy-MM-dd hh:mm') + '----' + new Date(item.entryEnd).Format('yyyy-MM-dd hh:mm'),
              sponsor: item.sponsor,
              chargePerson: item.chargePerson,
              phone: item.phone,
              current: item.current,
              signCurrent: item.signCurrent,
              status: this.activityTypeFilter(item.status),
              ticket: item.ticket,
              entry: this.entryTypeStrFilter(item.entry)
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
      sexTypeSelect (data) {
        this.sexSelect = data
        this.loadData()
      },
      redgirlTypeSelect (data) {
        this.redgirlSelect = data
        this.loadData()
      },
      detail (id) {
        this.$router.push(`edit/${id}`)
      },
      qrCode (id) {
        this.code = `https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=${id}`
        this.show = true
      },
      namelist (id) {
        this.$router.push(`namelist/${id}`)
      },
      census (id) {
        this.$router.push(`census/${id}`)
      },
      create () {
        this.$router.push(`create`)
      },
      del (id) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteHLActivity(id).then((data) => {
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
