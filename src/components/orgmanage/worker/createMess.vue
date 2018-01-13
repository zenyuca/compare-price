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
            <div class="left">
              <el-form :model="tips" :rules="rules" ref="ruleForm" label-position="top" class="public-form">
                <el-form-item label="标题：" prop="title">
                  <el-input placeholder="请输入..."  v-model="tips.title"/>
                </el-form-item>
                <el-form-item label="内容：" prop="content">
                  <u-editor ref="ueditor" :content="tips.content && tips.content" style="line-height: normal"></u-editor>
                </el-form-item>
                <div class="posb" v-if="$route.params.id === 'create'">
                  <el-button class="clear" @click="resetForm('ruleForm')">清除</el-button>
                  <el-button class="submit" @click="submitForm('ruleForm')">提交</el-button>
                </div>
              </el-form>
            </div>
            <div class="right" ref="right">
              <el-form v-if="$route.params.id === 'create'" ref="public_form_range" class="public-form" :model="rangeForm" label-position="top">
                <el-form-item label="接收范围：">
                  <el-radio-group  prop="range" @change="changeDep" v-model="rangeForm.range">
                    <el-radio :label="2">本工会</el-radio>
                    <el-radio :label="0">本级及以下</el-radio>
                    <el-radio :label="1">下级工会</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item prop="search" v-if="rangeForm.range != 2">
                  <el-input placeholder="搜索工会名称" icon="search" v-model="rangeForm.search"/>
                </el-form-item>
              </el-form>
              <div class="depList" ref="depList" v-if="rangeForm.range != 2 && $route.params.id === 'create'">
                <el-checkbox-group v-model="tips.departments" style="width: 100%">
                  <div class="selectList" v-for="(item,index) in depListFilter" :key="index">
                    <el-checkbox :label="item.id">{{item.name}}</el-checkbox>
                  </div>
                </el-checkbox-group>
              </div>
              <div v-if="$route.params.id !== 'create'" class="sendDepList">
                <h2>接收工会</h2>
                <ul>
                  <li v-if="receiveDept.length" :key="index"
                      v-for="(item,index) in receiveDept">
                    {{item}}
                  </li>
                </ul>
              </div>
            </div>

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
  // import { uuid } from '../../../core/utils/tool'
  import filters from '../../../core/filters/index'
  import { error, success } from '../../../core/utils/actions'
  import { Loading } from 'element-ui'

  export default {
    name: 'box',
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
        rangeForm: {
          range: 1,
          search: ''
        },
        menuNames: [
          {
            name: '新建消息',
            route: '',
            on: true
          }
        ],
        receiveDept: [],
        tips: {
          title: '',
          content: '',
          departments: []
        },
        loading: '',
        rules: {
          title: [
            { required: true, message: '请输入标题名称', trigger: 'blur' },
            { min: 3, max: 40, message: '长度在 3 到 40 个字符', trigger: 'blur' }
          ],
          content: [
            { required: true, message: '请输入内容', trigger: 'blur' }
          ]
        },
        depList: []
      }
    },
    created () {
      if (this.$route.params.id !== 'create') {
        this.seeMessApi(this.$route.params.id).then((res) => {
          res.receiveDept = res.receiveDept.split('|')
          this.receiveDept = res.receiveDept
          this.tips = {...res}
        }).catch((err) => {
          console.log(err)
        })
      } else {
        this.changeDep(1)
      }
    },
    mounted () {
    },
    computed: {
      ...mapGetters(['getPage']),
      depListFilter () {
        return this.depList.filter((item) => {
          return item.name.indexOf(this.rangeForm.search) !== -1
        })
      }
    },
    methods: {
      ...filters,
      ...mapActions(['goBack', 'goUrl', 'findMessDep', 'sendMessDep', 'seeMessApi']),
      changeDep (v) {
        if (v === 2) return
        let loadingInstance = Loading.service({ text: '正在查询工会，请稍候' })
        this.tips.departments = []
        this.findMessDep(v).then((res) => {
          this.depList = res
          loadingInstance.close()
        }).catch(() => {})
      },
      // 提交表单
      submitForm (formName) {
        this.tips.content = this.$refs['ueditor'].getUEContent()
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.rangeForm.range !== 2 && this.tips.departments.length === 0) {
//              error('请至少选择一个工会!')
              return
            }
            let arr = []
            this.tips.departments.forEach((target) => {
              this.depList.forEach((item) => {
                if (item.id === target) {
                  arr.push({id: item.id, name: item.name})
                }
              })
            })
            this.tips.departments = arr
            this.sendMessDep(this.tips).then((res) => {
              success('成功').then(() => {
                this.goUrl(['messList'])
              }).catch(() => {
                error('请求失败')
              })
            })
          } else {
//            error('请填写必须字段!')
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
  /*@import "../../../common/less/common";*/
  @content-height: 100%;
  @contacts-header-height: 72px;
  @wrapper-btn-bar-height: 80px;
  @rightWidth: 435px;

  .wrapper-content {
    width: 100%;
    height: 100%;
    font-size: 16px;
    box-sizing: border-box;
    .wrapper-box-header {
      .toolbar {
        height: 60px;
      }
    }
    .wrapper-box-content {
      padding: 20px;
      box-sizing: border-box;
      height: calc(~"100% - 60px");
      .wrapper-box-middle {
        width: 100%;
        height: @content-height;
        background-color: #ffffff;
      }
      .left{ float: left;width: 60%;height: 100%;overflow-y: auto;
      overflow-x: hidden;box-sizing: border-box;padding-right: 20px;}
      .right{ float: left;width: 40%;height: 100%;padding-left: 20px;
        box-sizing: border-box;
        .depList{ height: calc(~"100% - 170px");overflow-y: auto;
          overflow-x: hidden;
          .selectList{ height: 45px;line-height: 45px;
            border-bottom: 1px solid #e7e7e7;
            .el-checkbox{ width: 100%}
          }
        }
        .sendDepList{ height: 100%;overflow: hidden;
          h2{ font-size: 14px;color: rgb(72, 82, 106);margin-bottom: 20px;}
          li{ line-height: 40px;border-bottom: 1px solid #e7e7e7;}
        }
      }
    } // 对 tree 的修正

  }
</style>
