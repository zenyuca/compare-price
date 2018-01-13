<template lang="pug">
  received-activity(ref="list", :isPreprocess="true")
</template>

<script>
  import { preprocessOfficeForTypeApi } from '../../../core/api/preprocess'
  import receivedActivity from '../../office/activity/receivedActivity.vue'

  export default {
    name: 'preprocessOffice',
    components: {
      receivedActivity
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
        preprocessOfficeForTypeApi(2).then((data) => {
          let list = []
          for (let item of data['activityInters']) {
            list.push(receivedActivity.methods.transferData(item, receivedActivity.methods))
          }
          this.$refs['list'].setNotices(list)
        })
      }
    }
  }
</script>

<style lang="less">
</style>
