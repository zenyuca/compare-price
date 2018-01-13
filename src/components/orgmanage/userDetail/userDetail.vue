<template>
  <div class="wrapper-content">
    <c-header class="wrapper-box-header" :menuNames="menuNames">
      <div slot="right" class="goback">
        <img src="/static/icon/goback.png" alt="返回" @click="goBack">
      </div>
    </c-header>
    <div class="wrapper-box-content">
      <div class="wrapper-box-middle">
        <div class="left">
          <div class="userHead">
            <img :src="person.headimgurl?person.headimgurl:'/static/icon/person.png'" :alt="person.name" class="mgb10">
            <h2 class="mgb10">{{person.name}}</h2>
            <p>{{person.depName}}</p>
          </div>
          <div class="userMenu">
            <a href="javascript:;" :class="{active:parseInt($route.params.type)===0}" @click="goUrl(['userDetail',{id:$route.params.id,type:0}])">档案详情</a>
            <a href="javascript:;" :class="{active:parseInt($route.params.type)===1}" @click="goUrl(['userDetail',{id:$route.params.id,type:1}])">积分明细</a>
          </div>
        </div>
        <div class="right">
          <transition name="slideRight">
            <div class="rightBox" v-if="parseInt($route.params.type)===1">
              <el-table :data="tableData" border style="width: 100%" v-loading="loading" element-loading-text="拼命加载中">
                  <el-table-column prop="title" label="行为" align="center">
                  </el-table-column>
                  <el-table-column prop="point" label="积分变动" align="center">
                  </el-table-column>
                  <el-table-column prop="recording" :formatter="formatter" label="时间" align="center">
                  </el-table-column>
              </el-table>
              <div class="bar-page" style="margin-top:40px;">
                  <c-page :callBack="loadData"></c-page>
              </div>
            </div>
          </transition>
          <transition name="slideRight">
            <div class="rightBox" v-if="parseInt($route.params.type)===0">
              <div class="public-form-box">
                <div class="public-form-content">
                  <el-form :model="user" :rules="rules" ref="user" label-position="top" class="public-form">
                    <el-form-item label="姓名" prop="name">
                      <el-input v-model="user.name"></el-input>
                    </el-form-item>
                    <el-form-item label="昵称" prop="nickname">
                      <el-input v-model="user.nickname"></el-input>
                    </el-form-item>
                    <el-form-item label="性别：" prop="sex">
                      <el-radio-group v-model="user.sex">
                        <el-radio :label="1">男</el-radio>
                        <el-radio :label="2">女</el-radio>
                      </el-radio-group>
                    </el-form-item>
                    <el-form-item label="民族：" prop="nation">
                      <el-select v-model="user.nation" filterable style="width:100%">
                        <el-option v-for="(val,i) in nations" :label="val" :value="val" :key="i"/>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="生日：" prop="birthday">
                      <el-date-picker style="width:100%" type="date" placeholder="请选择出生日期..." v-model="user.birthday" format="yyyy-MM-dd"/>
                    </el-form-item>
                    <el-form-item label="身份证号：" prop="idCard">
                      <el-input placeholder="请输入..." v-model="user.idCard"/>
                    </el-form-item>
                    <el-form-item label="联系电话：" prop="phone">
                      <el-input placeholder="请输入..." v-model="user.phone"/>
                    </el-form-item>
                    <el-form-item label="婚姻：" prop="marriage">
                      <el-radio-group v-model="user.marriage">
                        <el-radio :label="0">未知</el-radio>
                        <el-radio :label="1">已婚</el-radio>
                        <el-radio :label="2">未婚</el-radio>
                      </el-radio-group>
                    </el-form-item>
                    <el-form-item label="政治面貌：" prop="political">
                      <el-select v-model="user.political" style="width:100%">
                        <el-option v-for="(val,i) in politicals" :label="val" :value="i" :key="i"/>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="现居地址：" prop="addressPrefix">
                      <c-area :region="user.addressPrefix" @change="changeArea"></c-area>
                    </el-form-item>
                    <el-form-item label="现居详细地址：" prop="phone">
                      <el-input placeholder="请输入..." v-model="user.address"/>
                    </el-form-item>
                    <el-form-item label="邮寄地址：" prop="mailaddressPrefix">
                      <c-area :region="user.mailaddressPrefix" @change="changeArea2"></c-area>
                    </el-form-item>
                    <el-form-item label="邮寄详细地址：" prop="phone">
                      <el-input placeholder="请输入..." v-model="user.mailaddress"/>
                    </el-form-item>
                    <el-form-item label="职位名称：" prop="position">
                      <el-input placeholder="请输入..." v-model="user.position"/>
                    </el-form-item>
                    <el-form-item label="在岗状态：" prop="employment">
                      <el-select v-model="user.employment" style="width:100%">
                        <el-option v-for="(val,i) in employments" :label="val" :value="i" :key="i"/>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="文化程度：" prop="culture">
                      <el-select v-model="user.culture" style="width:100%">
                        <el-option v-for="(val,i) in cultures" :label="val" :value="i" :key="i"/>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="技能等级：" prop="skill">
                      <el-select v-model="user.skill" style="width:100%">
                        <el-option v-for="(val,i) in skills" :label="val" :value="i" :key="i"/>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="是否劳模：" prop="model">
                      <el-radio-group v-model="user.model">
                        <el-radio :label="true">是</el-radio>
                        <el-radio :label="false">否</el-radio>
                      </el-radio-group>
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
                    <el-form-item label="是否农村籍职工：" prop="countryside">
                      <el-radio-group v-model="user.countryside">
                        <el-radio :label="true">是</el-radio>
                        <el-radio :label="false">否</el-radio>
                      </el-radio-group>
                    </el-form-item>
                    <div class="posb">
                      <el-button class="clear" @click="resetForm('user')">清除</el-button>
                      <el-button class="submit" :loading="btnLoading" @click="submitForm('user')">提交</el-button>
                    </div>
                  </el-form>
                </div>
              </div>
            </div>
          </transition>
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
import { politicals, cultures, skills, employments, nations } from '../../../core/const/index'
import { success } from '../../../core/utils/actions'
// import { uuid } from '../../../core/utils/tool'
import _ from 'lodash'
// import { Loading } from 'element-ui'
import filters from '../../../core/filters'
import Modal from '../../common/modal/modal.vue'
import CArea from '../../common/area/area.vue'

export default {
  name: 'publishOrg',
  components: {
    CHeader,
    CInput,
    UEditor,
    CPage,
    Modal,
    CArea
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
      loading: true,
      btnLoading: false,
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
          name: '职工详情',
          route: '',
          on: true
        }
      ],
      tableData: [],
      formInline: {
        user: '',
        region: '',
        select: '1'
      },
      user: {},
      person: {},
      rules: {
        name: [
          { required: true, message: '请输入单位名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入统一社会信用代码/组织机构代码', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        region: [
          { required: true, message: '请选择活动区域', trigger: 'change' }
        ],
        workers: [
          { required: true, message: '请输入职工总数' },
          // {min: 1, max: 5, message: '长度在 1 到 5 个字符'},
          { type: 'number', message: '职工总数必须为数字值' }
        ],
        feWorkers: [
          { required: true, message: '请输入女职工总数' },
          // {min: 1, max: 5, message: '长度在 1 到 5 个字符'},
          { type: 'number', message: '女职工总数必须为数字值' }
        ],
        applyName: [
          { required: true, message: '请输入申请人姓名', trigger: 'blur' },
          { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
        ],
        applyPhone: [
          { required: true, message: '请填写正确的手机号码', trigger: 'blur', pattern: /^1(3|4|5|7|8)\d{9}$/ }
        ],
        date1: [
          { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        ],
        date2: [
          { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
        ],
        type: [
          { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
        ],
        resource: [
          { required: true, message: '请选择活动资源', trigger: 'change' }
        ],
        desc: [
          { required: true, message: '请填写活动形式', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    // 如果路由有变化，会再次执行该方法
    '$route': 'routeChange'
  },
  created () {
    this.routeChange()
  },
  mounted () {
  },
  computed: {
    ...mapGetters(['getPage'])
  },
  methods: {
    ...filters,
    ...mapActions(['loadMineScoreApi', 'goUrl', 'loadUserApi', 'updateUserApi', 'goBack']),
    loadData () {
      this.loading = true
      let id = this.$route.params.id
      this.loadMineScoreApi(id).then((data) => {
        this.getPage.total = data.total
        this.tableData = data.list
        this.loading = false
      })
    },
    routeChange () {
      setTimeout(() => {
        let id = this.$route.params.id
        this.loadUserApi(id).then((data) => {
          if (data.addressPrefix && data.mailaddressPrefix) {
            data.addressPrefix = JSON.parse(data.addressPrefix)
            data.mailaddressPrefix = JSON.parse(data.mailaddressPrefix)
          }
          this.user = {...data}
          this.person = _.cloneDeep(data)
        })
        if (parseInt(this.$route.params.type) === 1) {
          console.log('这是积分详情')
          this.loadData()
        } else {
          console.log('这是档案详情')
        }
      }, 20)
    },
    formatter (row) {
      return new Date(row.recording).Format('yyyy-MM-dd hh:mm')
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          this.updateUserApi(this.user).then(() => {
            success('修改成功!')
            this.btnLoading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
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
      position: relative;
      .left {
        width: 240px;height: 100%;background-color: #F7F8FA;
        position: absolute;
        .userHead{
          border-bottom: 1px solid #E6E9ED;
          padding: 40px 20px;font-size: 14px;
          text-align: center;
          img{ width: 70px;height: 70px;border-radius: 50%;}
          h2{ color: #4d4d4d;}
          p{ color: #9aa1ae;}
        }
        .userMenu{
          padding-top: 20px;
          a{ display: block;line-height: 40px;padding: 0 30px;position: relative;
            &.active::before{
              content: '';
              width: 0;
              height: 0;
              border-top: 6px solid transparent;
              border-right: 6px solid #31353E;
              border-bottom: 6px solid transparent;
              position: absolute;
              right: 0;
              top: 14px;
            }
            &.active{ color: #333;}
          }
        }
      }
      .right{
        margin-left: 240px;padding: 20px;height: 100%;box-sizing: border-box;
        position: relative;
        .rightBox {
          position: absolute;left: 0;right: 0;top: 0;bottom: 0;
          box-sizing: border-box;padding: 20px;
        }
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

.slideRight-enter-active, .slideRight-leave-active{
  transition: all 0.5s ease-in-out;
}
.slideRight-leave-to{
  transform: translate3d(-20px, 0, 0);
  opacity: 0;
}
.slideRight-enter{
  transform: translate3d(20px, 0, 0);
  opacity: 0;
}

</style>
