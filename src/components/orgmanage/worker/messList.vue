<template>
  <div id="publishOrg" class="wrapper-content">
    <c-header class="wrapper-publishOrg-header" :menuNames="menuNames">
      <div slot="right">
        <div class="btnGroup">
          <el-button @click="goUrl(['createMess',{id:'create'}])">新建消息</el-button>
        </div>
      </div>
    </c-header>
    <div class="wrapper-publishOrg-content">
      <div class="wrapper-publishOrg-middle">
        <div class="publishOrgBox">
          <div class="publishOrgTitle">
            <el-form :inline="true" class="demo-form-inline">
              <el-form-item class="searchInp">
                <select-input :change="change" def-key="1"
                              :options="{1: '标题',2:'消息内容',3:'发送人'}"></select-input>
              </el-form-item>
            </el-form>
          </div>
          <el-table :data="tableData" border style="width: 100%" v-loading="loading">
            <el-table-column fixed type="index" label="序号" width="80px;" align="center">
            </el-table-column>
            <el-table-column prop="title" label="标题" :show-overflow-tooltip="true" align="center">
            </el-table-column>
            <el-table-column prop="content" label="消息内容" :show-overflow-tooltip="true" align="center">
            </el-table-column>
            <el-table-column prop="createby" label="发送人" :show-overflow-tooltip="true" align="center">
            </el-table-column>
            <el-table-column prop="deptName" label="所属工会" :show-overflow-tooltip="true" align="center">
            </el-table-column>
            <el-table-column prop="createTime" :formatter="({createTime})=>new Date(createTime).Format('yyyy-MM-dd hh:mm')" label="发送时间" align="center">
            </el-table-column>
            <el-table-column fixed="right" label="操作" align="center">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="goUrl(['createMess',{id:scope.row.id}])">查看详情</el-button>
                <el-button type="text" style="color:rgb(239, 100, 100);" size="small" @click="del(scope.row)">删除</el-button>
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
  import CHeader from '../../common/header/cHeader.vue'
  import SelectInput from '../../common/selectInput/MySelectInput.vue'
  import MySelect from '../../common/select/MySelect.vue'
  import CPage from '../../common/page/cPage.vue'
  import { confirm, success, error } from '../../../core/utils/actions'
  import { mapGetters, mapActions } from 'vuex'
  import filters from '../../../core/filters'
  import Modal from '../../common/modal/modal.vue'
  // import { findDepListApi } from '../../../core/api/orgmanage/org/index'

  export default {
    name: 'publishOrg',
    components: {
      CHeader,
      CPage,
      Modal,
      SelectInput,
      MySelect
    },
    beforeRouteEnter (to, from, next) {
      next()
    },
    data () {
      return {
        loading: false,
        form: {},
        menuNames: [
          {
            name: '消息列表',
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
    mounted () {
    },
    computed: {
      ...mapGetters(['getPage'])
    },
    methods: {
      ...filters,
      ...mapActions(['goUrl', 'findMessApi', 'resetPage', 'delMessApi']),
      loadData () {
        this.loading = true
        this.findMessApi().then((data) => {
          this.getPage.total = data.total
          this.tableData = data.list
          this.loading = false
        })
      },
      change () {
        this.loadData()
      },
      del ({id}) {
        confirm(`确定删除该条信息吗?`, 'warning').then(() => {
          this.delMessApi(id).then(() => {
            this.loadData()
            success('删除成功')
          }).catch(() => {
            error('服务器开小差啦')
          })
        })
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

    .publishOrgBox{ padding: 20px;}
    .publishOrgTitle .el-input__inner{ background-color: #FAFAFA;
      border-color: #EFF2FA;
    }
    .publishOrgTitle {
      .searchInp{
        float:right;font-size:0;
        .el-input__inner{
          border-radius: 0;
        }
      }
    }
    .btnGroup{
      margin-top: 12px;margin-right:30px;
      .el-button:nth-child(1) {
        background-color: #FB9926;color: #ffffff;border: none;
        padding: 10px 30px;
      }
    }
    .line{ text-align: center;}
    .selectList{ height: 50px;line-height: 50px;border-bottom: 1px solid #e7e7e7;}
  }
</style>
