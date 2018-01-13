<template>
  <div id="createOrg" class="wrapper-content">
    <c-header class="wrapper-createOrg-header" :menuNames="menuNames">
      <div slot="right" class="goback">
        <img src="/static/icon/goback.png" alt="返回" @click="goBack">
      </div>
    </c-header>
    <div class="wrapper-createOrg-content">
      <div class="wrapper-createOrg-middle">
        <div class="public-form-box">
          <div class="public-form-content">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position="top" class="public-form">
              <div class="public-form-title">
                <span>企业信息</span>
              </div>
              <el-row :gutter="60">
                <el-col :span="12">
                  <el-form-item label="单位名称" prop="name">
                    <el-input v-model="ruleForm.name"></el-input>
                  </el-form-item>
                  <el-form-item label="统一社会信用代码/组织机构代码" prop="code">
                    <el-input v-model="ruleForm.organizCode"></el-input>
                  </el-form-item>
                  <el-form-item label="单位类型" prop="mold" style="width:100%">
                    <el-select v-model="ruleForm.mold" placeholder="请选择单位类型..." style="width:100%">
                      <el-option :label="item" :value="item" :key="item" v-for="item in molds"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="所属行业" prop="industry">
                    <el-select v-model="ruleForm.industry" placeholder="请选择所属行业..." style="width:100%">
                      <el-option :label="item" :value="item" :key="item" v-for="item in industrys"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="所在地区" prop="region" style="width:100%">
                    <el-cascader style="width:100%" expand-trigger="hover" :options="options" v-model="ruleForm.region" @change="handleChange"></el-cascader>
                  </el-form-item>
                  <el-form-item label="详细地址" prop="address">
                    <el-input v-model="ruleForm.address"></el-input>
                  </el-form-item>
                  <el-form-item label="职工总数" prop="workers">
                    <el-input v-model.number="ruleForm.workers" placeholder="请输入单位员工总数..."></el-input>
                  </el-form-item>
                  <el-form-item label="女职工总数" prop="feWorkers">
                    <el-input v-model.number="ruleForm.feWorkers" placeholder="请输入单位女员工总数..."></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <div class="public-form-title">
                <span>工会信息</span>
              </div>
              <el-row :gutter="60">
                <el-col :span="12">
                  <el-form-item label="上级工会">
                    <el-select v-model="ruleForm.parentid"  placeholder="请选择上级工会..."  style="width: 100%">
                      <el-option v-for="item in items" :label="item.name" :key="item.id" :value="item.id*1"/>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="工会主席" prop="chaiName">
                    <el-input placeholder="请输入工会主席名字" v-model="ruleForm.chaiName"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="工会类型" prop="unionType">
                    <el-select v-model="ruleForm.unionType" placeholder="请选择工会类型" style="width:100%">
                      <el-option label="基层以上工会" value="1"></el-option>
                      <el-option label="基层工会" value="2"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="成立时间" prop="register">
                    <el-date-picker type="datetime" format="yyyy-MM-dd HH:mm" v-model="ruleForm.register" placeholder="选择成立时间..." style="width:100%"></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="当前届数" prop="terms">
                    <el-input placeholder="请输入当前届数" v-model="ruleForm.terms">
                      <template slot="append">届</template>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="换届年限">
                    <el-select v-model="ruleForm.generalTime" placeholder="请选择换届年限" style="width:100%;">
                      <el-option label="三年一换" value="三年一换"></el-option>
                      <el-option label="五年一换" value="五年一换"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="本届任期" prop="term">
                    <el-date-picker type="daterange" format="yyyy-MM-dd" v-model="ruleForm.term" style="width:100%"></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="职工之家等级">
                    <el-select v-model="ruleForm.leve" placeholder="请选择职工之家等级" style="width:100%;">
                      <el-option :label="item" :value="item" :key="item" v-for="item in leve"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="是否建立党支部" prop="branch">
                    <el-select v-model="ruleForm.branch" placeholder="请选择是否建立党支部" style="width:100%">
                      <el-option label="是" :value="1"></el-option>
                      <el-option label="否" :value="0"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="分工会数" prop="childs">
                    <el-input placeholder="请输入分工会数" v-model="ruleForm.childs"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="工会小组数" prop="groups">
                    <el-input placeholder="请输入工会小组数" v-model="ruleForm.groups"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <div class="public-form-title" v-if="$route.params.id">
                <span>审批信息</span>
              </div>
              <el-row :gutter="60" v-if="$route.params.id">
                <el-col :span="24">
                  <el-form-item>
                    <el-button size="small" icon="check" style="color:#477CBE;border-color:#477CBE">通过</el-button>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="审批意见">
                    <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 6}" placeholder="请输入内容" disabled>
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>


              <div class="posb">
                <!-- <el-button class="clear" @click="resetForm('ruleForm')">清除</el-button> -->
                <el-button class="submit" @click="submitForm('ruleForm')">提交</el-button>
              </div>
            </el-form>
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
import { mapGetters, mapActions } from 'vuex'
import { molds, industrys, leve } from '../../../core/const/index'
// import { uuid } from '../../../core/utils/tool'
// import _ from 'lodash'
// import { Loading } from 'element-ui'
import filters from '../../../core/filters'
import {findUpDepListApi} from '../../../core/api/orgmanage/org/index'
import DISTRICTS from '../../../core/const/city'
import { error, success } from '../../../core/utils/actions'

const DEFAULT_CODE = 100000

export default {
  name: 'createOrg',
  components: {
    CHeader,
    CInput,
    UEditor
  },
  beforeRouteEnter (to, from, next) {
    next()
  },
  data () {
    return {
      leve,
      molds,
      industrys,
      options: [],
      opts: [],
      items: [],
      menuNames: [
        {
          name: '档案详情',
          route: '',
          on: true
        }
      ],
      ruleForm: {},
      rules: {
//        name: [
//          { required: true, message: '请输入单位名称', trigger: 'blur' },
//          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
//        ],
//        code: [
//          { required: true, message: '请输入统一社会信用代码/组织机构代码', trigger: 'blur' },
//          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
//        ],
//        region: [
//          { type: 'array', required: true, message: '请选择活动区域', trigger: 'change' }
//        ],
//        workers: [
//          { required: true, message: '请输入职工总数' },
//          // {min: 1, max: 5, message: '长度在 1 到 5 个字符'},
//          { type: 'number', message: '职工总数必须为数字值' }
//        ],
//        feWorkers: [
//          { required: true, message: '请输入女职工总数' },
//          // {min: 1, max: 5, message: '长度在 1 到 5 个字符'},
//          { type: 'number', message: '女职工总数必须为数字值' }
//        ],
//        applyName: [
//          { required: true, message: '请输入申请人姓名', trigger: 'blur' },
//          { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
//        ],
//        applyPhone: [
//          { required: true, message: '请填写正确的手机号码', trigger: 'blur', pattern: /^1(3|4|5|7|8)\d{9}$/ }
//        ],
//        date1: [
//          { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
//        ],
//        date2: [
//          { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
//        ],
//        type: [
//          { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
//        ],
//        resource: [
//          { required: true, message: '请选择活动资源', trigger: 'change' }
//        ],
//        desc: [
//          { required: true, message: '请填写活动形式', trigger: 'blur' }
//        ]
      }
    }
  },
  created () {
    this.getDep()
    // **********获得省市区级联动
    this.provinces = this.getDistricts()
    for (var code in this.provinces) {
      this.options.push({
        code: code,
        value: this.provinces[code],
        label: this.provinces[code],
        children: []
      })
    }
    this.options.map((item, index) => {
      for (var y in this.getDistricts(item.code)) {
        item.children.push({
          code: y,
          value: this.getDistricts(item.code)[y],
          label: this.getDistricts(item.code)[y],
          children: []
        })
      }
    })
    this.options.map((item, index) => {
      item.children.map((child) => {
        for (var z in this.getDistricts(child.code)) {
          child.children.push({
            code: z,
            value: this.getDistricts(child.code)[z],
            label: this.getDistricts(child.code)[z]
          })
        }
      })
    })
    // **********获得省市区级联动结束
  },
  mounted () {
    findUpDepListApi()
    .then((data) => {
      this.items = data
    })
  },
  computed: {
    ...mapGetters(['getPage', 'getAccount'])
  },
  methods: {
    ...filters,
    ...mapActions(['updateOrg', 'getDepApi', 'goBack', 'goUrl']),
    handleClose () {
    },
    // 获取信息
    getDep () {
      if (this.$route.path.indexOf('create') > -1) {
        return
      }
      if (this.$route.params.id) {
        this.getDepApi(this.$route.params.id).then((data) => {
          this.ruleForm = data
          this.ruleForm.region = data.region ? JSON.parse(data.region) : []
          this.ruleForm.term = [new Date(data.termStart), new Date(data.termEnd)]
        })
      } else {
        this.getDepApi(this.getAccount.department[0]).then((data) => {
          this.ruleForm = data
          this.ruleForm.region = data.region ? JSON.parse(data.region) : []
          this.ruleForm.term = [new Date(data.termStart), new Date(data.termEnd)]
        })
      }
    },
    // 级联选择
    handleChange (value) {
    },
    getDistricts (code = DEFAULT_CODE) {
      return DISTRICTS[code] || null
    },
    // 提交表单
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.updateOrg({...this.ruleForm,
            auditUnit: this.ruleForm.parentid,
            type: 1,
            term: '',
            termStart: new Date(this.ruleForm.term[0]).getTime(),
            termEnd: new Date(this.ruleForm.term[1]).getTime()
          }).then((data) => {
            success('修改成功').then(() => {
              this.goUrl(['docOrg'])
            })
          }).catch((data) => {
            error('提交失败')
          })
        } else {
//          error('请填写必须字段!')
          return false
        }
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

#createOrg {
  width: 100%;
  height: 100%;

  font-size: 16px;
  box-sizing: border-box;
  .wrapper-createOrg-header {
    .toolbar {
      height: 60px;
    }
  }
  .wrapper-createOrg-content {
    padding: 20px;
    box-sizing: border-box;
    height: calc(~"100% - 60px");
    .wrapper-createOrg-middle {
      width: 100%;
      height: @content-height;
      background-color: #ffffff;
      .left,
      .right {
        height: 100%;
        float: left;
        background-color: #ffffff;
        width: 50%;
        padding: 20px;
        box-sizing: border-box;
      }
    }
  } // 对 tree 的修正
  .contact-item,
  .contact-avatar,
  .contact-name-job {
    display: inline-block;
  }
  .dept {
    color: #9AA1AE;
    font-size: 14px;
  }
  .contact-item {
    flex: 1;
    padding: 12px 0;
    line-height: 32px;
    .contact-avatar,
    .contact-name,
    .contact-job {
      float: left;
    }
    .contact-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      margin-right: 11px;
      margin-left: 6px;
    }
    .contact-name {
      color: #4D4D4D;
      font-size: 14px;
    }
    .contact-job {
      float: right;
      color: #9AA1AE;
      font-size: 14px;
    }
  }

  .depModal{
    .el-button{
      width:230px;
      height:40px;
      background:rgba(71,124,190,1);
      border-radius: 4px ;
      color: #ffffff;border: none;
    }
    .depList{ height: 420px;overflow-y: scroll;padding: 0 20px;}
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
