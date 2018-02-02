<template lang="pug">
  #rou.rou
    c-header(:menuNames="menuNames")
      .toolbar(slot="right")
        .searcher
          .select
            el-select(v-model="searchType", @change="searchTypeSelect")
              el-option(v-for="item in searchOptions", :key="item.value", :label="item.label", :value="item.value")
          .input
            el-input(placeholder="搜索", icon="search", v-model="searchText", :on-icon-click="handleSeach")
        el-button(type="primary", @click="add", style="margin-right: 40px; width: 180px;")
          | 上传图片
    .wrapper-list-content
      .wrapper-list-middle
        .list
          .notices
            el-table(:data='tableData', :border="true", row-class-name="notices-row")
              el-table-column(label-class-name='notices-header', align='center', width="77", prop='seq', label='序号', fixed="left")
              el-table-column(label-class-name='notices-header', align='center', prop='name', label='图片名称')
              el-table-column(label-class-name='notices-header', align='center', prop='image', label='图片')
                template(slot-scope='scope')
                  img.table-img(:src="scope.row.url", title="点击预览", @click="imgPreview(scope.row.url)")
              el-table-column(label-class-name='notices-header', align='center', prop='url', label='图片连接')
              el-table-column(label-class-name='notices-header', align='center', width="180", label='操作', fixed="right")
                template.operator(slot-scope='scope')
                  <!--el-button.btn-edit(type='text', size='small',@click="edit(scope.row.id)")-->
                    <!--| 修改-->
                  el-button.btn-del(type='text', size='small',@click="del(scope.row.id)")
                    | 删除
          .bar-page
            c-page(:callBack="loadData")
          el-dialog(v-model="showForm", size="tiny", :title="dialogTitle")
            el-form(:model="info", :rules="rules", ref="ruleForm", label-position="top", class="public-form")
              el-form-item(label="图片名称", prop="name")
                el-input(v-model="info.name")
              el-form-item(label="图片：", prop="fileList")
                el-upload(class="upload-demo", :action="uploadUrl", :on-success="onSuccess", :on-preview="handlePreview", :on-remove="handleRemove", :file-list="info.fileList", list-type="picture-card")
                  i.el-icon-plus
              <!--el-form-item(label="图片连接：", prop="url")-->
                <!--| {{info.fileList[0].url}}-->
              el-form-item.bar-btn()
                el-button(type="primary", @click="sure")
                  | 确定
          el-dialog(v-model="dialogVisible", size="small")
            img(width="100%", :src="dialogImageUrl", alt="")
</template>

<script>
  import CHeader from '../../common/header/cHeader.vue'
  import CPage from '../../common/page/cPage.vue'
  import filters from '../../../core/filters/index'
  import _ from 'lodash'
  import { mapGetters, mapActions } from 'vuex'
  import config from '../../../core/config/index'

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
            name: '图片管理',
            route: '',
            on: true
          }
        ],
        searchText: '',
        searchType: '1',
        searchOptions: [
          {
            value: '1',
            label: '图片名称'
          }
        ],
        dialogImageUrl: '',
        dialogVisible: false,
        dialogTitle: '',
        showForm: false,
        // 表单数据
        info: {
          fileList: []
        },
        rules: {
          name: [
            { required: true, message: '请输入图片名称', trigger: 'blur' }
          ],
          fileList: [
            { type: 'array', required: true, message: '请上传图片', trigger: 'change' }
          ]
        },
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
      ...mapGetters(['getPage'])
    },
    methods: {
      ...filters,
      ...mapActions(['updateImage', 'findImage', 'delImage']),
      loadData () {
        let keyParam = {
          searchText: this.searchText,
          searchType: this.searchType
        }
        this.findImage(keyParam).then((data) => {
          let list = []
          let i = 0
          for (let item of data.list) {
            item.seq = ++i
            list.push(item)
          }
          this.tableData = list
          this.getPage.total = data.total
        }).catch((data) => {
          this.$alert(data.msg)
        })
      },
      del (id) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.delImage(id).then((data) => {
            this.$alert('删除成功')
            this.loadData()
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
        this.info = {
          fileList: []
        }
        this.showForm = true
      },
      sure () {
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            let file = this.info.fileList[0]
            file.name = this.info.name
            file.status = 0
            console.log(file)
            if (this.dialogTitle === '添加') {
              this.updateImage(file).then((data) => {
                this.$alert('添加成功')
                this.showForm = false
                this.loadData()
              }).catch((data) => {
                this.$alert(data.msg)
              })
            } else if (this.dialogTitle === '修改') {
              this.updateImage(this.info.fileList[0]).then((data) => {
                this.$alert('修改成功')
                this.showForm = false
                this.loadData()
              }).catch((data) => {
                this.$alert(data.msg)
              })
            }
          } else {
            return false
          }
        })
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
        this.info.fileList.push(response.data)
      },
      handleRemove (file, files) {
        this.getRemoveId(file.id)
        let id = file.id || file.response.data.id
        this.info.fileList = _.remove(this.info.fileList, (e) => {
          return e.id !== id
        })
      },
      searchTypeSelect (data) {
        this.searchType = data
      },
      handleSeach () {
        this.resetChangePage()
        this.loadData()
      },
      resetChangePage () {
        this.getPage.page = 1
        this.getPage.hasNextPage = true
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
