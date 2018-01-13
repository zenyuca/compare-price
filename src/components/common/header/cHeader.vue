<template lang="pug">
  #content-header
    ul.menuNames
      li.menuName(v-for="menuName in menuNames", :class="{'on': menuName.on}")
        img.icon(src="./icon/mark.png")
        router-link.name(:to="menuName.route", tag="div")
          | {{ menuName.name }}
    .ch-right
      slot(name="right")
</template>

<script>
  export default {
    name: 'content-header',
    props: {
      menuNames: {
        type: Array,
        default: []
      }
    },
    data () {
      return {
      }
    },
    created () {
    },
    methods: {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
  #content-header {
    width: calc(~"100% - 25px");
    margin-left: 25px;
    height: 58px;
    background-color: #ffffff;
    position: relative;
    border-bottom: 2px solid #E0E0E0;
    .menuNames {
      height: calc(~"100% - 25px");
      float: left;
      .menuName {
        display: inline-block;
        color: #333333;
        font-size: 16px;
        font-weight: bold;
        height: 58px;
        line-height: 58px;
        border-bottom: 2px solid transparent;
        margin-right: 15px;
        cursor: pointer;
        &:last-child {
          margin-right: 0;
        }
        &.on {
          border-bottom: 2px solid #121212;
        }
        &:hover {
          border-bottom: 2px solid #121212;
        }
        .icon, .name {
          float: left;
        }
        .icon {
          margin-right: 10px;
          margin-top: 24px;
        }
      }
    }
    .ch-right {
      float: right;
    }
  }
</style>
