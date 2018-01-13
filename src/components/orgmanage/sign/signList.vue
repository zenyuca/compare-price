<template>
  <div class="wrapper-content">
    <c-header class="wrapper-box-header" :menuNames="menuNames">
    </c-header>
    <div class="wrapper-box-content">
      <div class="wrapper-box-middle">
        <div class="publicOrgBox">
            <div class="publicOrgTitle">
                <el-form :inline="true" :model="formInline" class="demo-form-inline">
                    <!-- <el-form-item label="组织关系：">
                        <el-select v-model="formInline.region" placeholder="组织关系" style="width:140px;">
                            <el-option label="全部" value="shanghai"></el-option>
                            <el-option label="关系1" value="beijing"></el-option>
                            <el-option label="关系2" value="aaaa"></el-option>
                        </el-select>
                    </el-form-item> -->
                    <el-form-item class="searchInp">
                      <select-input :change="loadData" :options="{depName:'单位',name:'姓名'}" def-key="depName"></select-input>
                    </el-form-item>
                </el-form>
            </div>
            <el-table :data="tableData" border style="width: 100%" v-loading="loading">
                <el-table-column fixed type="index" width="80px" label="序号" align="center">
                </el-table-column>
                <el-table-column prop="name" label="姓名" align="center">
                </el-table-column>
                <el-table-column prop="depName" :show-overflow-tooltip="true" label="所属单位" align="center">
                </el-table-column>
                <el-table-column prop="recording"  :formatter="formatter" label="签到时间" align="center">
                </el-table-column>
                <el-table-column prop="point" label="获得积分" align="center">
                </el-table-column>
            </el-table>
            <div class="bar-page" style="margin-top:40px;">
                <c-page :callBack="loadData"></c-page>
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
      loading: true,
      checkedCities1: ['单位名称', '单位类型'],
      cities: ['单位名称', '单位类型', '所属行业', '成立时间', '职工总数', '女职工数'],
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      menuNames: [
        {
          name: '签到列表',
          route: '',
          on: true
        }
      ],
      tableData: [],
      formInline: {
        user: '',
        region: '',
        select: '1'
      }
    }
  },
  created () {
    this.loadData()
  },
  mounted () {
  },
  computed: {
    ...mapGetters(['getPage'])
  },
  methods: {
    ...filters,
    ...mapActions(['loadSignListApi', 'goUrl']),
    loadData () {
      this.loading = true
      this.loadSignListApi().then((data) => {
        this.getPage.total = data.total
        this.tableData = data.list
        this.loading = false
      })
    },
    formatter (item) {
      return new Date(item.recording).Format('yyyy-MM-dd hh:mm')
    }
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

  .publicOrgBox{ padding: 20px;}
  .publicOrgTitle .el-input__inner{ background-color: #FAFAFA;
    border-color: #EFF2FA;
  }
  .publicOrgTitle {
    .searchInp{
        float:right;font-size:0;
        .el-input__inner{
            border-radius: 0;
        }
    }
  }
  .depModal{
    .el-dialog__header{ text-align: center;padding: 0 20px;height: 60px;line-height: 60px;
      font-size: 18px;background-color: #F7F8FA;
    }
    .el-dialog__body{ padding: 20px 10px;}
    .el-dialog__headerbtn{ margin-top: 20px;}
    .el-dialog__footer{ background-color: #F7F8FA;height: 80px;
        padding: 20px 20px;text-align: center;}
    .selectDep{ height: 50px;line-height: 50px;border-bottom: 1px solid #e7e7e7;}
  }
}
</style>
