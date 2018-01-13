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
          <el-form-item label="单位类型">
            <el-select v-model="form.mold" placeholder="单位类型" style="width:100%;">
              <el-option :label="item" :value="item" :key="item" v-for="item in molds"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="工会类型">
            <el-select v-model="form.unionType" placeholder="工会类型" style="width:100%;">
              <el-option label="全部" value=""></el-option>
              <el-option label="基层以上工会" :value="1"></el-option>
              <el-option label="基层工会" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属行业">
            <el-select v-model="form.industry" placeholder="请选择所属行业..." style="width:100%">
              <el-option label="全部" value=""></el-option>
              <el-option :label="item" :value="item" :key="item" v-for="item in industrys"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="成立时间" prop="register">
            <el-date-picker v-model="form.register" type="daterange" placeholder="选择成立时间..." style="width:100%"></el-date-picker>
          </el-form-item>
          <el-form-item label="职工总数">
            <el-col :span="11">
              <el-input v-model.number="form.workersStart"></el-input>
            </el-col>
            <el-col class="line" :span="2">至</el-col>
            <el-col :span="11">
              <el-input v-model.number="form.workersEnd"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="女职工总数">
            <el-col :span="11">
              <el-input v-model.number="form.feWorkersStart"></el-input>
            </el-col>
            <el-col class="line" :span="2">至</el-col>
            <el-col :span="11">
              <el-input v-model.number="form.feWorkersEnd"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="换届年限">
            <el-select v-model="form.generalTime" placeholder="请选择换届年限" style="width:100%;">
              <el-option label="三年一换" value="三年一换"></el-option>
              <el-option label="五年一换" value="五年一换"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="距离到期">
            <el-col :span="11">
              <el-input v-model.number="form.termExpireStart"></el-input>
            </el-col>
            <el-col class="line" :span="2">至</el-col>
            <el-col :span="11">
              <el-input v-model.number="form.termExpireEnd"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="职工之家等级">
            <el-select v-model="form.leve" placeholder="请选择职工之家等级" style="width:100%;">
              <el-option :label="item" :value="item" :key="item" v-for="item in leve"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否设立党支部">
            <el-select v-model="form.branch" placeholder="请选择是否设立党支部" style="width:100%;">
              <el-option label="是" :value="1"></el-option>
              <el-option label="否" :value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="分工会数">
            <el-col :span="11">
              <el-input v-model.number="form.childsStart"></el-input>
            </el-col>
            <el-col class="line" :span="2">至</el-col>
            <el-col :span="11">
              <el-input v-model.number="form.childsEnd"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="工会小组数">
            <el-col :span="11">
              <el-input v-model.number="form.groupsStart"></el-input>
            </el-col>
            <el-col class="line" :span="2">至</el-col>
            <el-col :span="11">
              <el-input v-model.number="form.groupsEnd"></el-input>
            </el-col>
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
                    <el-form-item label="工会类型:">
                      <el-select style="width: 150px;" @change="change('unionType',form.unionType)" v-model="form.unionType" placeholder="请选择工会类型">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="基层以上工会" :value="1"></el-option>
                        <el-option label="基层工会" :value="2"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="单位类型">
                      <el-select style="width: 150px;" @change="change('mold',form.mold)" v-model="form.mold" placeholder="请选择单位类型">
                        <el-option :label="item" :value="item" :key="item" v-for="item in molds"></el-option>
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
                <el-table-column prop="name" label="单位" :show-overflow-tooltip="true" align="center">
                </el-table-column>
                <el-table-column prop="mold" v-if="inFiled('单位类型')" label="单位类型" :show-overflow-tooltip="true" align="center">
                </el-table-column>
                <el-table-column prop="organizCode" v-if="inFiled('统一社会信用代码')" label="统一社会信用代码" :show-overflow-tooltip="true" align="center">
                </el-table-column>
                <el-table-column prop="industry" v-if="inFiled('所属行业')" label="所属行业" :show-overflow-tooltip="true" align="center">
                </el-table-column>
                <el-table-column prop="region" :formatter="({region}) => region?JSON.parse(region).join('--'):''" v-if="inFiled('所在地区')" label="所在地区" :show-overflow-tooltip="true" align="center">
                </el-table-column>
                <el-table-column prop="address" v-if="inFiled('详细地址')" label="详细地址" :show-overflow-tooltip="true" align="center">
                </el-table-column>
                <el-table-column prop="workers" v-if="inFiled('职工总数')" label="职工总数" :show-overflow-tooltip="true" align="center">
                </el-table-column>
                <el-table-column prop="feWorkers" v-if="inFiled('女职工数')" label="女职工数" :show-overflow-tooltip="true" align="center">
                </el-table-column>
                <el-table-column prop="parentName" v-if="inFiled('上级工会')" label="上级工会" :show-overflow-tooltip="true" align="center">
                </el-table-column>
                <el-table-column prop="unionType" :formatter="({unionType}) => ['未知','基层以上工会', '基层工会'][unionType]" v-if="inFiled('工会类型')" label="工会类型" :show-overflow-tooltip="true" align="center">
                </el-table-column>
                <el-table-column prop="chaiName" v-if="inFiled('工会主席')" label="工会主席" align="center">
                </el-table-column>
                <el-table-column prop="register" :formatter="(item) => new Date(item.register).Format('yyyy-MM-dd hh:mm')" v-if="inFiled('成立时间')" label="成立时间" :show-overflow-tooltip="true" align="center">
                </el-table-column>
                <el-table-column prop="terms" v-if="inFiled('当前届数')" label="当前届数" :show-overflow-tooltip="true" align="center">
                </el-table-column>
                <el-table-column prop="generalTime" v-if="inFiled('换届年限')" label="换届年限" :show-overflow-tooltip="true" align="center">
                </el-table-column>
                <el-table-column prop="term" :formatter="({termStart,termEnd}) =>termStart ? new Date(termStart).Format('yyyy-MM-dd hh:mm')+'--'+new Date(termEnd).Format('yyyy-MM-dd hh:mm'): '' "
                                 v-if="inFiled('本届任期')" label="本届任期" :show-overflow-tooltip="true" align="center">
                </el-table-column>
                <el-table-column prop="leve" v-if="inFiled('职工之家等级')" label="职工之家等级" :show-overflow-tooltip="true" align="center">
                </el-table-column>
                <el-table-column prop="branch" :formatter="({branch}) => ['','是','否'][branch]" v-if="inFiled('是否设立党支部')" label="是否设立党支部" :show-overflow-tooltip="true" align="center">
                </el-table-column>
                <el-table-column prop="childs" v-if="inFiled('分工会数')" label="分工会数" :show-overflow-tooltip="true" align="center">
                </el-table-column>
                <el-table-column prop="groups" v-if="inFiled('工会小组数')" label="工会小组数" :show-overflow-tooltip="true" align="center">
                </el-table-column>
                <el-table-column prop="applyName" v-if="inFiled('申请人姓名')" label="申请人姓名" :show-overflow-tooltip="true" align="center">
                </el-table-column>
                <el-table-column prop="applyPhone" v-if="inFiled('申请人手机')" label="申请人手机" :show-overflow-tooltip="true" align="center">
                </el-table-column>
                <el-table-column prop="phone" v-if="inFiled('电话')" label="电话" align="center">
                </el-table-column>
                <!--<el-table-column v-for="(item,index) in checkedFiled" :key="index"-->
                <!--:prop="props(item)"-->
                <!--:label="item" :show-overflow-tooltip="true" align="center">-->
                <!--</el-table-column>-->
                <el-table-column fixed="right" label="操作" align="center" width="100">
                  <template slot-scope="scope">
                    <el-button type="text" size="small" @click="goUrl(['detailOrg',{id:scope.row.id}])">编辑</el-button>
                    <el-button type="text" size="small" @click="del(scope.row)">删除</el-button>
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
import SelectInput from '../../common/selectInput/MySelectInput.vue'
import MySelect from '../../common/select/MySelect.vue'
import UEditor from '../../common/ueditor/ueditor.vue'
import CPage from '../../common/page/cPage.vue'
import { molds, industrys, leve } from '../../../core/const/index'
import { confirm, success, error } from '../../../core/utils/actions'
import { mapGetters, mapActions } from 'vuex'
// import { uuid } from '../../../core/utils/tool'
// import _ from 'lodash'
// import { Loading } from 'element-ui'
import filters from '../../../core/filters'
import Modal from '../../common/modal/modal.vue'
import { updateShow } from '../../../core/api/orgmanage/org/index'

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
      checkedFiled: ['单位类型', '统一社会信用代码', '所属行业', '所在地区', '详细地址', '职工总数', '女职工数'],
      filed: ['单位类型', '统一社会信用代码', '所属行业', '所在地区',
        '详细地址', '职工总数', '女职工数', '上级工会', '工会主席', '工会类型', '成立时间', '当前届数', '换届年限',
        '本届任期', '职工之家等级', '是否设立党支部', '分工会数', '工会小组数', '申请人姓名', '申请人手机'],
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
          name: '组织档案',
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
