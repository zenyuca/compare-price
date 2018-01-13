<template lang="pug">
  received-check(ref="list", :isPreprocess="true")
</template>

<script>
  import { preprocessOfficeForTypeApi } from '../../../core/api/preprocess'
  import receivedCheck from '../../office/check/receivedCheck.vue'

  export default {
    name: 'preprocessOffice',
    components: {
      receivedCheck
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
        preprocessOfficeForTypeApi(5).then((data) => {
          let list = []
          for (let item of data['approvals']) {
            list.push(receivedCheck.methods.transferData(item, receivedCheck.methods))
          }
          this.$refs['list'].setNotices(list)
        })
      }
    }
  }
</script>

<style lang="less">
</style>
