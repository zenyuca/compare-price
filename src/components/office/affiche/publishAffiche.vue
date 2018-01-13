<template lang="pug">
  #publishAffiche.wrapper-content
    c-header.wrapper-publishAffiche-header(:menuNames="menuNames")
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
            | 创建公告
    c-office-list(ref="c-office-list")
      template(slot="status", slot-scope="props")
        img.btn.btn-edit(src="../common/icon/icon-edit.png", @click="edit(props.notice.noticeId)")
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
  import filters from '../../../core/filters'
  import { mapGetters, mapActions } from 'vuex'
  import { LocalStorage } from '../../../core/localstorage/util'
  import config from '../common/config'

  export default {
    name: 'publishPublic',
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
      ...mapActions(['resetPage', 'loadPublishNotices']),
      loadData (e = {}) {
        if (!this.getPage.hasNextPage) {
          e.loading = false
          return
        }
        e.loading = true
        let keyParam = {
          type: 1,
          'searchType': this.searchType,
          'title': this.searchText,
          'content': this.searchText,
          'startTime': this.receiveDateRange[0],
          'endTime': this.receiveDateRange[1]
        }
        this.loadPublishNotices(keyParam).then((data) => {
          this.getPage.hasNextPage = data.hasNextPage
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
              all: item.all,
              allRead: item.allRead,
              currentTab: 1
            }
            this.notices.push(o)
          }
          this.$nextTick(() => {
            this.cOfficeList.setNotices(this.notices, this.loadData, 2)
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
      edit (noticeId) {
        this.$router.push(`create/${noticeId}`)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
  @import "../../common/less/common";

  .el-scrollbar {
    .el-select-dropdown__wrap {
      overflow: hidden;
    }
  }

  #publishAffiche {
    width: 100%;
    height: 100%;

    .btn-edit {
      float: right;
      margin-top: 16px;
    }
    .panel-1 {
      article {
        top: 52px;
        bottom: 0;
      }
    }
  }
</style>
