<template>
  <div class="wrapper-content">
    <c-header class="wrapper-box-header" :menuNames="menuNames">
      <div slot="right" class="goback" v-if="cadreId">
        <img src="/static/icon/goback.png" alt="返回" @click="goBack">
      </div>
    </c-header>
    <div class="wrapper-box-content">
      <div class="wrapper-box-middle">
        <div class="public-form-box" style="padding: 0">
          <div class="public-form-content" style="padding: 0">
            <div class="step">
              <el-steps :center="true" :align-center="true" :space="150" :active="active" finish-status="success">
                <el-step title="基本信息"></el-step>
                <el-step title="权限分配"></el-step>
                <el-step title="分享关注"></el-step>
              </el-steps>
            </div>
            <div v-show="active === 1" class="stepBox">
              <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position="top" style="padding:20px" class="public-form">
                <el-row :gutter="60">
                  <el-col :span="12">
                    <el-form-item label="姓名" prop="name">
                      <el-input v-model="ruleForm.name" placeholder="请输入姓名"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号码" prop="mobile">
                      <el-input v-model="ruleForm.mobile" placeholder="请输入手机号码"></el-input>
                    </el-form-item>
                    <el-form-item label="座机号码" prop="landline">
                      <el-input v-model="ruleForm.landline" placeholder="请输入座机号码"></el-input>
                    </el-form-item>
                    <el-form-item label="性别" prop="sex">
                      <el-radio class="radio" v-model="ruleForm.sex" label="1">男</el-radio>
                      <el-radio class="radio" v-model="ruleForm.sex" label="2">女</el-radio>
                    </el-form-item>
                    <el-form-item label="出生日期" prop="birthday" style="width:100%">
                      <el-date-picker v-model="ruleForm.birthday" style="width:100%" type="date" placeholder="请选择出生日期">
                      </el-date-picker>
                    </el-form-item>
                    <el-form-item label="身份证号" prop="idCard">
                      <el-input v-model="ruleForm.idCard" placeholder="请输入身份证号"></el-input>
                    </el-form-item>

                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="密码" prop="pwd">
                      <el-input v-model="ruleForm.pwd" type="passWord" placeholder="密码不能少于8位，且必须为数字、大写字母、小写字母、特殊符号_@的组合..."></el-input>
                    </el-form-item>
                    <el-form-item label="行政职务" prop="position">
                      <el-input v-model="ruleForm.position" placeholder="请输入在单位担任的行政职务"></el-input>
                    </el-form-item>
                    <el-form-item label="所属单位" prop="depLevel">
                      <el-radio-group v-model="depLevel">
                        <el-radio-button label="本单位"></el-radio-button>
                        <el-radio-button label="下级单位"></el-radio-button>
                      </el-radio-group>
                      <!--<el-select style="width: 100%;margin-top: 10px" v-if="ruleForm.dep==='下级单位'" v-model="ruleForm.depName" placeholder="请选择">-->
                        <!--<el-option-->
                          <!--v-for="item in options"-->
                          <!--:key="item.value"-->
                          <!--:label="item.label"-->
                          <!--:value="item.value">-->
                        <!--</el-option>-->
                      <!--</el-select>-->
                      <el-autocomplete style="width:100%" v-model="depName" v-if="depLevel == '下级单位' "
                                       :fetch-suggestions="querySearchAsync" placeholder="请输入内容" @select="handleSelect"></el-autocomplete>
                    </el-form-item>
                    <el-form-item label="工会职务" prop="positionType">
                      <el-select style="width: 100%;" v-model="ruleForm.positionType" placeholder="请选择">
                        <el-option
                          v-for="item in positionType"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>

              </el-form>
            </div>
            <div v-show="active === 2" class="stepBox">
              <el-tree
                ref="tree-allmenus"
                :data="allMenus"
                node-key="id"
                :show-checkbox="true"
                :accordion="true"
                :props="defaultProps"
                :expand-on-click-node="true"
                :render-content="renderContent">
              </el-tree>
            </div>
            <div v-show="active === 3" class="stepBox">第三步</div>
            <div class="posb">
              <el-button v-if="active === 1" class="clear" @click="resetForm()">清空</el-button>
              <el-button v-if="active !== 1" class="clear" @click="step(-1)">上一步</el-button>
              <el-button class="submit" @click="step(1)">{{nextText}}</el-button>
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
  import SelectInput from '../../common/selectInput/MySelectInput.vue'
  import CPage from '../../common/page/cPage.vue'
  import { mapGetters, mapActions } from 'vuex'
  import filters from '../../../core/filters'
  import Modal from '../../common/modal/modal.vue'
  import { getAllMenu } from '../../../core/api/system/systemApi'

  export default {
    name: 'publishOrg',
    components: {
      CHeader,
      CInput,
      UEditor,
      CPage,
      Modal,
      SelectInput
    },
    beforeRouteEnter (to, from, next) {
      next()
    },
    data () {
      return {
        cadreId: '',
        menuNames: [
          {
            name: '创建干部',
            route: '',
            on: true
          }
        ],
        allMenus: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        active: 1,
        nextText: '下一步',
        on: 1,
        depName: '',
        depLevel: '',
        ruleForm: {
          name: '',
          sex: '1',
          deptName: '',
          departments: ''
        },
        rules: {
          name: [
            { required: true, message: '请输入姓名', trigger: 'blur' }
          ],
          mobile: [
            { required: true, message: '请输入手机号码', trigger: 'blur' }
          ],
          pwd: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ],
          sex: [
            { required: true, message: '请选择性别', trigger: 'blur' }
          ],
          idCard: [
            { required: true, message: '请输入身份证号', trigger: 'blur' }
          ],
//          birthday: [
//            { required: true, message: '请选择出生日期', trigger: 'blur' }
//          ],
          position: [
            { required: true, message: '请输入在单位担任的行政职务', trigger: 'blur' }
          ],
          landline: [
            { required: false, message: '请输入座机号码', trigger: 'blur' }
          ]
        },
        restaurants: [],
        timeout: null,
        positionType: [
          {
            value: '1',
            label: '主席'
          },
          {
            value: '2',
            label: '副主席'
          },
          {
            value: '3',
            label: '委员'
          }
        ],
        checkNodes: []
      }
    },
    watch: {
      active: function (val, oldVal) {
        if (val === 3) {
          if (this.cadreId) {
            this.nextText = '修改干部'
          } else {
            this.nextText = '创建干部'
          }
        } else {
          this.nextText = '下一步'
        }
      }
    },
    created () {
      let id = this.$route.params.id
      if (id) {
        this.cadreId = id
        this.menuNames[0].name = '修改干部'
        this.loadData()
      }
    },
    mounted () {
      getAllMenu().then((data) => {
        this.allMenus = data
      })
    },
    computed: {
      ...mapGetters(['getPage'])
    },
    methods: {
      ...filters,
      ...mapActions(['loadSignListApi', 'goUrl', 'getLowerLikeDept', 'addAdmin', 'goBack', 'getAdminById']),
      step (step) {
        this.active += step
        if (this.active > 4) {
          return false
        }
        if (this.active === 4) {
          if (this.cadreId) {
            // 修改逻辑
            alert('修改逻辑')
          } else {
            // 创建逻辑
            let ids = this.getCheckNodes()
            if (ids) {
              this.ruleForm.authMenuId = ids
            }
            this.addAdmin(this.ruleForm).then((data) => {
              this.$alert(`创建成功`, '提示', {
                confirmButtonText: '确定',
                callback: action => {
                }
              })
            })
          }
        }
        if (this.active === 2) {
          if (this.checkNodes && this.checkNodes.length > 0) {
            this.$refs['tree-allmenus'].setCheckedNodes(this.checkNodes)
          } else {
            this.$nextTick(() => {
              this.$refs['tree-allmenus'].setCheckedKeys(this.ruleForm.authMenuId.split(','))
            })
          }

          this.$refs['ruleForm'].validate((valid) => {
            if (valid) {
              if (this.depLevel === '下级单位' && this.ruleForm.departments === '') {
                this.$alert('请填写下级单位名称', '提示', {
                  confirmButtonText: '确定',
                  type: 'warning'
                })
                this.active = 1
                return false
              }
            } else {
              this.active = 1
              return false
            }
          })
        } else {
          this.checkNodes = this.$refs['tree-allmenus'].getCheckedNodes()
        }
      },
      resetForm () {
        this.$refs['ruleForm'].resetFields()
      },
      getCheckNodes () {
        let list = this.$refs['tree-allmenus'].getCheckedNodes()
        let ids = ''
        let menu = {}
        for (let i = 0; i < list.length; i++) {
          menu = list[i]
          ids += menu.id
          if (i !== list.length - 1) {
            ids += ','
          }
        }
        return ids
      },
      renderContent (h, { node, data, store }) {
        return h('div', {
          attrs: {
            style: 'display: inline-block; flex: 1;'
          }
        }, [
          h('span', {}, [
            h('span', {
              attrs: {
                style: 'font-size: 14px'
              }
            }, data.name)
          ])
        ])
      },
      querySearchAsync (queryString, cb) {
        this.ruleForm.departments = ''
        this.ruleForm.deptName = ''
        this.restaurants = []
        this.getLowerLikeDept(queryString).then((data) => {
          for (let item of data) {
            let o = {
              value: item.name,
              id: item.id
            }
            this.restaurants.push(o)
          }
          var restaurants = this.restaurants
          var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants
          clearTimeout(this.timeout)
          this.timeout = setTimeout(() => {
            cb(results)
          }, 300 * Math.random())
        })
      },
      createStateFilter (queryString) {
        return (state) => {
          return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
        }
      },
      handleSelect (item) {
        this.ruleForm.departments = ''// 清空
        this.ruleForm.deptName = ''
        this.ruleForm.departments = '|' + item.id + '|'
        this.ruleForm.deptName = item.value
      },
      loadData () {
        this.getAdminById(this.cadreId).then((data) => {
          this.ruleForm = data
        })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
  /*@import "../../common/less/common";*/
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
        .step{background-color: #F7F8FA;padding: 10px 0 5px 0}
        .stepBox{
          position: absolute;left: 0;top: 80px;bottom: 80px;right: 0;
          .left {
            width: 120px;position: absolute;left: 0;top: 0;height: 100%;
            border-right: 1px solid #CBD1DC;padding-top: 20px;box-sizing: border-box;
            a{ height: 40px;color: #9aa1ae;display: block;padding-left: 20px;
              box-sizing: border-box;width: 100%;line-height: 40px;
              &.on{ color: #477cbe;}
            }
          }
          .right{ position: absolute;left: 120px;top: 0;right: 0;bottom: 0;padding: 20px;
            box-sizing: border-box;overflow-x: hidden;overflow-y: auto;
          }
        }
      }
    }

  }

  .el-tree-node__content {
    display: flex;
    .el-tree-node__expand-icon {
      margin-top: 13px;
    }
  }
</style>
