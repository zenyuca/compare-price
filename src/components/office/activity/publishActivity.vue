<template lang="pug">
  #publishActivity.wrapper-content
    c-header.wrapper-publishActivity-header(:menuNames="menuNames")
      .toolbar(slot="right")
        .searcher
          .select
            el-select(v-model="searchType", @change="searchTypeSelect")
              el-option(v-for="item in searchOptions", :key="item.value", :label="item.label", :value="item.value")
          .input
            el-input(placeholder="搜索", icon="search", v-model="searchText", :on-icon-click="handleSeach")
        .receiveTime
          el-date-picker(v-model='receiveDateRange', type='daterange', align='right', placeholder='发布日期范围', :picker-options='pickerOptions',@change="receiveTimeChange")
        .wrapper-create(@click="createActivity")
          i.icon
          span.name
            | 创建活动
    c-office-list(ref="c-office-list")
      template(slot="status", slot-scope="props")
        img.btn.btn-edit(src="../common/icon/icon-edit.png",@click="edit(props.notice.noticeId)")
      template(slot="panel1", slot-scope="props")
        article
          .title
            | {{ props.notice.title }}
          .from
            .dept
              | 发起人：{{ props.notice.from }}
            .name
              | {{ props.notice.name }}
          .content(v-html="props.notice.content")
          c-attachment-list(v-if="props.notice.attachments", :attachments="props.notice.attachments")
        footer.activity-info
          .rows
            .row
              img.icon(src="../common/icon/icon-peoples.png")
              .value
                | {{ props.notice.current }}/{{ props.notice.total }}人
            .row
              img.icon(src="../common/icon/icon-time.png")
              .value
                | {{ props.notice.start }} — {{ props.notice.end }}
            .row
              img.icon(src="../common/icon/icon-address.png")
              .value
                | {{ props.notice.place }}
</template>

<script>
  import CHeader from '../../common/header/cHeader.vue'
  import COfficeList from '../common/cOfficeList.vue'
  import CAttachmentList from '../common/cAttachmentList.vue'
  import filters from '../../../core/filters'
  import { mapGetters, mapActions } from 'vuex'
  import { LocalStorage } from '../../../core/localstorage/util'
  import config from '../common/config'

  export default {
    name: 'publishActivity',
    components: {
      CHeader,
      COfficeList,
      CAttachmentList
    },
    data () {
      return {
        ...config,
        menuNames: [
          {
            name: '我发布的',
            route: '',
            on: true
          }
        ],
        searchOptions: [
          {
            value: '0',
            label: '请选择'
          },
          {
            value: '1',
            label: '标题'
          },
          {
            value: '2',
            label: '内容'
          }
        ],
        searchType: '0',
        searchText: '',
        receiveDateRange: '',
        activitys: [],
        isLoading: false
      }
    },
    created () {
      this.resetPage()
      this.loadData()
    },
    mounted () {
      this.cOfficeList = this.$refs['c-office-list']
    },
    destroyed () {
    },
    computed: {
      ...mapGetters(['getPage'])
    },
    methods: {
      ...filters,
      ...mapActions(['resetPage', 'loadPublishActivity', 'loadFindMsg', 'loadReplyMsg', 'loadReplyMembers', 'loadMemberDetail']),
      loadData (e = {}) {
        if (!this.getPage.hasNextPage) {
          e.loading = false
          return
        }
        e.loading = true
        let keyParam = {
          type: 0,
          'searchType': this.searchType,
          'title': this.searchText,
          'content': this.searchText,
          'start': this.receiveDateRange[0],
          'end': this.receiveDateRange[1]
        }
        this.loadPublishActivity(keyParam).then((data) => {
          this.getPage.hasNextPage = data.hasNextPage
          this.getPage.page += 1
          for (let item of data.list) {
            let o = {
              activityId: item.id,
              noticeId: item.id,
              day: this.dateTodayFilter(item.created),
              time: this.dateTodayFilter(item.created),
              type: '内部活动',
              status: this.activityTypeFilter(item.status),
              from: item.deptName,
              name: item.adminName,
              attachments: item.files,
              title: item.name,
              msgStatus: item.crtMsgStatus,
              content: item.detail,
              current: item.current,
              total: item.total,
              currentTab: 1,
              createBy: item.createBy,
              start: new Date(item.start).Format('MM月dd日 hh:mm'),
              end: new Date(item.end).Format('MM月dd日 hh:mm'),
              place: item.place,
              dataType: 2
            }
            this.activitys.push(o)
          }
          this.$nextTick(() => {
            this.cOfficeList.setNotices(this.activitys, this.loadData, 1)
            e.loading = false
          })
        })
      },
      assembleReplys (data) {
        let list = []
        for (let item of data) {
          let o = {
            id: item.copyContentId,
            name: item.copyContent,
            selected: false
          }
          list.push(o)
        }
        return list
      },
      resetChangePage () {
        this.getPage.page = 1
        this.activitys = []
        this.getPage.hasNextPage = true
      },
      handleSeach () {
        this.resetChangePage()
        this.loadData()
      },
      receiveTimeChange (data) {
        this.resetChangePage()
        this.loadData()
      },
      searchTypeSelect (data) {
        this.searchType = data
      },
      lookNameList (activity) {
        LocalStorage.storeLocalData(LocalStorage.NOTICE, activity)
        this.$router.push(`namelist/${activity.activityId}`)
      },
      createActivity () {
        this.$router.push(`create`)
      },
      lookEdit (activity) {
        this.$router.push(`create/${activity.activityId}`)
      },
      edit (activityId) {
        this.$router.push(`create/${activityId}`)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
  @import "../../common/less/common";

  #publishActivity {
    width: 100%;
    height: 100%;
    .btn-edit {
      float: right;
      margin-top: 16px;
    }
    .activity-info {
      height: 106px;
      border-top: 1px solid #E6E9ED;
      background-color: #F7F8FA;
      .rows {
        .row {
          line-height: 14px;
          margin-top: 15px;
          &:last-child {
            margin-bottom: 15px;
          }
          .icon, .value {
            display: inline-block;
            font-size: 14px;
            color: #9AA1AE;
          }
          .icon {
            vertical-align: top;
            margin-right: 12px;
          }
          .value {
            .ellipsis-mixin;
            width: calc(~"100% - 28px");
          }
        }
      }
    }
  }
</style>
