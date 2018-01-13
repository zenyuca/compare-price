<template>
  <div class="detaiOrg">
    <detail-org></detail-org>
  </div>
</template>

<script>
import CHeader from '../../common/header/cHeader.vue'
import CInput from '../../common/input/cInput.vue'
import UEditor from '../../common/ueditor/ueditor.vue'
import DetailOrg from './detailOrg.vue'
import { mapGetters, mapActions } from 'vuex'
// import { uuid } from '../../../core/utils/tool'
// import _ from 'lodash'
// import { Loading } from 'element-ui'
import filters from '../../../core/filters'

export default {
  components: {
    CHeader,
    CInput,
    UEditor,
    DetailOrg
  },
  beforeRouteEnter (to, from, next) {
    next()
  },
  data () {
    return {
    }
  },
  created () {
  },
  mounted () {
  },
  computed: {
    ...mapGetters(['getPage'])
  },
  methods: {
    ...filters,
    ...mapActions(['createOrg', 'goBack'])
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.detaiOrg{
  width: 100%;
  height: 100%;
}
</style>
