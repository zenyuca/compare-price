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
              el-table-column(label-class-name='notices-header', align='center', prop='remark', label='备注')
              el-table-column(label-class-name='notices-header', align='center', width="180", label='操作', fixed="right")
                template.operator(slot-scope='scope')
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
              el-form-item(label="备注：", prop="remark")
                el-input(v-model="info.remark")
              el-form-item.bar-btn()
                el-button(type="primary", @click="sure")
                  | 确定
</template>

<script>
  import CHeader from '../../common/header/cHeader.vue'
  import CPage from '../../common/page/cPage.vue'
  import filters from '../../../core/filters/index'
  import { mapGetters, mapActions } from 'vuex'

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
        dialogTitle: '',
        showForm: false,
        // 表单数据
        info: {},
        rules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' }
          ],
          pwd: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ]
        },
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
      }
    }
  }
</script>

<style lang="less">
  #rou {
    width: 100%;
    height: 100%;
    .bar-btn {
      padding-bottom: 0;
    }
  }
</style>
