<template lang="pug">
  received-meeting(ref="list", :isPreprocess="true")
</template>

<script>
  import { preprocessOfficeForTypeApi } from '../../../core/api/preprocess'
  import receivedMeeting from '../../office/meeting/receivedMeeting.vue'

  export default {
    name: 'preprocessOffice',
    components: {
      receivedMeeting
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
        preprocessOfficeForTypeApi(3).then((data) => {
          let list = []
          for (let item of data['meetings']) {
            list.push(receivedMeeting.methods.transferData(item, receivedMeeting.methods))
          }
          this.$refs['list'].setNotices(list)
        })
      }
    }
  }
</script>

<style lang="less">
</style>
