<template lang="pug">
  received-request(ref="list", :isPreprocess="true")
</template>

<script>
  import { preprocessOfficeForTypeApi } from '../../../core/api/preprocess'
  import receivedRequest from '../../office/request/receivedRequest.vue'

  export default {
    name: 'preprocessOffice',
    components: {
      receivedRequest
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
        preprocessOfficeForTypeApi(4).then((data) => {
          let list = []
          for (let item of data['requests']) {
            list.push(receivedRequest.methods.transferData(item, receivedRequest.methods))
          }
          this.$refs['list'].setNotices(list)
        })
      }
    }
  }
</script>

<style lang="less">
</style>
