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
                  <el-form-item label="统一社会信用代码/组织机构代码" prop="organizCode">
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
                    <!-- <v-distpicker :province="ruleForm.region.province" :city="ruleForm.region.city" :area="ruleForm.region.area"></v-distpicker> -->
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
                <span>申请人信息</span>
              </div>
              <el-row :gutter="60">
                <el-col :span="12">
                  <el-form-item label="申请人姓名" prop="applyName">
                    <el-input :class="{'haveVal':!!(ruleForm.applyName.trim())}" v-model="ruleForm.applyName" placeholder="请输入申请人姓名..."></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="联系电话" prop="applyPhone">
                    <el-input v-model="ruleForm.applyPhone" placeholder="请输入申请人联系电话..."></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <div class="public-form-title">
                <span>组织关系</span>
              </div>
              <el-row :gutter="60">
                <el-col :span="12">
                  <el-form-item label="工会类型" prop="unionType" style="width: 100%">
                    <el-select v-model="ruleForm.unionType" style="width: 100%">
                      <el-option label="基层以上工会" value="1"/>
                      <el-option label="基层工会" value="2"/>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="上级工会" prop="parentid" required>
                    <el-select v-model="ruleForm.parentid"  placeholder="请选择上级工会..."  style="width: 100%">
                      <el-option v-for="item in items" :label="item.name" :key="item.id" :value="item.id*1"/>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <div class="posb">
                <el-button class="clear" @click="resetForm('ruleForm')">清除</el-button>
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
import { molds, industrys } from '../../../core/const/index'
// import { uuid } from '../../../core/utils/tool'
// import _ from 'lodash'
// import { Loading } from 'element-ui'
import filters from '../../../core/filters'
import DISTRICTS from '../../../core/const/city'
import { findUpDepListApi } from '../../../core/api/orgmanage/org/index'
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
      molds,
      industrys,
      options: [],
      selectedOptions2: [],
      items: [],
      menuNames: [
        {
          name: '新建公会',
          route: '',
          on: true
        }
      ],
      ruleForm: {
        name: '',
        organizCode: '',
        mold: '',
        industry: '',
        region: [],
        address: '',
        workers: '',
        feWorkers: '',
        applyName: '',
        applyPhone: '',
        unionType: '1',
        parentid: 1
      },
      rules: {
//        name: [
//          { required: true, message: '请输入单位名称', trigger: 'blur' },
//          { min: 3, max: 40, message: '长度在 3 到 40 个字符', trigger: 'blur' }
//        ],
//        code: [
//          { required: true, message: '请输入统一社会信用代码/组织机构代码', trigger: 'blur' },
//          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
//        ],
//        region: [
//          { type: 'array', required: true, message: '请选择地区', trigger: 'change' }
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
    this.getDep()
  },
  computed: {
    ...mapGetters(['getPage'])
  },
  methods: {
    ...filters,
    ...mapActions(['createOrg', 'goBack', 'loadDepListApi', 'goUrl']),
    handleClose () {
    },
    getDep () {
      findUpDepListApi()
      .then((data) => {
        this.items = data
      })
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
          this.createOrg({...this.ruleForm, auditUnit: this.ruleForm.parentid, type: 1}).then((data) => {
            success('创建成功').then(() => {
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
    },
    // 重置表单
    resetForm (formName) {
      this.$refs[formName].resetFields()
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
