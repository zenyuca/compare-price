<template lang="pug">
  #common-menu
    .header
      .wrapper-logo
        | 菜品竞价管理系统
      .wrapper-user
        el-dropdown(trigger="click", @command="handleCommand")
          span.el-dropdown-link
            .name
              | {{ account.name }}
            .icon
          el-dropdown-menu(slot='dropdown')
            el-dropdown-item(command="logout")
              | 退出
    .wrapper-footer
      .subSidebar
        el-menu(:unique-opened="true")
          div(v-for="(menu, index) in menus", :key="menu.id", :class="{'single': menu.single}", :id="`el-menu-title-${index}`")
            el-submenu(:index="(index + 1).toString()", v-if="menu.children")
              template(slot='title')
                i.iconfont(:class="menu.icon")
                | {{ menu.name }}
              el-menu-item(:index="`${(index + 1).toString()}-${(index2 + 1).toString()}`", v-for="(child, index2) in menu.children", :key="child.id", :class="{'on': child.on}", @click="toPage(child)")
                i.iconfont(:class="child.icon")
                | {{ child.name }}
            el-menu-item(:index="(index + 1).toString()", v-if="!menu.children", :class="{'on': menu.on}", @click="toPage(menu)")
              i.iconfont(:class="menu.icon")
              | {{ menu.name }}
              el-badge(v-if="menu.badge", :value="menu.badge.value")
      .common-content
        .wrapper-common-content
          router-view
</template>

<script>
  import { getMenus } from '../../../core/menu/index'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    components: {},
    name: 'menu',
    data () {
      return {
        account: {}
      }
    },
    watch: {
    },
    created () {
      this.menus = getMenus(this.getAccount)
      this.account = this.getAccount
      if (this.account.role === 1) {
        this.account.name = '欢迎你，系统管理员 ' + this.account.name
      } else {
        this.account.name = '欢迎你，代理商 ' + this.account.name
      }
    },
    destroyed () {
    },
    computed: {
      ...mapGetters(['getMenus', 'getAccount', 'getShareData'])
    },
    methods: {
      ...mapActions(['loadReadCount', 'storeAccount', 'storeMenus']),
      toPage (menu) {
        if (menu.route) {
          this.$router.push(menu.route)
        }
      },
      handleCommand (command) {
        if (command === 'logout') {
          this.logout()
        }
      },
      logout () {
        window.sessionStorage.clear()
        this.$router.push('/')
      }
    }
  }
</script>

<style lang="less">
  @import "../less/scrollbar-chrome";
  @import "../less/common";

  @subSidebar-width: 215px;
  @menu3-width: (@subSidebar-width - 4px);

  .el-dropdown-menu {
    margin-top: 50px !important;
  }

  #common-menu {
    .header {
      height: 66px;
      z-index: 50;
      background-image: url("./icon/bg1px.png");
      .wrapper-logo {
        float: left;
        height: 66px;
        line-height: 66px;
        font-size: 20px;
        letter-spacing: 2px;
        color: #ffffff;
        margin-left: 30px;
      }
      .infos {
        float: right;
        color: #ffffff;
        .info {
          font-size: 14px;
          float: left;
          margin-right: 20px;
          .icon, .name {
            float: left;
          }
          .icon {
            margin-top: 20px;
            margin-right: 5px;
          }
          .name {
            margin-top: 24px;
          }
        }
      }
      .wrapper-user {
        float: right;
        line-height: 66px;
        margin-top: 16px;
        margin-right: 20px;
        margin-left: 20px;
        .el-dropdown {
          display: block;
        }
        .el-dropdown-link {
          cursor: pointer;
        }
        .avatar, .name, .icon {
          float: left;
        }
        .avatar {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          margin-right: 10px;
        }
        .name {
          font-size: 14px;
          line-height: 34px;
          color: #ffffff;
        }
      }
    }
    .wrapper-footer {
      position: absolute;
      left: 0;
      top: 66px;
      right: 0;
      bottom: 0;
      .subSidebar {
        position: relative;
        width: @subSidebar-width;
        height: 100%;
        overflow: auto;
        overflow-x: hidden;
        float: left;
        background-color: #282E37;
        border-right: 1px solid #333333;
        z-index: 100;
        box-sizing: border-box;
        /*更改三级菜单样式结束*/
        .el-badge {
          vertical-align: top;
          float: right;
        }
        .menu-2-titleName {
          height: 59px;
          line-height: 60px;
          font-size: 16px;
          color: #121212;
          padding-left: 24px;
          border-bottom: 1px solid #E7E7E7;
        }
        .el-menu .el-menu-item {
          text-align: left;
        }
        &.unExpand {
          width: 10px;
        }
        .menus3 {
          margin-top: 32px;
          box-sizing: border-box;
        }
        .expander {
          position: absolute;
          top: calc(~"(100% - 50px) / 2");
          right: 0;
          width: 10px;
          height: 50px;
          background-color: aqua;
          cursor: pointer;
        }
        i[class^="icon"] {
          margin-right: 7px;
        }
      }
      .common-content {
        font-size: 16px;
        width: calc(~"100% - " @subSidebar-width);
        height: 100%;
        float: left;
        background-color: #F0F2F5;
        padding: 20px;
        box-sizing: border-box;
        .wrapper-common-content {
          width: 100%;
          height: 100%;
          background-color: #ffffff;
          overflow: auto;
        }
      }
    }
  }

  .single {
    border-top: 1px solid #3A4454;
    border-bottom: 1px solid #1B2028;
    .el-menu-item {
      font-size: 16px;
      opacity: 1.0;
    }
  }
  #el-menu-title-1 {
    border-top: 1px solid #323943;
  }

  // 对 element-ui 菜单重置样式
  #common-menu .wrapper-footer .subSidebar i[class^="icon"] {
    margin-right: 7px;
    vertical-align: top;
  }
  .el-menu {
    background-color: transparent !important;
    border-right: 1px solid #3A4454;
    height: 100%;
  }
  .is-active, .el-menu-item, .el-submenu__title {
    color: #f2f2f2 !important;
    background-color: transparent;
  }
  .el-submenu__title, .el-menu-item {
    border-left: 4px solid transparent;
  }
  .el-menu-item {
    opacity: 0.7;
    &:hover, &.is-active {
      background-color: #C62855 !important;
      opacity: 1.0;
    }
  }
  .el-submenu__title {
    font-size: 16px;
    &:hover {
      background-color: #C62855 !important;
    }
  }
</style>
