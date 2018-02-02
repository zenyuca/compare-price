<template lang="pug">
  #rou.rou
    c-header(:menuNames="menuNames")
      .toolbar(slot="right")
        el-button(v-if="getAccount.role === 1", type="primary", @click="add", style="margin-right: 40px; width: 180px;")
          | 添加
    .wrapper-list-content
      .wrapper-list-middle
        .list
          .notices
            el-table(:data='tableData', :border="true", row-class-name="notices-row")
              el-table-column(label-class-name='notices-header', align='center', width="77", prop='seq', label='序号', fixed="left")
              el-table-column(label-class-name='notices-header', align='center', prop='name', label='公司名称（用户名）')
              el-table-column(label-class-name='notices-header', align='center', prop='pwd', label='登录密码')
              el-table-column(label-class-name='notices-header', align='center', prop='linkman', label='联系人')
              el-table-column(label-class-name='notices-header', align='center', prop='mobile', label='联系电话')
              el-table-column(label-class-name='notices-header', align='center', prop='email', label='邮箱')
              el-table-column(label-class-name='notices-header', align='center', prop='wecatId', label='微信')
              el-table-column(label-class-name='notices-header', align='center', width="250", label='操作', fixed="right")
                template.operator(slot-scope='scope')
                  el-button.btn-edit(type='text', size='small',@click="remarkList(scope.row.id)")
                    | 查看备注
                  el-button.btn-edit(v-if="getAccount.role === 1", type='text', size='small',@click="remark(scope.row.id)")
                    | 添加备注
                  el-button.btn-edit(v-if="getAccount.role === 1", type='text', size='small',@click="edit(scope.row.id)")
                    | 修改
                  el-button.btn-del(v-if="getAccount.role === 1", type='text', size='small',@click="del(scope.row.id)")
                    | 删除
          el-dialog(v-model="showForm", size="tiny", :title="dialogTitle")
            el-form(:model="info", :rules="rules", ref="ruleForm", label-position="top", class="public-form")
              el-form-item(label="公司名称（用户名）：", prop="name")
                el-input(v-model="info.name")
              el-form-item(label="登录密码：", prop="pwd")
                el-input(v-model="info.pwd")
              el-form-item(label="联系人：", prop="linkman")
                el-input(v-model="info.linkman")
              el-form-item(label="联系电话：", prop="mobile")
                el-input(v-model="info.mobile")
              el-form-item(label="邮箱：", prop="email")
                el-input(v-model="info.email")
              el-form-item(label="微信：", prop="wecatId")
                el-input(v-model="info.wecatId")
              el-form-item.bar-btn()
                el-button(type="primary", @click="sure")
                  | 确定
          el-dialog(v-model="showRemarkList", size="small", title="备注列表")
            el-table(:data='remarkTableData', :border="true", row-class-name="notices-row")
              el-table-column(label-class-name='notices-header', align='center', width="77", prop='seq', label='序号', fixed="left")
              el-table-column(label-class-name='notices-header', align='center', prop='content', label='备注内容')
              el-table-column(label-class-name='notices-header', align='center', prop='', label='备注图片')
                template(slot-scope='scope')
                  img.table-img(:src="scope.row.url", title="点击预览", @click="imgPreview(scope.row.url)")
              el-table-column(label-class-name='notices-header', align='center', prop='time', label='备注时间')
              el-table-column(label-class-name='notices-header', align='center', width="250", label='操作', fixed="right")
                template.operator(slot-scope='scope')
                  el-button.btn-del(v-if="getAccount.role === 1",type='text', size='small',@click="delRemark(scope.row.id)")
                    | 删除
          el-dialog(v-model="showRemarkForm", size="tiny", title="添加备注")
            el-form(:model="remarkInfo", :rules="remarkRules", ref="remarkRuleForm", label-position="top", class="public-form")
              el-form-item(label="备注内容", prop="content")
                el-input(v-model="remarkInfo.content")
              el-form-item(label="图片：", prop="fileList")
                el-upload(class="upload-demo", :action="uploadUrl", :on-success="onSuccess", :on-preview="handlePreview", :on-remove="handleRemove", :file-list="remarkInfo.fileList", list-type="picture-card")
                  i.el-icon-plus
              el-form-item.bar-btn()
                el-button(type="primary", @click="sureRemark")
                  | 确定
          el-dialog(v-model="dialogVisible", size="small")
            img(width="100%", :src="dialogImageUrl", alt="")
</template>

<script>
  import CHeader from '../../common/header/cHeader.vue'
  import CPage from '../../common/page/cPage.vue'
  import filters from '../../../core/filters/index'
  import { mapGetters, mapActions } from 'vuex'
  import config from '../../../core/config/index'
  import _ from 'lodash'

  export default {
    name: 'rou',
    components: {
      CHeader,
      CPage
    },
    data () {
      return {
        ...config,
        menuNames: [
          {
            name: '代理商管理',
            route: '',
            on: true
          }
        ],
        fileList: [],
        dialogTitle: '',
        dialogImageUrl: '',
        dialogVisible: false,
        showForm: false,
        showRemarkList: false,
        showRemarkForm: false,
        // 表单数据
        info: {},
        remarkInfo: {
          fileList: []
        },
        rules: {
          name: [
            { required: true, message: '请输入用户名', trigger: 'blur' }
          ],
          pwd: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ]
        },
        remarkRules: {
          content: [
            { required: true, message: '请输入备注内容', trigger: 'blur' }
          ],
          fileList: [
            { type: 'array', required: true, message: '请上传图片', trigger: 'change' }
          ]
        },
        remarkTableData: [],
        tableData: []
      }
    },
    created () {
      this.loadData()
    },
    destroyed () {
    },
    mounted () {
    },
    computed: {
      ...mapGetters(['getAccount'])
    },
    methods: {
      ...filters,
      ...mapActions(['findAgentList', 'addAgent', 'delAgent', 'updateAgent', 'addRemark', 'findRemarkById', 'delRemarker']),
      loadData () {
        this.findAgentList().then((data) => {
          let seq = 0
          let list = []
          for (let item of data) {
            item.seq = ++seq
            list.push(item)
          }
          this.tableData = list
        }).catch((data) => {
          this.$alert(data.msg)
        })
      },
      del (id) {
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.delAgent(id).then((data) => {
            this.loadData()
            this.$alert('删除成功')
          }).catch((data) => {
            this.$alert(data.msg)
          })
        }).catch((data) => {
          this.$alert(data.msg)
        })
      },
      edit (id) {
        this.dialogTitle = '修改'
        this.showForm = true
        let dest = null
        for (let item of this.tableData) {
          if (item.id === id) {
            dest = item
            break
          }
        }
        this.info = dest
      },
      add () {
        this.dialogTitle = '添加'
        this.info = {}
        this.showForm = true
      },
      sure () {
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            if (this.dialogTitle === '添加') {
              this.addAgent(this.info).then((data) => {
                this.loadData()
                this.info = {}
                this.showForm = false
              }).catch((data) => {
                this.$alert(data.msg)
              })
            } else if (this.dialogTitle === '修改') {
              this.updateAgent(this.info).then((data) => {
                this.loadData()
                this.info = {}
                this.showForm = false
              }).catch((data) => {
                this.$alert(data.msg)
              })
            }
          } else {
            return false
          }
        })
      },
      sureRemark () {
        this.$refs['remarkRuleForm'].validate((valid) => {
          if (valid) {
            this.remarkInfo.url = this.remarkInfo.fileList[0].url
            this.addRemark(this.remarkInfo).then((data) => {
              this.showRemarkForm = false
              this.$alert('添加成功')
            }).catch((data) => {
              this.$alert(data.msg)
            })
          } else {
            return false
          }
        })
      },
      remarkList (id) {
//        if (this.getAccount.role === 0) {
//          alert('代理商')
//        } else if (this.getAccount.role === 1) {
        this.findRemarkById(id).then((data) => {
          let list = []
          let i = 0
          for (let item of data) {
            item.seq = ++i
            item.time = new Date(item.createTime).Format('yyyy-MM-dd hh:mm')
            list.push(item)
          }
          this.remarkTableData = list
          this.showRemarkList = true
        }).catch((data) => {
          this.$alert(data.msg)
        })
//        }
      },
      delRemark (id) {
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.delRemarker(id).then((data) => {
            this.showRemarkList = false
            this.$alert('删除成功')
          }).catch((data) => {
            this.$alert(data.msg)
          })
        }).catch((data) => {
          this.$alert(data.msg)
        })
      },
      remark (id) {
        this.showRemarkForm = true
        this.remarkInfo.agentId = id
      },
      handlePreview (file) {
        this.dialogImageUrl = file.url
        this.dialogVisible = true
      },
      imgPreview (url) {
        this.handlePreview({url})
      },
      // 上传成功
      onSuccess (response, file, files) {
        this.remarkInfo.fileList.push(response.data)
      },
      handleRemove (file, files) {
        this.getRemoveId(file.id)
        let id = file.id || file.response.data.id
        this.remarkInfo.fileList = _.remove(this.remarkInfo.fileList, (e) => {
          return e.id !== id
        })
      }
    }
  }
</script>

<style lang="less">
  #rou {
    width: 100%;
    height: 100%;
    .table-img {
      width: 50px;
      height: 50px;
      cursor: pointer;
    }
    .bar-btn {
      padding-bottom: 0;
    }
  }
</style>
