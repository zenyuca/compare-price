<template lang="pug">
  #publishNotice.wrapper-content
    c-header.wrapper-publishNotice-header(:menuNames="menuNames")
      .toolbar(slot="right")
        .searcher
          .select
            el-select(v-model="searchType", @change="searchTypeSelect")
              el-option(v-for="item in searchOptions", :key="item.value", :label="item.label", :value="item.value")
          .input
            el-input(placeholder="搜索", icon="search", v-model="searchText", :on-icon-click="handleSeach")
        .receiveTime
          el-date-picker(v-model='receiveDateRange', type='daterange', align='right', placeholder='发布日期范围', :picker-options='pickerOptions',@change="receiveTimeChange")
        .wrapper-create(@click="createNotice")
          i.icon
          span.name
            | 创建通知
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
</template>

<script>
  import CHeader from '../../common/header/cHeader.vue'
  import COfficeList from '../common/cOfficeList.vue'
  import CAttachmentList from '../common/cAttachmentList.vue'
  import { addWhellEvent, removeWhellEvent } from '../../../core/utils/event'
  import filters from '../../../core/filters'
  import { mapGetters, mapActions } from 'vuex'
  import { LocalStorage } from '../../../core/localstorage/util'
  import config from '../common/config'

  export default {
    name: 'publishNotice',
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
        notices: [],
        isLoading: false,
        // 组件对象
        cOfficeList: {}
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
      ...mapActions(['resetPage', 'loadPublishNotices', 'loadFindMsg', 'loadReplyMsg', 'loadReplyMembers', 'loadMemberDetail']),
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
          'startTime': this.receiveDateRange[0],
          'endTime': this.receiveDateRange[1]
        }
        this.loadPublishNotices(keyParam).then((data) => {
          this.getPage.hasNextPage = data.total !== this.notices.length
          this.getPage.page += 1
          for (let item of data.list) {
            let o = {
              noticeId: item.id,
              day: this.dateTodayFilter(item.createTime),
              time: this.dateTodayFilter(item.createTime),
              type: this.noticeTypeFilter(item.type),
              from: item.deptName,
              name: item.name,
              attachments: item.fileList,
              title: item.title,
              content: item.content,
              msgStatus: item.crtMsgStatus,
              all: item.all,
              allRead: item.allRead,
              currentTab: 1,
              dataType: 0
            }
            this.notices.push(o)
          }
          this.$nextTick(() => {
            this.cOfficeList.setNotices(this.notices, this.loadData)
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
        this.notices = []
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
      addEvent (event) {
        addWhellEvent(this.$refs['e-wrapper-publishNotice-notices'], this.loadData)
      },
      removeEvent (event) {
        removeWhellEvent(this.$refs['e-wrapper-publishNotice-notices'])
      },
      lookNameList (notice) {
        LocalStorage.storeLocalData(LocalStorage.NOTICE, notice)
        this.$router.push(`namelist/${notice.noticeId}`)
      },
      createNotice () {
        this.$router.push(`create`)
      },
      lookEdit (notice) {
        this.$router.push(`create/${notice.noticeId}`)
      },
      changeTab (notice, tab) {
        if (tab === 2) {
          this.$refs[`c-comment-${notice.noticeId}`][0].setNotice(notice)
        } else if (tab === 3) {
          this.$refs[`c-comment-${notice.noticeId}`][0].getMembers(notice)
        } else {
          notice.currentTab = tab
        }
      },
      edit (noticeId) {
        this.$router.push(`create/${noticeId}`)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
  @import "../../common/less/common";

  #publishNotice {
    width: 100%;
    height: 100%;

    .btn-edit {
      float: right;
      margin-top: 16px;
    }
    .panel-1 {
      article {
        bottom: 0;
      }
    }
  }
</style>
