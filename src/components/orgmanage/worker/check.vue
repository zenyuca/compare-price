<template>
  <div id="publishOrg" class="wrapper-content">
    <!--<c-header class="wrapper-publishOrg-header" :menuNames="menuNames">-->
    <!--</c-header>-->
    <div class="wrapper-publishOrg-header" id="content-header">
      <menuHead :items="menu"></menuHead>
    </div>
    <div class="wrapper-publishOrg-content">
      <div class="wrapper-publishOrg-middle">
        <div class="publishOrgBox">
            <el-table v-loading="loading" :data="tableData" border style="width: 100%">
                <el-table-column fixed type="index" width="80" label="序号" align="center">
                </el-table-column>
                <el-table-column prop="name" label="单位" :show-overflow-tooltip="true" align="center">
                </el-table-column>
                <el-table-column prop="applyName" label="申请人姓名" align="center">
                </el-table-column>
                <el-table-column prop="applyPhone" label="联系电话" align="center">
                </el-table-column>
                <el-table-column prop="created" :formatter="({created}) => new Date(created).Format('yyyy-MM-dd hh:mm')" label="申请时间" align="center">
                </el-table-column>
                <el-table-column fixed="right" label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="goUrl(['workerDetail',{id:scope.row.id,type:0}])">{{['','审批','查看详情','审批','查看详情'][$route.params.id]}}</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="bar-page" style="margin-top:40px;">
                <c-page :callBack="loadData"></c-page>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import menuHead from '../../common/menuHead/menuHead.vue'
import CPage from '../../common/page/cPage.vue'
import { mapGetters, mapActions } from 'vuex'
// import { uuid } from '../../../core/utils/tool'
// import _ from 'lodash'
// import { Loading } from 'element-ui'
import filters from '../../../core/filters'
import Modal from '../../common/modal/modal.vue'

export default {
  components: {
    menuHead,
    CPage,
    Modal
  },
  data () {
    return {
      tableData: [],
      loading: true,
      menu: [
        {id: '1', url: '/orgmanage/worker/check/1', name: '待我审批'},
        {id: '2', url: '/orgmanage/worker/check/2', name: '未通过'},
        {id: '3', url: '/orgmanage/worker/check/3', name: '所有待审批'},
        {id: '4', url: '/orgmanage/worker/check/4', name: '所有未通过'}
      ]
    }
  },
  watch: {
  // 如果路由有变化，会再次执行该方法
    '$route': 'routeChange'
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
    ...mapActions(['loadAuditApi', 'goUrl']),
    loadData () {
      this.loading = true
      this.loadAuditApi(this.$route.params.id).then((data) => {
        this.getPage.total = data.total
        this.tableData = data.list
        this.loading = false
        console.log(this.tableData)
      })
    },
    routeChange (route) {
      this.loadData()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
// @import "../../common/less/common";
@content-height: 100%;
@contacts-header-height: 72px;
@wrapper-btn-bar-height: 80px;
@rightWidth: 435px;
#content-header {
  width: 100%;
  height: 60px;
  background-color: #ffffff;
  position: relative;
}


#publishOrg {
  width: 100%;
  height: 100%;

  font-size: 16px;
  box-sizing: border-box;
  .wrapper-publishOrg-header {
    .toolbar {
      height: 60px;
    }
  }
  .wrapper-publishOrg-content {
    padding: 20px;
    box-sizing: border-box;
    height: calc(~"100% - 60px");
    .wrapper-publishOrg-middle {
      width: 100%;border-radius: 4px;
      height: @content-height;
      background-color: #ffffff;
    }
  }
}
</style>
