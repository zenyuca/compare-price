<template lang="pug">
  received-notice(ref="list", :isPreprocess="true")
</template>

<script>
  import { preprocessOfficeForTypeApi } from '../../../core/api/preprocess'
  import receivedNotice from '../../office/notice/receivedNotice.vue'

  export default {
    name: 'preprocessOffice',
    components: {
      receivedNotice
    },
    data () {
      return {
      }
    },
    created () {
      this.loadData()
    },
    mounted () {
    },
    destroyed () {
    },
    computed: {
    },
    methods: {
      loadData () {
        preprocessOfficeForTypeApi(0).then((data) => {
          let list = []
          for (let item of data['notices']) {
            list.push(receivedNotice.methods.transferData(item, receivedNotice.methods))
          }
          this.$refs['list'].setNotices(list)
        })
      }
    }
  }
</script>

<style lang="less">
</style>
