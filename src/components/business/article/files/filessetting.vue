<template>
  <div class="wrapper-content">
    <c-header class="wrapper-box-header" :menuNames="menuNames">

    </c-header>
    <div class="wrapper-box-content">
      <div class="wrapper-box-middle">
        <div class="public-form-box">
          <div class="public-form-content">
            <el-form :model="type" ref="info" label-width="120px" class="public-form public-form-setting">
              <el-form-item :label="index===0?'类型配置':''"
                v-for="(val,key,index) in type.file" :key="key">
                <el-input placeholder="请输入..."  :value="val" @input="(v)=>type.file[key] = v">
                  <img style="cursor: pointer" slot="append" src="./icon/icon-del.png" class="close" alt="close" @click="del(key)">
                </el-input>
              </el-form-item>
              <el-form-item>
                <div class="btn-add" @click="$set(type.file,new Date().getTime(),'')">+ 添加</div>
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
  // import { uuid } from '../../../core/utils/tool'
//  import _ from 'lodash'
//  import { Loading } from 'element-ui'
  import filters from '../../../../core/filters/index'
  import { error, success } from '../../../../core/utils/actions'
  import { LocalStorage } from '../../../../core/localstorage/util'

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
        this.$delete(this.type.file, key)
      },
      submitForm () {
        let valid = true
        for (let key in this.type.file) {
          if (!this.type.file[key]) {
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
  }
</style>
