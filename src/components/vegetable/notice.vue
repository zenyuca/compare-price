<template lang="pug">
  #rou
    c-header(:menuNames="menuNames")
    .wrapper-list-content
      .wrapper-list-middle
        .list
          .notice
            .title
              | 菜品招投标注意事项
            el-input.content(:readonly="readonly", type="textarea", v-model="notice", :autosize="{ minRows: 4, maxRows: 20}")
          .bar-btn(v-if="getAccount.role === 1")
            el-button(type="primary", @click="edit")
              | 编辑
</template>

<script>
  import CHeader from '../common/header/cHeader.vue'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    name: 'rou',
    components: {
      CHeader
    },
    data () {
      return {
        menuNames: [
          {
            name: '注意事项',
            route: '',
            on: true
          }
        ],
        notice: `
1、请投标的供应商提前在物业处认证备案，领取用户名和密码；

2、未经过认证的供应商，不具有投标资格；

3、投标菜品质量，要求不低于招标要求；

4、低于招标要求的菜品，招标方将会予以拒收，同时永久除名供应商的投标资格；

5、每月XX日，请供应商查看投标菜品的品名、数量和要求；

6、每月XX日XX时为投标截止时间，超过时间的投标将不会被接受；`,
        readonly: true
      }
    },
    created () {
      this.readonly = this.getAccount.role !== 1
    },
    destroyed () {
    },
    mounted () {
    },
    computed: {
      ...mapGetters(['getAccount'])
    },
    methods: {
      ...mapActions([]),
      loadData () {
      },
      edit () {
        alert('提交')
      }
    }
  }
</script>

<style lang="less">
  #rou {
    width: 100%;
    height: 100%;
    .notice {
      .title {
        text-align: center;
        font-size: 24px;
        letter-spacing: 2px;
        margin-bottom: 20px;
      }
    }
  }
</style>
