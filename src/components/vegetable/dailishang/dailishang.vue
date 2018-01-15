<template lang="pug">
  #rou
    c-header(:menuNames="menuNames")
      .toolbar(slot="right")
        el-button(type="primary", @click="add", style="margin-right: 40px; width: 180px;")
          | 添加
    .wrapper-list-content
      .wrapper-list-middle
        .list
          .notices
            el-table(:data='tableData', :border="true", row-class-name="notices-row")
              el-table-column(label-class-name='notices-header', align='center', width="77", prop='seq', label='序号', fixed="left")
              el-table-column(label-class-name='notices-header', align='center', prop='username', label='公司名称（用户名）')
              el-table-column(label-class-name='notices-header', align='center', prop='pwd', label='登录密码')
              el-table-column(label-class-name='notices-header', align='center', prop='contacts', label='联系人')
              el-table-column(label-class-name='notices-header', align='center', prop='phone', label='联系电话')
              el-table-column(label-class-name='notices-header', align='center', prop='email', label='邮箱')
              el-table-column(label-class-name='notices-header', align='center', prop='wechat', label='微信')
              el-table-column(label-class-name='notices-header', align='center', width="250", label='操作', fixed="right")
                template.operator(slot-scope='scope')
                  el-button.btn-edit(type='text', size='small',@click="remarkList(scope.row.id)")
                    | 查看备注
                  el-button.btn-edit(type='text', size='small',@click="remark(scope.row.id)")
                    | 添加备注
                  el-button.btn-edit(type='text', size='small',@click="edit(scope.row.id)")
                    | 修改
                  el-button.btn-del(type='text', size='small',@click="del(scope.row.id)")
                    | 删除
          el-dialog(v-model="showForm", size="tiny", :title="dialogTitle")
            el-form(:model="info", :rules="rules", ref="ruleForm", label-position="top", class="public-form")
              el-form-item(label="公司名称（用户名）：", prop="username")
                el-input(v-model="info.username")
              el-form-item(label="登录密码：", prop="pwd")
                el-input(v-model="info.pwd")
              el-form-item(label="联系人：", prop="contacts")
                el-input(v-model="info.contacts")
              el-form-item(label="联系电话：", prop="phone")
                el-input(v-model="info.phone")
              el-form-item(label="邮箱：", prop="email")
                el-input(v-model="info.email")
              el-form-item(label="微信：", prop="wechat")
                el-input(v-model="info.wechat")
              el-form-item.bar-btn()
                el-button(type="primary", @click="sure")
                  | 确定
          el-dialog(v-model="showRemarkList", size="small", title="备注列表")
            el-table(:data='remarkTableData', :border="true", row-class-name="notices-row")
              el-table-column(label-class-name='notices-header', align='center', width="77", prop='seq', label='序号', fixed="left")
              el-table-column(label-class-name='notices-header', align='center', prop='content', label='备注内容')
              el-table-column(label-class-name='notices-header', align='center', prop='', label='备注图片')
                template(slot-scope='scope')
                  img.table-img(:src="scope.row.imgUrl", title="点击预览", @click="imgPreview(scope.row.imgUrl)")
              el-table-column(label-class-name='notices-header', align='center', prop='time', label='备注时间')
          el-dialog(v-model="showRemarkForm", size="tiny", title="添加备注")
            el-form(:model="remarkInfo", :rules="remarkRules", ref="remarkRuleForm", label-position="top", class="public-form")
              el-form-item(label="备注内容", prop="content")
                el-input(v-model="remarkInfo.content")
              el-form-item(label="图片：", prop="image")
                el-upload(class="upload-demo", action="https://jsonplaceholder.typicode.com/posts/", :on-success="onSuccess", :on-preview="handlePreview", :on-remove="handleRemove", :file-list="fileList", list-type="picture-card")
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
  import _ from 'lodash'

  export default {
    name: 'rou',
    components: {
      CHeader,
      CPage
    },
    data () {
      return {
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
        remarkInfo: {},
        rules: {
          username: [
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
          image: [
            { required: true, message: '请输入上传图片', trigger: 'blur' }
          ]
        },
        remarkTableData: [
          {
            seq: 1,
            id: 1,
            content: '有栏叶',
            imgUrl: 'http://img07.tooopen.com/images/20170410/tooopen_sy_205363675636.jpg',
            time: new Date().getTime()
          },
          {
            seq: 2,
            id: 2,
            content: '产品不合格',
            imgUrl: 'http://www.taopic.com/uploads/allimg/111011/2893-11101109325830.jpg',
            time: new Date().getTime()
          }
        ],
        tableData: [
          {
            seq: 1,
            id: 1,
            username: '里斯',
            pwd: '2343242',
            contacts: '张老外',
            phone: '13412341234',
            email: '13412341234@qq.com',
            wechat: '13412341234',
            remark: '放开'
          },
          {
            seq: 2,
            id: 2,
            username: '里斯33',
            pwd: '2343242',
            contacts: '张老外',
            phone: '13412341234',
            email: '13412341234@qq.com',
            wechat: '13412341234',
            remark: '不好啊'
          }
        ]
      }
    },
    created () {
    },
    destroyed () {
    },
    mounted () {
    },
    computed: {
      ...mapGetters([])
    },
    methods: {
      ...filters,
      ...mapActions([]),
      loadData () {
      },
      del (id) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          alert('del')
        }).catch(() => {
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
              alert('add')
            } else if (this.dialogTitle === '修改') {
              alert('edit')
            }
          } else {
            return false
          }
        })
      },
      sureRemark () {
        this.$refs['remarkRuleForm'].validate((valid) => {
          if (valid) {
            alert('add')
          } else {
            return false
          }
        })
      },
      remarkList (id) {
        this.showRemarkList = true
      },
      remark (id) {
        this.showRemarkForm = true
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
        this.activity.pictures.push(response.data)
      },
      handleRemove (file, files) {
        this.getRemoveId(file.id)
        let id = file.id || file.response.data.id
        this.activity.pictures = _.remove(this.activity.pictures, (e) => {
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
