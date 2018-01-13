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
            <el-form :model="tips" :rules="rules" ref="ruleForm" label-position="top" class="public-form">
              <el-form-item label="标题：" prop="title">
                <el-input placeholder="请输入..."  v-model="tips.title"/>
              </el-form-item>
              <el-form-item label="内容：" prop="content">
                <u-editor ref="ueditor" :content="tips.content" style="line-height: normal"></u-editor>
              </el-form-item>
              <el-form-item label="附件:">
                <ul class="files">
                  <li class="file" v-for="file in tips.files">
                    <div class="avatar">
                      <img src="./icon/icon-pdf.png">
                    </div>
                    <div class="content-file">
                      <div class="name">{{file.name}}</div>
                      <div class="size">{{calcFileSizeFileter(file.fileSize)}}</div>
                    </div>
                    <div class="btn btn-upload" @click="delUploadFile(file)">
                      <img src="./icon/icon-del.png" alt="">
                    </div>
                  </li>
                </ul>
                <el-upload
                  class="upload-demo"
                  :action="uploadUrl"
                  :show-file-list="false"
                  :before-upload="beforeUpload"
                  :on-progress="onProgress"
                  :on-success="onSuccess">
                  <el-button size="small" style="line-height: normal" class="btn-add" type="primary">点击上传</el-button>
                  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                </el-upload>
              </el-form-item>
              <!-- <div v-if="!data.edit">
                <el-form-item label="发布者：" prop="admin">
                  <el-input placeholder="请输入..."  v-model="data.admin.name" readonly/>
                </el-form-item>
                <el-form-item label="发布时间：" prop="created">
                  <el-input placeholder="请输入..."  :value="date3Filter(data.created)" readonly/>
                </el-form-item>
              </div> -->
              <div class="posb">
                <!--<el-button class="clear" @click="resetForm('ruleForm')">清除</el-button>-->
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
import CHeader from '../../../common/header/cHeader.vue'
import CInput from '../../../common/input/cInput.vue'
import UEditor from '../../../common/ueditor/ueditor.vue'
import { mapGetters, mapActions } from 'vuex'
import config from '../../../../core/config'
import _ from 'lodash'
import { Loading } from 'element-ui'
import filters from '../../../../core/filters/index'
import { error, success } from '../../../../core/utils/actions'

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
      ...config,
      menuNames: [
        {
          name: '公示公告编辑',
          route: '',
          on: true
        }
      ],
      tips: {
        type: 0,
        title: '',
        content: '',
        files: []
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
      }
    }
  },
  created () {
    this.getArticle(this.$route.params.id).then((data) => {
      this.tips = data
      this.$refs['ueditor'].setUEContent(this.tips.content)
    })
  },
  mounted () {
  },
  computed: {
    ...mapGetters(['getPage'])
  },
  methods: {
    ...filters,
    ...mapActions(['goBack', 'goUrl', 'uploadFile', 'getArticle', 'createArticle', 'updateArticle']),
    // 删除文件
    delUploadFile (file) {
      this.tips.files = _.remove(this.tips.files, (n) => {
        return n.id !== file.id
      })
    },
    // 上传成功
    onSuccess (response, file, files) {
      setTimeout(() => {
        this.loading.close()
        this.tips.files.push(response.data)
      }, 500)
    },
    // 上传之中
    onProgress () {
      this.loading = Loading.service({ fullscreen: true, text: '正在上传文件请稍候' })
    },
    // 上传失败
    onError (err) {
      error(err)
      this.loading.close()
    },
    // 上传之前
    beforeUpload (file) {
      const isLen6 = this.tips.files.length < 6
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLen6) {
        error('附件最多上传 2个')
      }
      if (!isLt2M) {
        error('文件不能超过 2MB!')
      }
      return isLen6 && isLt2M
    },
    // 提交表单
    submitForm (formName) {
//      success(this.tips.files)
      this.tips.content = this.$refs['ueditor'].getUEContent()
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.updateArticle(this.tips).then((data) => {
            success('修改成功').then(() => {
              this.goUrl(['tipsList'])
            })
          }).catch((data) => {
            error('提交失败')
          })
        } else {
          error('请填写必须字段!')
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
@import "../../../common/less/common";
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
  } // 对 tree 的修正

  .files {
    width: 100%;
    .file {
      width: calc(~"(100% - 66px) / 3");
      height: 54px;
      display: inline-block;
      margin-right: 30px;
      margin-bottom: 16px;
      border: 1px solid #DDDDDD;
      &:nth-child(3n+0) {
        margin-right: 0px;
      }
      .avatar, .content-file, .btn-del {
        float: left;
        height: inherit;
      }
      .avatar {
        width: 51px;
        img {
          margin-left: 13px;
          margin-top: 12px;
        }
      }
      .content-file {
        width: calc(~"100% - 101px");
        .name {
          margin-top: 14px;
          color: #4D4D4D;
          line-height: 14px;
          font-size: 14px;
          .ellipsis-mixin;
        }
        .size {
          margin-top: 4px;
          color: #CBD1DC;
          line-height: 12px;
          font-size: 12px;
        }
      }
      .btn-upload {
        width: 50px;
        img {
          margin-left: 20px;
          margin-top: 20px;
        }
      }
    }
  }
  .btn-add {
    width: 128px;
    height: 38px;
    line-height: 38px;
    border-radius: 4px;
    border: 1px solid #DDDDDD;
    color: #4D4D4D;
    background-color: #F0F0F0;
    text-align: center;
    cursor: pointer;
  }
  .btn-upload {
    position: relative;
    display: inline-block;
    overflow: hidden;
    input {
      position:absolute;
      right: 0px;
      top: 0px;
      opacity: 0;
      -ms-filter: 'alpha(opacity=0)';
      font-size: 200px;
      cursor: pointer;
    }
  }
}
</style>
