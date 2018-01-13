<template lang="pug">
  #org-list.wrapper-content
    c-header.wrapper-namelistNotice-header(:menuNames="menuNames")
    .wrapper-list-content
      .wrapper-list-middle
        .list
          el-table(:data='tableData', :border="true", row-class-name="notices-row")
            el-table-column(label-class-name='notices-header', align='center', width="77", prop='number', label='序号', fixed="left")
            el-table-column(label-class-name='notices-header', align='center', prop='name', label='公司名称')
            el-table-column(label-class-name='notices-header', align='center', prop='organizCode', label='三证合一代码（组织机构代码）')
            el-table-column(label-class-name='notices-header', align='center', prop='chargePerson', label='负责人')
            el-table-column(label-class-name='notices-header', align='center', prop='phone', label='联系电话')
            el-table-column(label-class-name='notices-header', align='center', max-width="80", prop='status', label='操作', fixed="right")
              template(slot-scope='scope')
                el-button.btn-edit(type='text', size='small', @click="approve(scope.row.id)")
                  | 审批
          .bar-page
            c-page(:callBack="loadData")
</template>

<script>
  import CHeader from '../../../../../common/header/cHeader.vue'
  import CPage from '../../../../../common/page/cPage.vue'
  import { bindTableWhellEvent, fixedHeight } from '../../../../../../core/utils/event'
  import filters from '../../../../../../core/filters'
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
        menuNames: [
          {
            name: '红娘审批',
            route: 'redgirl',
            on: false
          },
          {
            name: '机构审批',
            route: '',
            on: true
          },
          {
            name: '活动审批',
            route: 'activity',
            on: false
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
      ...mapActions(['resetPage', 'loadFindHLDepartment']),
      loadData () {
        let keyParam = {
          'audit': 0
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
              chargePerson: item.chargePerson
            }
            list.push(o)
          }
          this.tableData = list
          this.getPage.total = data.total
        })
      },
      approve (id) {
        this.$router.push(`org/detail/${id}`)
      }
    }
  }
</script>

<style lang="less">
  @import "../../common/common";
</style>
