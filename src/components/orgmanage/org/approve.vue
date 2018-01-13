<template>
  <div id="publishOrg" class="wrapper-content">
    <!--<c-header class="wrapper-publishOrg-header" :menuNames="menuNames">-->
    <!--</c-header>-->
    <div class="wrapper-publishOrg-header" id="content-header">
      <ul class="menuNames">
        <li class="menuName" :class="{on:$route.params.id === '1'}">
          <router-link :to="{path:'/orgmanage/org/approve/1'}">待我审批</router-link>
        </li>
        <li class="menuName" :class="{on:$route.params.id === '2'}">
          <router-link :to="{path:'/orgmanage/org/approve/2'}">未通过</router-link>
        </li>
        <li class="menuName" :class="{on:$route.params.id === '3'}">
          <router-link :to="{path:'/orgmanage/org/approve/3'}">所有待审批</router-link>
        </li>
        <li class="menuName" :class="{on:$route.params.id === '4'}">
          <router-link :to="{path:'/orgmanage/org/approve/4'}">所有未通过</router-link>
        </li>
      </ul>
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
                        <el-button type="text" size="small" @click="goUrl(['approveDetail',{id:scope.row.id}])">{{['','审批','查看详情','审批','查看详情'][$route.params.id]}}</el-button>
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
import CInput from '../../common/input/cInput.vue'
import UEditor from '../../common/ueditor/ueditor.vue'
import CPage from '../../common/page/cPage.vue'
import { mapGetters, mapActions } from 'vuex'
// import { uuid } from '../../../core/utils/tool'
// import _ from 'lodash'
// import { Loading } from 'element-ui'
import filters from '../../../core/filters'
import Modal from '../../common/modal/modal.vue'

export default {
  name: 'publishOrg',
  components: {
    CHeader,
    CInput,
    UEditor,
    CPage,
    Modal
  },
  data () {
    return {
      tableData: [],
      loading: true
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
    ...mapActions(['checkingOrg', 'goUrl']),
    loadData () {
      this.loading = true
      this.checkingOrg(this.$route.params.id).then((data) => {
        this.getPage.total = data.total
        this.tableData = data.list
        this.loading = false
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
  .menuNames {
    height: 100%;
    margin-left: 47px;
    float: left;
    .menuName {
      display: inline-block;
      color: #477CBE;
      height: 57px;
      line-height: 57px;
      border-bottom: 3px solid transparent;
      margin-right: 15px;
      cursor: pointer;
      &:last-child {
        margin-right: 0;
      }
      &.on {
        border-bottom: 3px solid #477CBE;
      }
      &:hover {
        border-bottom: 3px solid #477CBE;
      }
    }
  }
  .ch-right {
    float: right;
  }
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
        background-color: #9AA1AE;color: #ffffff;border: none;
    }
    .el-button:nth-child(2) {
        background-color: #9AA1AE;color: #ffffff;border: none;
    }
    .el-button:nth-child(3) {
        background-color: #FB9926;color: #ffffff;border: none;
        padding: 10px 30px;
    }
  }
  .line{ text-align: center;}
  .selectList{ height: 50px;line-height: 50px;border-bottom: 1px solid #e7e7e7;}
}
</style>
