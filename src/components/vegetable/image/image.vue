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
                  el-button.btn-edit(type='text', size='small',@click="edit(scope.row.id)")
                    | 修改
                  el-button.btn-del(type='text', size='small',@click="del(scope.row.id)")
                    | 删除
          .bar-page
            c-page(:callBack="loadData")
          el-dialog(v-model="showForm", size="tiny", :title="dialogTitle")
            el-form(:model="info", :rules="rules", ref="ruleForm", label-position="top", class="public-form")
              el-form-item(label="图片名称", prop="name")
                el-input(v-model="info.name")
              el-form-item(label="图片：", prop="id")
                el-upload(class="upload-demo", action="https://jsonplaceholder.typicode.com/posts/", :on-success="onSuccess", :on-preview="handlePreview", :on-remove="handleRemove", :file-list="fileList", list-type="picture-card")
                  i.el-icon-plus
              el-form-item(label="图片连接：", prop="url")
                | {{info.url}}
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
            name: '圖片管理',
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
        fileList: [],
        // 表单数据
        info: {},
        rules: {
          name: [
            { required: true, message: '请输入图片名称', trigger: 'blur' }
          ],
          id: [
            { required: true, message: '请上传图片', trigger: 'blur' }
          ]
        },
        tableData: [
          {
            seq: 1,
            id: 1,
            name: '呀肉',
            url: 'http://pic4.nipic.com/20091217/3885730_124701000519_2.jpg'
          },
          {
            seq: 2,
            id: 2,
            name: '猪肉',
            url: 'http://img.zcool.cn/community/01690955496f930000019ae92f3a4e.jpg@2o.jpg'
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
        this.notices = []
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
