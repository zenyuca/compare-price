<template>
  <div id="publishOrg" class="wrapper-content">
    <c-header class="wrapper-publishOrg-header" :menuNames="menuNames">
      <div slot="right">
        <div class="btnGroup">
            <el-button @click.native="$refs.pop1.open()">高级筛选</el-button>
            <el-button  @click.native="$refs.pop2.open()">显示设置</el-button>
            <el-button>导出</el-button>
        </div>
      </div>
    </c-header>
    <modal ref="pop1" @ok="selectSure" title="高级筛选">
      <div class="public-form-box" style="padding: 20px;">
        <el-form ref="form" :model="form" label-width="80px" label-position="top" class="public-form">
          <el-form-item label="性别：" prop="sex">
            <el-radio-group v-model="form.sex">
              <el-radio :label="1">男</el-radio>
              <el-radio :label="2">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="民族：" prop="nation">
            <el-select v-model="form.nation" filterable style="width:100%">
              <el-option v-for="(val,i) in nations" :label="val" :value="val" :key="i"/>
            </el-select>
          </el-form-item>
          <el-form-item label="生日：" prop="birthday">
            <el-date-picker v-model="form.birthday" type="daterange"
                            format="yyyy-MM-dd" placeholder="请选择出生日期..."
                            style="width:100%"></el-date-picker>
          </el-form-item>
          <el-form-item label="婚姻：" prop="marriage">
            <el-radio-group v-model="form.marriage">
              <el-radio :label="0">未知</el-radio>
              <el-radio :label="1">已婚</el-radio>
              <el-radio :label="2">未婚</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="政治面貌：" prop="political">
            <el-select v-model="form.political" style="width:100%">
              <el-option v-for="(val,i) in politicals" :label="val" :value="i" :key="i"/>
            </el-select>
          </el-form-item>
          <el-form-item label="现居地址：" prop="address">
            <el-input placeholder="请输入..." v-model="form.address"/>
          </el-form-item>
          <el-form-item label="邮寄地址：" prop="mailaddress">
            <el-input placeholder="请输入..." v-model="form.mailaddress"/>
          </el-form-item>
          <el-form-item label="职位名称：" prop="position">
            <el-input placeholder="请输入..." v-model="form.position"/>
          </el-form-item>
          <el-form-item label="在岗状态：" prop="employment">
            <el-select v-model="form.employment" style="width:100%">
              <el-option v-for="(val,i) in employments" :label="val" :value="i" :key="i"/>
            </el-select>
          </el-form-item>
          <el-form-item label="文化程度：" prop="culture">
            <el-select v-model="form.culture" style="width:100%">
              <el-option v-for="(val,i) in cultures" :label="val" :value="i" :key="i"/>
            </el-select>
          </el-form-item>
          <el-form-item label="技能等级：" prop="skill">
            <el-select v-model="form.skill" style="width:100%">
              <el-option v-for="(val,i) in skills" :label="val" :value="i" :key="i"/>
            </el-select>
          </el-form-item>
          <el-form-item label="是否劳模：" prop="model">
            <el-radio-group v-model="form.model">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否参加互助保障：" prop="mutual">
            <el-radio-group v-model="form.mutual">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否建档困难职工：" prop="difficulty">
            <el-radio-group v-model="form.difficulty">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否农村籍职工：" prop="countryside">
            <el-radio-group v-model="form.countryside">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>

    </modal>
    <modal ref="pop2" title="显示设置" @ok="ok" :btn="['保存','取消']">
      <div class="selectListBox pd20">
        <el-checkbox-group @change="handleCheckedFiledChange" v-model="checkedFiled" :min="1" style="width: 100%">
          <div class="selectList" v-for="item in filed" :key="item">
            <el-checkbox :label="item">{{item}}</el-checkbox>
          </div>
        </el-checkbox-group>
        <div class="selectList">
          <el-checkbox :indeterminate="indeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
        </div>
      </div>
    </modal>
    <div class="wrapper-publishOrg-content">
      <div class="wrapper-publishOrg-middle">
        <div class="publishOrgBox">
            <div class="publishOrgTitle">
                <el-form :inline="true" :model="formInline" class="demo-form-inline">
                    <el-form-item class="searchInp">
                      <select-input :change="change" def-key="1"
                        :options="{1:'姓名',2:'呢称',3: '身份证号',
                        4: '所属单位',5: '联系电话'}"></select-input>
                    </el-form-item>
                </el-form>
            </div>
            <el-table :data="tableData" border style="width: 100%" v-loading="loading">
              <el-table-column fixed type="index" label="序号" width="80px;" align="center">
              </el-table-column>
              <el-table-column prop="name" label="姓名" :show-overflow-tooltip="true" align="center">
              </el-table-column>
              <el-table-column prop="nickname" label="昵称" :show-overflow-tooltip="true" align="center">
              </el-table-column>
              <el-table-column prop="sex" label="性别" :formatter="formatter" align="center">
              </el-table-column>
              <el-table-column prop="nation" label="名族" align="center">
              </el-table-column>
              <el-table-column prop="birthday" :formatter="({birthday}) => new Date(birthday).Format('yyyy-MM-dd')" :show-overflow-tooltip="true" label="生日" align="center">
              </el-table-column>
              <el-table-column prop="idCard" :show-overflow-tooltip="true" label="身份证号" align="center">
              </el-table-column>
              <el-table-column prop="phone" :show-overflow-tooltip="true" label="联系电话" align="center">
              </el-table-column>
              <el-table-column prop="marriage" :formatter="({marriage}) => ['未知','已婚','未婚'][marriage]" label="婚姻" align="center">
              </el-table-column>
              <el-table-column prop="political" :formatter="({political}) => politicalFilter(political)" :show-overflow-tooltip="true" label="政治面貌" align="center">
              </el-table-column>
              <el-table-column prop="address" :formatter="(item) => item.addressPrefix?item.addressPrefix+'---'+item.address:item.address" :show-overflow-tooltip="true" label="现居地址" align="center">
              </el-table-column>
              <el-table-column prop="mailaddress" :formatter="(item) => item.mailaddressPrefix?item.mailaddressPrefix+'---'+item.mailaddress:item.mailaddress"
                               :show-overflow-tooltip="true" label="邮寄地址" align="center">
              </el-table-column>
              <el-table-column prop="position" label="职位名称" :show-overflow-tooltip="true" align="center">
              </el-table-column>
              <el-table-column prop="employment" label="在岗状态" :formatter="({employment}) => employmentsFilter(employment)" :show-overflow-tooltip="true" align="center">
              </el-table-column>
              <el-table-column prop="culture" label="文化程度" :formatter="({culture}) => cultureFilter(culture)" :show-overflow-tooltip="true" align="center">
              </el-table-column>
              <el-table-column prop="skill" :formatter="({skill}) => skillsFilter(skill)" label="技能等级" :show-overflow-tooltip="true" align="center">
              </el-table-column>
              <el-table-column prop="model" :formatter="({model}) => modelFilter(model)" label="是否劳模" :show-overflow-tooltip="true" align="center">
              </el-table-column>
              <el-table-column prop="mutual" :formatter="({mutual}) => mutualFilter(mutual)" label="是否参加互助保障" :show-overflow-tooltip="true" align="center">
              </el-table-column>
              <el-table-column prop="difficulty" :formatter="({difficulty}) => difficultyFilter(difficulty)" label="是否建档困难职工" :show-overflow-tooltip="true" align="center">
              </el-table-column>
              <el-table-column prop="countryside" :formatter="({countryside}) => countrysideFilter(countryside)" label="是否农村籍职工" :show-overflow-tooltip="true" align="center">
              </el-table-column>
                <!--<el-table-column prop="depName" label="所属单位" :show-overflow-tooltip="true" align="center">-->
                <!--</el-table-column>-->

                <el-table-column fixed="right" width="100" label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="goUrl(['userDetail',{id:scope.row.id,type:0}])">编辑</el-button>
                        <el-button type="text" style="color:rgb(239, 100, 100);" size="small" @click="del(scope.row)">删除</el-button>
                    </template>
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
import SelectInput from '../../common/selectInput/MySelectInput.vue'
import MySelect from '../../common/select/MySelect.vue'
import UEditor from '../../common/ueditor/ueditor.vue'
import CPage from '../../common/page/cPage.vue'
import { confirm, success, error } from '../../../core/utils/actions'
import { mapGetters, mapActions } from 'vuex'
import { molds, industrys, politicals, cultures, skills, employments, nations } from '../../../core/const/index'
import filters from '../../../core/filters'
import Modal from '../../common/modal/modal.vue'
import { updateShow } from '../../../core/api/orgmanage/org/index'
// import { findDepListApi } from '../../../core/api/orgmanage/org/index'

export default {
  components: {
    CHeader,
    CInput,
    UEditor,
    CPage,
    Modal,
    SelectInput,
    MySelect
  },
  beforeRouteEnter (to, from, next) {
    next()
  },
  data () {
    return {
      politicals,
      cultures,
      skills,
      employments,
      nations,
      molds,
      industrys,
      loading: true,
      checkAll: false,
      indeterminate: true,
      checkedFiled: ['昵称', '性别', '民族', '生日', '身份证号', '联系电话', '婚姻', '政治面貌'],
      filed: ['昵称', '性别', '民族', '生日', '身份证号', '联系电话', '婚姻', '政治面貌', '现居地址', '邮寄地址', '职位名称', '在岗状态',
        '文化程度', '技能等级', '是否劳模', '是否参加互助保障', '是否建档困难职工', '是否农村籍职工'],
      form: {},
      menuNames: [
        {
          name: '职工档案',
          route: '',
          on: true
        }
      ],
      tableData: [],
      formInline: {
        contact: '',
        mold: '',
        deptype: '基层工会',
        select: '单位'
      }
    }
  },
  created () {
    this.resetPage()
    this.getAdmin().then((data) => {
      if (data.showSetting) {
        this.checkedFiled = JSON.parse(data.showSetting).worker.split(',')
      }
    }).catch((data) => {
//      location.reload()
    })
    this.loadData()
  },
  mounted () {
  },
  computed: {
    ...mapGetters(['getPage'])
  },
  methods: {
    ...filters,
    ...mapActions(['getAdmin', 'loadUserListApi', 'goUrl', 'changeSelect', 'delUserApi', 'resetPage']),
    loadData () {
      this.loading = true
      this.loadUserListApi().then((data) => {
        this.getPage.total = data.total
        this.tableData = data.list
        this.loading = false
      })
    },
    change (key, value) {
//      let i = parseInt(value)
//      this.getPage.keyParam[key] = isNaN(i) ? value : parseInt(value)
      this.loadData()
    },
    changeField (key, value) {
    },
    del ({id}) {
      confirm(`确定删除该用户吗?`, 'warning').then(() => {
        this.delUserApi({id: id, del: 1}).then(() => {
          this.loadData()
          success('删除成功')
        }).catch(() => {
          error('服务器开小差啦')
        })
      })
    },
    formatter (row) {
      return this.sexFilter(row.sex)
    },
    // 显示设置
    handleCheckAllChange (event) {
      console.log(event.target.checked)
      this.checkedFiled = event.target.checked ? this.filed : []
      this.indeterminate = false
      this.loadData()
    },
    handleCheckedFiledChange (value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.filed.length
      this.indeterminate = checkedCount > 0 && checkedCount < this.filed.length
      this.loadData()
    },
    ok () {
      console.log(this.checkedFiled.join(','))
      updateShow({worker: this.checkedFiled.join(',')}, 'worker').then((data) => {
      })
    },
    inFiled (val) {
      return this.checkedFiled.indexOf(val) > -1 ? 1 : false
    },
    selectSure () {
      if (this.form.birthday && this.form.birthday.length) {
        this.form.birthdayStart = new Date(this.form.birthday[0]).getTime()
        this.form.birthdayEnd = new Date(this.form.birthday[1]).getTime()
      }
      this.getPage.keyParam = {...this.getPage.keyParam, ...this.form}
      this.loadData()
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
