<template>
  <div class="wrapper-content">
    <c-header class="wrapper-box-header" :menuNames="menuNames">
    </c-header>
    <div class="wrapper-box-content">
      <div class="wrapper-box-middle">
        <div class="publicOrgBox">
            <div class="publicOrgTitle">
                <el-form :inline="true" class="demo-form-inline">
                  <el-form-item label="文章类型:">
                    <my-select label="name" field="subType" :options="articleType.guide || {}" :change="changeType"/>
                  </el-form-item>
                  <el-form-item label="发布时间:">
                    <el-date-picker @change="change" v-model="recording" type="daterange" placeholder="选择日期时间"></el-date-picker>
                  </el-form-item>
                  <el-form-item class="searchInp">
                    <select-input :change="loadData" :options="{title:'标题',adminName:'文章发布者'}" def-key="title"></select-input>
                  </el-form-item>
                </el-form>
            </div>
            <el-table :data="tableData" border style="width: 100%" v-loading="loading">
              <el-table-column fixed type="index" width="80px" label="序号" align="center"></el-table-column>
              <el-table-column prop="title" :show-overflow-tooltip="true" label="标题" align="center"></el-table-column>
              <el-table-column prop="files" :show-overflow-tooltip="true"
                 :formatter="({subType})=>type2Filter(articleType.guide,subType)"
                 label="文章类型" align="center">
              </el-table-column>
              <el-table-column prop="files" :show-overflow-tooltip="true" :formatter="({files})=>filesFilter(files)" label="附件" align="center"/>
              <el-table-column prop="files" :formatter="({files})=>filesNumFilter(files)" label="附件下载次数" align="center"/>
              <el-table-column prop="num" label="浏览次数" align="center"/>
              <el-table-column prop="adminName" label="文章发布者" align="center"/>
              <el-table-column prop="created" width="180px" :formatter="({created}) => new Date(created).Format('yyyy-MM-dd hh:mm')" label="发布时间" align="center"/>
              <el-table-column fixed="right" label="操作" align="center" width="200px">
                  <template slot-scope="scope">
                      <el-button type="text" size="small" @click="goUrl(['guidedetail',{id:scope.row.id}])">查看/编辑</el-button>
                      <el-button type="text" size="small" @click="del(scope.row.id)" style="color:#F64D4D">删除</el-button>
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
import CHeader from '../../../common/header/cHeader.vue'
import CInput from '../../../common/input/cInput.vue'
import UEditor from '../../../common/ueditor/ueditor.vue'
import SelectInput from '../../../common/selectInput/MySelectInput.vue'
import MySelect from '../../../common/select/MySelect.vue'
import CPage from '../../../common/page/cPage.vue'
import { mapGetters, mapActions } from 'vuex'
// import { uuid } from '../../../core/utils/tool'
// import _ from 'lodash'
// import { Loading } from 'element-ui'
import filters from '../../../../core/filters/index'
import Modal from '../../../common/modal/modal.vue'
import { error, success, confirm } from '../../../../core/utils/actions'

export default {
  name: 'publishOrg',
  components: {
    CHeader,
    CInput,
    UEditor,
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
      recording: [],
      loading: true,
      articleType: {},
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
          name: '办事指南管理',
          route: '',
          on: true
        }
      ],
      tableData: []
    }
  },
  created () {
    this.articleType = JSON.parse(this.setting.articleType)
    this.loadData()
  },
  mounted () {
  },
  computed: {
    ...mapGetters(['getPage', 'setting'])
  },
  methods: {
    ...filters,
    ...mapActions(['findArticleApi', 'goUrl', 'deleteArticle', 'changeSelect', 'resetPage']),
    loadData () {
      this.loading = true
      this.findArticleApi([8, 0]).then((data) => {
        this.getPage.total = data.total
        this.tableData = data.list
        this.loading = false
      })
    },
    formatter (item) {
      return new Date(item.created).Format('yyyy-MM-dd hh:mm')
    },
    del (id) {
      confirm(`确定删除该办事指南吗?`, 'warning').then(() => {
        this.deleteArticle(id).then(() => {
          this.loadData()
          success('删除成功')
        }).catch(({code}) => {
          error('删除失败！')
        })
      })
    },
    // 查询时间
    change () {
      if (this.recording[0] && this.recording[1]) {
        this.getPage.start = this.recording[0].getTime()
        this.getPage.end = this.recording[1].getTime()
      } else {
        this.getPage.start = null
        this.getPage.end = null
      }
      this.loadData()
    },
    // changeType
    changeType (key, value) {
      this.changeSelect({key, value})
      this.loadData()
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
