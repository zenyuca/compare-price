<template>
  <div class="wrapper-content">
    <c-header class="wrapper-box-header" :menuNames="menuNames">
      <div slot="right" class="goback">
        <img src="/static/icon/goback.png" alt="返回" @click="goBack">
      </div>
    </c-header>
    <div class="wrapper-box-content">
      <div class="wrapper-box-middle">
        <div class="public-form-box">
          <div class="public-form-content">
            <el-form :model="user" :rules="rules" ref="user" label-position="top" class="public-form">
              <div class="public-form-title">
                <span>档案信息</span>
              </div>
              <el-row :gutter="60">
                <el-col :span="12">
                  <el-form-item label="姓名" prop="name">
                    <el-input v-model="user.name"></el-input>
                  </el-form-item>
                  <el-form-item label="性别：" prop="sex">
                    <el-radio-group v-model="user.sex">
                      <el-radio :label="1">男</el-radio>
                      <el-radio :label="2">女</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="身份证号：" prop="idCard">
                    <el-input placeholder="请输入..." v-model="user.idCard"/>
                  </el-form-item>
                  <el-form-item label="民族：" prop="nation">
                    <el-select v-model="user.nation" filterable style="width:100%">
                      <el-option v-for="(val,i) in nations" :label="val" :value="val" :key="i"/>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="现居地址：" prop="addressPrefix">
                    <c-area :region="user.addressPrefix" @change="changeArea"></c-area>
                  </el-form-item>
                  <el-form-item label="邮寄地址：" prop="mailaddressPrefix">
                    <c-area :region="user.mailaddressPrefix" @change="changeArea2"></c-area>
                  </el-form-item>
                  <el-form-item label="所属单位">
                    <el-input v-model="user.depName" disabled></el-input>
                  </el-form-item>
                  <el-form-item label="在岗状态：" prop="employment">
                    <el-select v-model="user.employment" style="width:100%">
                      <el-option v-for="(val,i) in employments" :label="val" :value="i" :key="i"/>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="技能等级：" prop="skill">
                    <el-select v-model="user.skill" style="width:100%">
                      <el-option v-for="(val,i) in skills" :label="val" :value="i" :key="i"/>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="是否参加互助保障：" prop="mutual">
                    <el-radio-group v-model="user.mutual">
                      <el-radio :label="true">是</el-radio>
                      <el-radio :label="false">否</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="是否建档困难职工：" prop="difficulty">
                    <el-radio-group v-model="user.difficulty">
                      <el-radio :label="true">是</el-radio>
                      <el-radio :label="false">否</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <!--<el-form-item label="昵称" prop="nickname">-->
                    <!--<el-input v-model="user.nickname"></el-input>-->
                  <!--</el-form-item>-->
                  <el-form-item label="生日：" prop="birthday">
                    <el-date-picker style="width:100%" type="date" placeholder="请选择出生日期..." v-model="user.birthday" format="yyyy-MM-dd"/>
                  </el-form-item>
                  <el-form-item label="婚姻：" prop="marriage">
                    <el-radio-group v-model="user.marriage">
                      <el-radio :label="1">已婚</el-radio>
                      <el-radio :label="2">未婚</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="手机号码：" prop="phone">
                    <el-input placeholder="请输入..." v-model="user.phone"/>
                  </el-form-item>
                  <el-form-item label="政治面貌：" prop="political">
                    <el-select v-model="user.political" style="width:100%">
                      <el-option v-for="(val,i) in politicals" :label="val" :value="i" :key="i"/>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="现居详细地址：" prop="address">
                    <el-input placeholder="请输入..." v-model="user.address"/>
                  </el-form-item>
                  <el-form-item label="邮寄详细地址：" prop="mailaddress">
                    <el-input placeholder="请输入..." v-model="user.mailaddress"/>
                  </el-form-item>
                  <el-form-item label="岗位名称：" prop="position">
                    <el-input placeholder="请输入..." v-model="user.position"/>
                  </el-form-item>
                  <el-form-item label="文化程度：" prop="culture">
                    <el-select v-model="user.culture" style="width:100%">
                      <el-option v-for="(val,i) in cultures" :label="val" :value="i" :key="i"/>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="是否劳模：" prop="model">
                    <el-radio-group v-model="user.model">
                      <el-radio :label="true">是</el-radio>
                      <el-radio :label="false">否</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="是否农村籍职工：" prop="countryside">
                    <el-radio-group v-model="user.countryside">
                      <el-radio :label="true">是</el-radio>
                      <el-radio :label="false">否</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
              </el-row>

              <div class="public-form-title" v-if="$route.params.id">
                <span>受理信息</span>
              </div>
              <el-row :gutter="60" v-if="$route.params.id">
                <el-col :span="24">
                  <el-form-item label="受理单位">
                    <el-input v-model="user.depName" disabled></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <div class="public-form-title" v-if="$route.params.id">
                <span>审批信息</span>
              </div>
              <el-row :gutter="60" v-if="$route.params.id">
                <el-col :span="24">
                  <el-form-item>
                    <el-button size="small" icon="check" style="color:#477CBE;border-color:#477CBE">未通过</el-button>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="审批意见">
                    <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 6}" placeholder="请输入内容" disabled>
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <div class="posb" v-if="user.audit !== 3">
                <el-button class="clear" @click="resetForm('user')">清除</el-button>
                <el-button class="submit" :loading="btnLoading" @click="submitForm('user')">提交</el-button>
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
  import { mapGetters, mapActions } from 'vuex'
  import filters from '../../../core/filters'
  import { politicals, cultures, skills, employments, nations } from '../../../core/const/index'
  import CArea from '../../common/area/area.vue'
//  import _ from 'lodash'
  export default {
    components: {
      CHeader, CArea
    },
    beforeRouteEnter (to, from, next) {
      next()
    },
    data () {
      return {
        politicals,
        cultures,
        skills,
        employments,
        nations,
        user: {},
        rules: {},
        btnLoading: false,
        menuNames: [
          {
            name: '审批详情',
            route: '',
            on: true
          }
        ]
      }
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
      ...mapActions(['goUrl', 'goBack', 'loadUserApi']),
      loadData () {
        let id = this.$route.params.id
        this.loadUserApi(id).then((data) => {
          if (data.addressPrefix && data.mailaddressPrefix) {
            data.addressPrefix = JSON.parse(data.addressPrefix)
            data.mailaddressPrefix = JSON.parse(data.mailaddressPrefix)
          } else {
            data.addressPrefix = []
            data.mailaddressPrefix = []
          }
          this.user = {...data}
          console.log(data)
        })
      },
      changeArea (val) {
        this.user.addressPrefix = val
        console.log(this.user.addressPrefix)
      },
      changeArea2 (val) {
        this.user.mailaddressPrefix = val
        console.log(this.user.mailaddressPrefix)
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
  }
</style>
