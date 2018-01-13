<template lang="pug">
  received-affiche(ref="list", :isPreprocess="true")
</template>

<script>
  import { preprocessOfficeForTypeApi } from '../../../core/api/preprocess'
  import receivedAffiche from '../../office/affiche/receivedAffiche.vue'

  export default {
    name: 'preprocessOffice',
    components: {
      receivedAffiche
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
        preprocessOfficeForTypeApi(1).then((data) => {
          let list = []
          for (let item of data['publics']) {
            list.push(receivedAffiche.methods.transferData(item, receivedAffiche.methods))
          }
          this.$refs['list'].setNotices(list)
        })
      }
    }
  }
</script>

<style lang="less">
</style>
