<template>
  <div id="publishOrg" class="wrapper-content">
    <c-header class="wrapper-publishOrg-header" :menuNames="menuNames">
    </c-header>
    <div class="wrapper-publishOrg-content">
      <div class="wrapper-publishOrg-middle">
        <div class="publishOrgBox">
            <div class="publishOrgTitle">
                <el-form :inline="true" :model="formInline" class="demo-form-inline">
                    <el-form-item label="日志类型：">
                        <el-select v-model="formInline.region" placeholder="日志类型：" style="width:140px;">
                            <el-option label="类型一" value="shanghai"></el-option>
                            <el-option label="类型二" value="beijing"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="操作时间">
                        <el-date-picker type="datetime" placeholder="选择日期时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item class="searchInp">
                        <el-select v-model="formInline.select" placeholder="请选择" style="width:110px;">
                            <el-option label="行为" value="1"></el-option>
                            <el-option label="操作人姓名" value="2"></el-option>
                        </el-select><el-input placeholder="请输入搜索内容" icon="search" style="width:auto;"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <el-table :data="tableData" border style="width: 100%">
                <el-table-column fixed prop="index" label="序号" align="center">
                </el-table-column>
                <el-table-column prop="name" label="行为" align="center">
                </el-table-column>
                <el-table-column prop="dep" label="操作人姓名" align="center">
                </el-table-column>
                <el-table-column prop="leader" label="所属工会" align="center">
                </el-table-column>
                <el-table-column prop="phone" label="操作时间" align="center">
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
    Modal
  },
  beforeRouteEnter (to, from, next) {
    next()
  },
  data () {
    return {
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
          name: '管理日志',
          route: '',
          on: true
        }
      ],
      tableData: [{
        index: 1,
        name: '王小虎',
        dep: '龙泉总工会',
        leader: '毛主席',
        phone: 18683370859
      }, {
        index: 2,
        name: '王小虎',
        dep: '龙泉总工会',
        leader: '毛主席',
        phone: 18683370859
      }, {
        index: 3,
        name: '王小虎',
        dep: '龙泉总工会',
        leader: '毛主席',
        phone: 18683370859
      }, {
        index: 4,
        name: '王小虎',
        dep: '龙泉总工会',
        leader: '毛主席',
        phone: 18683370859
      }],
      formInline: {
        user: '',
        region: '',
        select: '1'
      }
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
    ...mapActions(['loadAllDept', 'findSendeeId', 'loadSendDetails', 'goUrl']),
    loadData () {
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



#publishOrg {
  width: 100%;
  height: 100%;

  font-size: 16px;
  box-sizing: border-box;
  .wrapper-publishOrg-header {
    .toolbar {
      height: 60px;
    }
  }
  .wrapper-publishOrg-content {
    padding: 20px;
    box-sizing: border-box;
    height: calc(~"100% - 60px");
    .wrapper-publishOrg-middle {
      width: 100%;border-radius: 4px;
      height: @content-height;
      background-color: #ffffff;
    }
  }

  .publishOrgBox{ padding: 20px;}
  .publishOrgTitle .el-input__inner{ background-color: #FAFAFA;
    border-color: #EFF2FA;
  }
  .publishOrgTitle {
    .searchInp{
        float:right;font-size:0;
        .el-input__inner{
            border-radius: 0;
        }
    }
  }
  .btnGroup{
    margin-top: 12px;margin-right:30px;
    .el-button:nth-child(1) {
        background-color: #9AA1AE;color: #ffffff;border: none;
    }
    .el-button:nth-child(2) {
        background-color: #9AA1AE;color: #ffffff;border: none;
    }
    .el-button:nth-child(3) {
        background-color: #FB9926;color: #ffffff;border: none;
        padding: 10px 30px;
    }
  }
  .line{ text-align: center;}
  .selectList{ height: 50px;line-height: 50px;border-bottom: 1px solid #e7e7e7;}
}
</style>
