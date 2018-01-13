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
            <el-form :model="ruleForm" ref="ruleForm" label-position="top" class="public-form">
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
                    <el-cascader style="width:100%" expand-trigger="hover" :options="options" v-model="ruleForm.region"></el-cascader>
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
                    <el-input  v-model="ruleForm.applyName" placeholder="请输入申请人姓名..."></el-input>
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
              <div class="public-form-title">
                <span>审批信息</span>
              </div>
              <el-row :gutter="60">
                <el-col :span="24">
                  <el-form-item>
                    <el-button class="check" :class="{on:ruleForm.audit === 2}" @click="ruleForm.audit = 2" size="small" :icon="ruleForm.audit===2?'check':''">通过</el-button>
                    <el-button class="check" :class="{on:ruleForm.audit === 3}" @click="ruleForm.audit = 3" size="small" :icon="ruleForm.audit===3?'check':''">拒绝通过</el-button>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="审批意见">
                    <el-input v-model="ruleForm.fail" type="textarea" :autosize="{ minRows: 4, maxRows: 6}" placeholder="请输入内容">
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
import { molds, industrys } from '../../../core/const/index'
// import { uuid } from '../../../core/utils/tool'
// import _ from 'lodash'
// import { Loading } from 'element-ui'
import { error, success } from '../../../core/utils/actions'
import filters from '../../../core/filters'
import { findUpDepListApi } from '../../../core/api/orgmanage/org/index'
import DISTRICTS from '../../../core/const/city'
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
      items: [],
      options: [],
      menuNames: [
        {
          name: '审批详情',
          route: '',
          on: true
        }
      ],
      ruleForm: {}
    }
  },
  created () {
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
  },
  mounted () {
    this.getDep()
    this.getUpDep()
  },
  computed: {
    ...mapGetters(['getPage'])
  },
  methods: {
    ...filters,
    ...mapActions(['getDepApi', 'goBack', 'auditDep']),
    getDistricts (code = DEFAULT_CODE) {
      return DISTRICTS[code] || null
    },
    getUpDep () {
      findUpDepListApi()
      .then((data) => {
        this.items = data
      })
    },
    // 获取信息
    getDep () {
      this.getDepApi(this.$route.params.id).then((data) => {
        this.ruleForm = data
        this.ruleForm.region = data.region ? JSON.parse(data.region) : []
      })
    },
    submitForm (formName) {
      if (this.ruleForm.audit !== 2 && this.ruleForm.audit !== 3) {
        error('请选择通过与否')
        return false
      }
      this.auditDep(this.ruleForm).then((data) => {
        success('审批成功')
      }).catch(() => {
        error('提交失败请重试')
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
      .check {
        color:#477CBE;border-color:#477CBE;
        &.on{
          color:#fff;background-color: #477CBE;
        }
      }
    }
  } // 对 tree 的修正
}
</style>
