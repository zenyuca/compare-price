<template lang="pug">
  #namelist-list.wrapper-content
    c-header(:menuNames="menuNames")
      .toolbar(slot="right")
        .selecter
          .label
            | 是否签到:
          el-select(v-model="signSelect", @change="signTypeSelect")
            el-option(v-for="item in signTypeOptions", :key="item.value", :label="item.label", :value="item.value")
        .searcher
          .select
            el-select(v-model="searchType", @change="searchTypeSelect")
              el-option(v-for="item in searchOptions", :key="item.value", :label="item.label", :value="item.value")
          .input
            el-input(placeholder="搜索", icon="search", v-model="searchText", :on-icon-click="handleSeach")
        .btn.btn-export(@click="dialogFormVisible = true")
          | 群发消息
        .btn.btn-export(@click="$refs['protocal-modal'].show()")
          | 导出
        .goback
          img(src='/static/icon/goback.png', alt='返回', @click='goBack')
    protocal-modal(ref="protocal-modal", @sure="exportInfo()")
    .wrapper-list-content
      .wrapper-list-middle
        .list
          el-table(:data='tableData', :border="true", row-class-name="notices-row")
            el-table-column(label-class-name='notices-header', align='center', width="77", prop='number', label='序号', fixed="left")
            el-table-column(label-class-name='notices-header', align='center', width="80" prop='name', label='姓名')
            el-table-column(label-class-name='notices-header', align='center', width="80" prop='age', label='年龄')
            el-table-column(label-class-name='notices-header', align='center', width="80" prop='sexInfo', label='性别')
            el-table-column(label-class-name='notices-header', align='center', width="120" prop='phone', label='联系电话')
            el-table-column(label-class-name='notices-header', align='center', width="120" prop='singleType', label='婚姻状况')
            el-table-column(label-class-name='notices-header', align='center', width="80" prop='education', label='学历')
            el-table-column(label-class-name='notices-header', align='center', width="80" prop='registerRegion', label='户籍')
            el-table-column(label-class-name='notices-header', align='center', width="100" prop='height', label='身高')
            el-table-column(label-class-name='notices-header', align='center', width="100" prop='depName', label='所属单位')
            <!--el-table-column(label-class-name='notices-header', align='center', width="100" prop='depName', label='职位')-->
            el-table-column(label-class-name='notices-header', align='center', width="100" prop='income', label='收入')
            el-table-column(label-class-name='notices-header', align='center', width="100" prop='purchase', label='是否购房')
            el-table-column(label-class-name='notices-header', align='center', width="100" prop='carBuy', label='是否购车')
            el-table-column(label-class-name='notices-header', align='center', width="100" prop='introduce', label='自我介绍')
            el-table-column(label-class-name='notices-header', align='center', width="100" prop='auditInfo', label='会员类型')
            el-table-column(label-class-name='notices-header', align='center', width="100" prop='signStatusInfo', label='是否签到')
          .bar-page
            c-page(:callBack="loadData")
    el-dialog(title="群发消息",:visible.sync="dialogFormVisible")
      el-form
        el-form-item(label="消息内容：", prop="messageContent")
          el-input(v-model="messageContent",auto-complete="off")
      .dialog-footer(slot="footer")
        el-button(@click="dialogFormVisible = false")
          | 取 消
        el-button(type="primary",@click="sendMsg")
          | 确 定
</template>

<script>
  import CHeader from '../../../../common/header/cHeader.vue'
  import CPage from '../../../../common/page/cPage.vue'
  import { bindTableWhellEvent, fixedHeight } from '../../../../../core/utils/event'
  import filters from '../../../../../core/filters'
  import { mapGetters, mapActions } from 'vuex'
  import { success, error } from '../../../../../core/utils/actions'
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
        dialogFormVisible: false,
        messageContent: '',
        currentPage: 1,
        searchType: '',
        searchText: '',
        searchOptions: [
          {
            value: '',
            label: '请选择'
          },
          {
            value: '1',
            label: '姓名'
          },
          {
            value: '2',
            label: '联系电话'
          },
          {
            value: '3',
            label: '负责人'
          }
        ],
        signSelect: '',
        signTypeOptions: [
          {
            value: '',
            label: '请选择'
          },
          {
            value: '0',
            label: '否'
          },
          {
            value: '1',
            label: '是'
          }
        ],
        menuNames: [
          {
            name: '名单管理',
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
      ...mapActions(['resetPage', 'loadHLActivityNameList', 'goBack', 'exportHLActivityNameList', 'hlActivitySendMsg']),
      loadData () {
        let keyParam = {
          signStatus: this.signSelect,
          activityId: this.$route.params.id,
          searchType: this.searchType,
          searchText: this.searchText
        }
        this.loadHLActivityNameList(keyParam).then((data) => {
          let list = []
          let i = 0
          for (let item of data.list) {
            let o = {
              number: i,
              id: item.id,
              name: item.name,
              sexInfo: this.sexFilter(item.sex),
              phone: item.phone,
              marryDeptName: item.marryDeptName,
              cardNo: item.cardNo,
              age: item.age,
              singleType: this.singleTypeFilter(item.singleType),
              education: item.education,
              registerRegion: item.registerRegion,
              height: item.height,
              depName: item.depName,
              income: item.income,
              purchase: item.purchase === 1 ? '是' : '否',
              carBuy: item.carBuy === 1 ? '是' : '否',
              introduce: item.introduce,
              auditInfo: item.auditType === 2 ? '认证会员' : '普通会员',
              signStatusInfo: item.signStatus === 1 ? '已签到' : '未签到'
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
      signTypeSelect (data) {
        this.signSelect = data
        this.loadData()
      },
      detail (id) {
        this.$router.push(`redgirl/detail/${id}`)
      },
      qrCode (id) {
        alert(id)
      },
      namelist (id) {
        alert(id)
      },
      create () {
        this.$router.push(`activity/create`)
      },
      del (id) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
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
          signStatus: this.signSelect,
          activityId: this.$route.params.id,
          searchType: this.searchType,
          searchText: this.searchText
        }
        const newTab = window.open('about:blank')
        this.exportHLActivityNameList(keyParam).then((url) => {
          newTab.location.href = url
        })
      },
      sendMsg () {
        if (!this.messageContent || !this.$route.params.id) {
          error('请填写发送信息')
        } else {
          let msg = {
            id: this.$route.params.id,
            msgContent: this.messageContent
          }
          this.hlActivitySendMsg(msg).then((data) => {
            this.messageContent = ''
            this.dialogFormVisible = false
            success('发送成功')
          }).catch((data) => {
            error(data.msg)
          })
        }
      }
    }
  }
</script>

<style lang="less">
  @import "../common/common";
  #namelist-list {
    .goback {
      float: right !important;
      margin-bottom: 20px !important;
      top: -5px;
    }
  }
</style>
