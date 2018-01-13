<template>
  <div class="wrapper-content">
    <c-header class="wrapper-box-header" :menuNames="menuNames">

    </c-header>
    <div class="wrapper-box-content">
      <div class="wrapper-box-middle">
        <div class="public-form-box">
          <div class="public-form-content">
            <el-form :model="type" ref="info" label-width="120px" class="public-form public-form-setting">
              <el-form-item label="类型配置">
                <div class="guide-type" v-for="(val,key,index) in type.guide" :key="key">
                  <el-upload
                    class="guide-avatar-uploader"
                    :action="uploadUrl"
                    :show-file-list="false"
                    :on-success="(v)=>type.guide[key].url = v.data.url"
                    :on-error="(v)=>error('上传失败')"
                    :before-upload="beforeAvatarUpload"
                  >
                    <img v-if="type.guide[key].url" :src="type.guide[key].url" class="guideavatar">
                    <i v-else class="el-icon-plus guide-avatar-uploader-icon"></i>
                  </el-upload>
                  <el-input placeholder="请输入..."  :value="val.name" @input="(v)=>type.guide[key].name = v">
                    <img style="cursor: pointer" slot="append" src="./icon/icon-del.png" class="close" alt="close" @click="del(key)">
                  </el-input>
                </div>
              </el-form-item>
              <el-form-item>
                <div class="btn-add" @click="$set(type.guide,new Date().getTime(),{name:'',url:''})">+ 添加</div>
              </el-form-item>
              <div class="posb">
                <el-button class="submit" @click="submitForm">提交</el-button>
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
  import filters from '../../../../core/filters/index'
  import { error, success } from '../../../../core/utils/actions'
  import { LocalStorage } from '../../../../core/localstorage/util'
  import config from '../../../../core/config'

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
        type: {info: {}},
        menuNames: [
          {
            name: '类型参数配置',
            route: '',
            on: true
          }
        ]
      }
    },
    created () {
      this.type = {...this.type, ...JSON.parse(this.setting.articleType)}
    },
    mounted () {
    },
    computed: {
      ...mapGetters(['getPage', 'setting'])
    },
    methods: {
      ...filters,
      ...mapActions(['goBack', 'goUrl', 'setSysApi', 'storeSetting']),
      del (key) {
        this.$delete(this.type.guide, key)
      },
      submitForm () {
        let valid = true
        for (let key in this.type.guide) {
          if (!this.type.guide[key].name || !this.type.guide[key].url) {
            valid = false
          }
        }
        this.setting.articleType = JSON.stringify(this.type)
        valid ? this.setSysApi(this.setting).then(() => {
          // 因为setting 是保存在 LocalStorage 里面 所以修改之后也需要存进去
          this.storeSetting(this.setting)
          LocalStorage.storeLocalData(LocalStorage.SYSTEM_SETTING, this.setting)
          success('修改成功')
        }).catch((err) => error(err)) : error('类型必填')
      },
      handleAvatarSuccess (res, file) {
//        this.imageUrl = URL.createObjectURL(file.raw)
      },
      beforeAvatarUpload (file) {
        const isJPG = file.type === 'image/jpeg'
        const isLt2M = file.size / 1024 / 1024 < 2

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!')
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!')
        }
        return isJPG && isLt2M
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
    .public-form.public-form-setting .el-form-item__error{
      top: 100%;
      right: 0;
    }
    .btn-add{
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
    .guide-type{
      width: 200px;float: left;margin-right: 20px;margin-bottom: 20px;
      .guideavatar{ width: 200px;height: 100px;}
      .guide-avatar-uploader-icon{
        width: 200px;height: 100px;line-height: 100px;text-align: center;
        color: #8c939d;display: block;font-size: 28px;border: 1px dashed #8c939d;
        margin-bottom: 10px;
      }
    }
  }
</style>
