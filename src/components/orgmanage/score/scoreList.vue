<template>
  <div class="wrapper-content">
    <c-header class="wrapper-box-header" :menuNames="menuNames">
    </c-header>
    <div class="wrapper-box-content">
      <div class="wrapper-box-middle">
        <div class="publicOrgBox">
            <div class="publicOrgTitle">
                <el-form :inline="true" :model="formInline" class="demo-form-inline">
                    <el-form-item label="组织关系：">
                        <el-select v-model="formInline.region" placeholder="组织关系" style="width:140px;">
                            <el-option label="全部" value="shanghai"></el-option>
                            <el-option label="关系1" value="beijing"></el-option>
                            <el-option label="关系2" value="aaaa"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="searchInp">
                        <el-select v-model="formInline.select" placeholder="请选择" style="width:110px;">
                            <el-option label="工会名称" value="1"></el-option>
                            <el-option label="职工姓名" value="2"></el-option>
                        </el-select><el-input placeholder="请输入搜索内容" icon="search" style="width:auto;"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <el-table :data="tableData" border style="width: 100%" v-loading="loading" element-loading-text="拼命加载中">
                <el-table-column fixed type="index" width="80px" label="序号" align="center">
                </el-table-column>
                <el-table-column prop="name" label="姓名" align="center">
                </el-table-column>
                <el-table-column prop="nickname" label="昵称" align="center">
                </el-table-column>
                <el-table-column prop="depName" :show-overflow-tooltip="true" label="所属单位" align="center">
                </el-table-column>
                <el-table-column prop="score" label="拥有积分" align="center">
                </el-table-column>
                <el-table-column fixed="right" label="操作" align="center" width="200px">
                    <template slot-scope="scope">
                        <el-button v-if="getAccount.department[0]===1" type="text" size="small" @click="scoreDeal('增加积分',scope.row.id,scope.row.score,0)">增加</el-button>
                        <el-button v-if="getAccount.department[0]===1" type="text" size="small" @click="scoreDeal('减少积分',scope.row.id,scope.row.score,1)">减少</el-button>
                        <el-button type="text" size="small" @click="goUrl(['userDetail',{id:scope.row.id,type:1}])">查看积分明细</el-button>
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
  beforeRouteEnter (to, from, next) {
    next()
  },
  data () {
    return {
      visible2: false,
      loading: true,
      checkedCities1: ['单位名称', '单位类型'],
      cities: ['单位名称', '单位类型', '所属行业', '成立时间', '职工总数', '女职工数'],
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      menuNames: [
        {
          name: '职工积分列表',
          route: '',
          on: true
        }
      ],
      tableData: [],
      formInline: {
        user: '',
        region: '',
        select: '1'
      }
    }
  },
  created () {
    this.loadData()
  },
  mounted () {
  },
  computed: {
    ...mapGetters(['getPage', 'getAccount'])
  },
  methods: {
    ...filters,
    ...mapActions(['loadUserListApi', 'goUrl', 'updateScoreApi', 'resetPage']),
    loadData () {
      this.loading = true
      this.loadUserListApi().then((data) => {
        this.getPage.total = data.total
        this.tableData = data.list
        this.loading = false
      })
    },
    scoreDeal (title = '增加积分', id, score, scoreType) {
      this.$prompt('请输入积分', title, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^\d+$/,
        inputErrorMessage: '请输入数字'
      }).then(({ value }) => {
        this.updateScoreApi({id: id, scoreType: scoreType, score: parseInt(value) > parseInt(score) ? scoreType === 1 ? parseInt(score) : parseInt(value) : parseInt(value)}).then(async () => {
          await this.loadData()
          this.$message({
            type: 'success',
            message: `你${scoreType === 0 ? '增加' : '减少'}了积分:  ${value}`
          })
        })
      })
    }
  },
  destroyed () {
    this.resetPage()
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



.wrapper-content{
  width: 100%;
  height: 100%;

  font-size: 16px;
  box-sizing: border-box;
  .wrapper-header {
    .toolbar {
      height: 60px;
    }
  }
  .wrapper-box-content {
    padding: 20px;
    box-sizing: border-box;
    height: calc(~"100% - 60px");
    .wrapper-box-middle {
      width: 100%;border-radius: 4px;
      height: @content-height;
      background-color: #ffffff;
    }
  }

  .publicOrgBox{ padding: 20px;}
  .publicOrgTitle .el-input__inner{ background-color: #FAFAFA;
    border-color: #EFF2FA;
  }
  .publicOrgTitle {
    .searchInp{
        float:right;font-size:0;
        .el-input__inner{
            border-radius: 0;
        }
    }
  }
  .depModal{
    .el-dialog__header{ text-align: center;padding: 0 20px;height: 60px;line-height: 60px;
      font-size: 18px;background-color: #F7F8FA;
    }
    .el-dialog__body{ padding: 20px 10px;}
    .el-dialog__headerbtn{ margin-top: 20px;}
    .el-dialog__footer{ background-color: #F7F8FA;height: 80px;
        padding: 20px 20px;text-align: center;}
    .selectDep{ height: 50px;line-height: 50px;border-bottom: 1px solid #e7e7e7;}
  }
}
</style>
