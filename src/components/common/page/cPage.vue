<template lang="pug">
  .cPage
    el-pagination(@size-change='handleSizeChange', @current-change='handleCurrentChange', :current-page='getPage.page', :page-sizes='pageSizes', :page-size='getPage.pageSize', layout='total, sizes, prev, pager, next, jumper', :total='getPage.total')
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'cPage',
    props: {
      callBack: Function
    },
    data () {
      return {
        pageSizes: [10, 20, 30, 40]
      }
    },
    created () {
      this.getPage.page = 1
    },
    computed: {
      ...mapGetters(['getPage'])
    },
    methods: {
      handleSizeChange (val) {
        this.getPage.pageSize = val
        this.callBack()
      },
      handleCurrentChange (val) {
        this.getPage.page = val
        this.callBack()
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
  .cPage {

  }
</style>
