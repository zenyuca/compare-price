<template lang="pug">
  #rou.rou
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
        notice: '',
        readonly: true
      }
    },
    created () {
      this.readonly = this.getAccount.role !== 1
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
      ...mapActions(['addConfigurer', 'getConfigurer']),
      loadData () {
        this.getConfigurer(1).then((data) => {
          this.notice = data.content
        }).catch((data) => {
          this.$alert(data.msg)
        })
      },
      edit () {
        let data = {
          type: 1,
          content: this.notice
        }
        this.addConfigurer(data).then((data) => {
          this.$alert('编辑成功')
        }).catch((data) => {
          this.$alert(data.msg)
        })
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
