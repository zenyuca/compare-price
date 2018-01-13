<template>
  <div class="wrapper-content">
    <c-header class="wrapper-box-header" :menuNames="menuNames">
    </c-header>
    <div class="wrapper-box-content">
      <div class="wrapper-box-middle">
        <div class="publicOrgBox">
          <div class="publicOrgTitle">
            这是日志管理
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import CHeader from '../../common/header/cHeader.vue'
  import CInput from '../../common/input/cInput.vue'
  import UEditor from '../../common/ueditor/ueditor.vue'
  import SelectInput from '../../common/selectInput/MySelectInput.vue'
  import CPage from '../../common/page/cPage.vue'
  import { mapGetters, mapActions } from 'vuex'
  // import { uuid } from '../../../core/utils/tool'
  // import _ from 'lodash'
  // import { Loading } from 'element-ui'
  import filters from '../../../core/filters'
  import Modal from '../../common/modal/modal.vue'

  export default {
    name: 'publishOrg',
    components: {
      CHeader,
      CInput,
      UEditor,
      CPage,
      Modal,
      SelectInput
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
      ...mapActions(['loadSignListApi', 'goUrl'])
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
  // @import "../../common/less/common";
  @content-height: 100%;
  @contacts-header-height: 72px;
  @wrapper-btn-bar-height: 80px;
  @rightWidth: 435px;



  .wrapper-content{
    width: 100%;
    height: 100%;

    font-size: 16px;
    box-sizing: border-box;
    .wrapper-header {
      .toolbar {
        height: 60px;
      }
    }
    .wrapper-box-content {
      padding: 20px;
      box-sizing: border-box;
      height: calc(~"100% - 60px");
      .wrapper-box-middle {
        width: 100%;border-radius: 4px;
        height: @content-height;
        background-color: #ffffff;
      }
    }

  }
</style>
