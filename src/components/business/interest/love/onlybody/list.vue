<template>
  <div id="publishOrg" class="wrapper-content">
    <c-header class="wrapper-publishOrg-header" :menuNames="menuNames">
      <div slot="right">
        <div class="btnGroup">
            <el-button @click.native="$refs.pop1.open()">高级筛选</el-button>
            <el-button @click.native="$refs.pop2.open()">显示设置</el-button>
            <el-button>导出</el-button>
        </div>
      </div>
    </c-header>
    <modal ref="pop1" @ok="highSelect" title="高级筛选">
      <div class="public-form-box" style="padding: 20px;">
        <el-form ref="form" :model="form" label-width="80px" label-position="top" class="public-form">
          <el-form-item label="性别">
            <el-radio class="radio" v-model="radio" label="1">男</el-radio>
            <el-radio class="radio" v-model="radio" label="2">女</el-radio>
          </el-form-item>
          <el-form-item label="单身类型">
            <el-radio class="radio" v-model="radio" label="1">单身</el-radio>
            <el-radio class="radio" v-model="radio" label="2">离异</el-radio>
          </el-form-item>
          <el-form-item label="学历">
            <el-select v-model="form.unionType" placeholder="学历" style="width:100%;">
              <el-option label="全部" value=""></el-option>
              <el-option label="博士" :value="1"></el-option>
              <el-option label="研究生" :value="2"></el-option>
              <el-option label="本科" :value="3"></el-option>
              <el-option label="大专" :value="4"></el-option>
              <el-option label="高中" :value="5"></el-option>
              <el-option label="中专" :value="6"></el-option>
              <el-option label="初中" :value="7"></el-option>
              <el-option label="小学" :value="8"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="身高">
            <el-select v-model="form.unionType" placeholder="身高" style="width:100%;">
              <el-option label="全部" value=""></el-option>
              <el-option label="博士" :value="1"></el-option>
              <el-option label="研究生" :value="2"></el-option>
              <el-option label="本科" :value="3"></el-option>
              <el-option label="大专" :value="4"></el-option>
              <el-option label="高中" :value="5"></el-option>
              <el-option label="中专" :value="6"></el-option>
              <el-option label="初中" :value="7"></el-option>
              <el-option label="小学" :value="8"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="收入">
            <el-col :span="11">
              <el-input v-model.number="form.workersStart"></el-input>
            </el-col>
            <el-col class="line" :span="2">至</el-col>
            <el-col :span="11">
              <el-input v-model.number="form.workersEnd"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="购房情况">
            <el-radio class="radio" v-model="radio" label="1">已购房</el-radio>
            <el-radio class="radio" v-model="radio" label="2">未购房</el-radio>
          </el-form-item>
          <el-form-item label="购车情况">
            <el-radio class="radio" v-model="radio" label="1">已购车</el-radio>
            <el-radio class="radio" v-model="radio" label="2">未购车</el-radio>
          </el-form-item>
          <el-form-item label="当前牵手情况">
            <el-radio class="radio" v-model="radio" label="1">牵手成功</el-radio>
            <el-radio class="radio" v-model="radio" label="2">未成功</el-radio>
          </el-form-item>

        </el-form>
      </div>

    </modal>
    <modal ref="pop2" title="显示设置" @ok="ok" :btn="['保存','取消']">
      <div class="selectListBox pd20">
        <el-checkbox-group @change="handleCheckedFiledChange" v-model="checkedFiled" :min="1" style="width: 100%">
          <div class="selectList" v-for="item in filed" :key="item">
              <el-checkbox :label="item">{{item}}</el-checkbox>
          </div>
        </el-checkbox-group>
        <div class="selectList">
          <el-checkbox :indeterminate="indeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
        </div>
      </div>
    </modal>
    <div class="wrapper-publishOrg-content">
      <div class="wrapper-publishOrg-middle">
        <div class="publishOrgBox">
            <div class="publishOrgTitle">
                <el-form :inline="true"  class="demo-form-inline">
                    <el-form-item label="性别:">
                      <el-select style="width: 150px;" @change="change('unionType',form.unionType)" v-model="form.unionType" placeholder="请选择性别">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="男" :value="1"></el-option>
                        <el-option label="女" :value="2"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="学历">
                      <el-select style="width: 150px;" @change="change('mold',form.mold)" v-model="form.mold" placeholder="请选择学历">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="博士" :value="1"></el-option>
                        <el-option label="研究生" :value="2"></el-option>
                        <el-option label="本科" :value="3"></el-option>
                        <el-option label="大专" :value="4"></el-option>
                        <el-option label="高中" :value="5"></el-option>
                        <el-option label="中专" :value="6"></el-option>
                        <el-option label="初中" :value="7"></el-option>
                        <el-option label="小学" :value="8"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="身高">
                      <el-select style="width: 150px;" @change="change('mold',form.mold)" v-model="form.mold" placeholder="请选择身高">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="博士" :value="1"></el-option>
                        <el-option label="研究生" :value="2"></el-option>
                        <el-option label="本科" :value="3"></el-option>
                        <el-option label="大专" :value="4"></el-option>
                        <el-option label="高中" :value="5"></el-option>
                        <el-option label="中专" :value="6"></el-option>
                        <el-option label="初中" :value="7"></el-option>
                        <el-option label="小学" :value="8"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="收入">
                      <el-select style="width: 150px;" @change="change('mold',form.mold)" v-model="form.mold" placeholder="请选择收入">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="博士" :value="1"></el-option>
                        <el-option label="研究生" :value="2"></el-option>
                        <el-option label="本科" :value="3"></el-option>
                        <el-option label="大专" :value="4"></el-option>
                        <el-option label="高中" :value="5"></el-option>
                        <el-option label="中专" :value="6"></el-option>
                        <el-option label="初中" :value="7"></el-option>
                        <el-option label="小学" :value="8"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item class="searchInp">
                      <select-input :change="loadData" :options="{name:'单位',parentName:'上级工会',chaiName: '工会主席'}" def-key="name"></select-input>
                    </el-form-item>
                </el-form>
            </div>

            <el-table height="420" :data="tableData" border style="width: 100%" v-loading="loading">
                <el-table-column fixed prop="id" label="序号" align="center">
                </el-table-column>
                <el-table-column prop="name" label="姓名" :show-overflow-tooltip="true" align="center">
                </el-table-column>
                <el-table-column prop="mold" v-if="inFiled('性别')" label="性别" :show-overflow-tooltip="true" align="center">
                </el-table-column>
                <el-table-column prop="organizCode" v-if="inFiled('昵称')" label="昵称" :show-overflow-tooltip="true" align="center">
                </el-table-column>
                <el-table-column prop="industry" v-if="inFiled('所属企业')" label="所属企业" :show-overflow-tooltip="true" align="center">
                </el-table-column>
                <el-table-column prop="address" v-if="inFiled('联系电话')" label="联系电话" :show-overflow-tooltip="true" align="center">
                </el-table-column>
                <el-table-column prop="workers" v-if="inFiled('出生日期')" label="出生日期" :show-overflow-tooltip="true" align="center">
                </el-table-column>
                <el-table-column prop="feWorkers" v-if="inFiled('单身类型')" label="单身类型" :show-overflow-tooltip="true" align="center">
                </el-table-column>
                <el-table-column prop="parentName" v-if="inFiled('学历')" label="学历" :show-overflow-tooltip="true" align="center">
                </el-table-column>
                <el-table-column prop="chaiName" v-if="inFiled('户籍')" label="户籍" align="center">
                </el-table-column>
                <el-table-column prop="terms" v-if="inFiled('身高')" label="身高" :show-overflow-tooltip="true" align="center">
                </el-table-column>
                <el-table-column prop="generalTime" v-if="inFiled('收入')" label="收入" :show-overflow-tooltip="true" align="center">
                </el-table-column>
                <el-table-column prop="generalTime" v-if="inFiled('购房情况')" label="购房情况" :show-overflow-tooltip="true" align="center">
                </el-table-column>
                <el-table-column prop="generalTime" v-if="inFiled('购车情况')" label="购车情况" :show-overflow-tooltip="true" align="center">
                </el-table-column>
                <el-table-column fixed="right" label="操作" align="center" width="100">
                  <template slot-scope="scope">
                    <el-button type="text" size="small" @click="detail()">查看</el-button>
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
import CHeader from '../../../../common/header/cHeader.vue'
import CInput from '../../../../common/input/cInput.vue'
import SelectInput from '../../../../common/selectInput/MySelectInput.vue'
import MySelect from '../../../../common/select/MySelect.vue'
import UEditor from '../../../../common/ueditor/ueditor.vue'
import CPage from '../../../../common/page/cPage.vue'
import { molds, industrys, leve } from '../../../../../core/const/index'
import { confirm, success, error } from '../../../../../core/utils/actions'
import { mapGetters, mapActions } from 'vuex'
import filters from '../../../../../core/filters'
import Modal from '../../../../common/modal/modal.vue'
import { updateShow } from '../../../../../core/api/orgmanage/org/index'

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
      molds,
      industrys,
      leve,
      checkAll: false,
      indeterminate: true,
      checkedFiled: [
        '性别',
        '昵称',
        '所属企业',
        '联系电话'
      ],
      filed: [
        '性别',
        '昵称',
        '所属企业',
        '联系电话',
        '出生日期',
        '单身类型',
        '学历',
        '户籍',
        '身高',
        '收入',
        '购房情况',
        '购车情况'
      ],
      form: {
        mold: '',
        unionType: '',
        industry: '',
        register: '',
        registerStart: '',
        registerEnd: '',
        workersStart: '',
        workersEnd: '',
        feWorkersStart: '',
        feWorkersEnd: '',
        generalTime: '',
        termExpireStart: '',
        termExpireEnd: '',
        leve: '',
        branch: '',
        childsStart: '',
        childsEnd: '',
        groupsStart: '',
        groupsEnd: ''
      },
      menuNames: [
        {
          name: '单身信息管理',
          route: '',
          on: true
        }
      ],
      tableData: [],
      formInline: {
        mold: '',
        unionType: 1
      },
      loading: false
    }
  },
  created () {
    this.getAdmin().then((data) => {
      if (data.showSetting) {
        this.checkedFiled = JSON.parse(data.showSetting).org.split(',')
      }
    }).catch((data) => {
//      location.reload()
    })
    this.loadData()
  },
  mounted () {
  },
  computed: {
    ...mapGetters(['getPage', 'getAccount'])
  },
  methods: {
    ...filters,
    ...mapActions(['loadDepListApi', 'goUrl', 'changeSelect', 'resetPage', 'delDepApi', 'getAdmin']),
    loadData () {
      this.loading = true
      this.loadDepListApi().then((data) => {
        this.getPage.total = data.total
        this.tableData = data.list
        this.loading = false
      })
    },
    change (key, value) {
      let i = parseInt(value)
//      this.form[key] = isNaN(i) ? value : parseInt(value)
      this.getPage.keyParam[key] = isNaN(i) ? value : parseInt(value)
      this.loadData()
    },
    changeField (key, value) {
    },
    del ({id}) {
      confirm(`确定删除该工会吗?`, 'warning').then(() => {
        this.delDepApi(id).then(() => {
          this.loadData()
          success('删除成功')
        }).catch(({code}) => {
          code === 60006 ? error('该机构下包含子机构或成员，无法删除！') : error('删除失败！')
        })
      })
    },
    // 显示设置
    handleCheckAllChange (event) {
      this.checkedFiled = event.target.checked ? this.filed : []
      this.indeterminate = false
      this.loadData()
    },
    handleCheckedFiledChange (value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.filed.length
      this.indeterminate = checkedCount > 0 && checkedCount < this.filed.length
      this.loadData()
    },
    ok () {
      updateShow({org: this.checkedFiled.join(',')}, 'org').then((data) => {
      })
    },
    inFiled (val) {
      return this.checkedFiled.indexOf(val) > -1 ? 1 : false
    },
    // 高级筛选确定
    highSelect () {
      if (this.form.register.length) {
        this.form.registerStart = new Date(this.form.register[0]).getTime()
        this.form.registerEnd = new Date(this.form.register[1]).getTime()
      }
      this.getPage.keyParam = {...this.getPage.keyParam, ...this.form}
      this.loadData()
    },
    detail (id) {
      this.$router.push(`onlybody/detail/${id}`)
    }
  },
  destroyed () {
    this.resetPage()
  }
}
</script>

<style lang="less">
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
