<template lang="pug">
  #app
    router-view
</template>

<script>
export default {
  name: 'app'
}
</script>

<style lang="less">
  @import "./components/common/less/common";
  body {
    padding: 0;
    margin: 0;
    font-family: "Microsoft YaHei", SimSun, MingLiU;
  }

  ul, li {
    margin: 0;
    padding: 0;
  }

  li {
    list-style: none;
  }

  input {
    outline: none;
  }

  .slideDown-enter-active, .slideDown-leave-active {
    transition: all .5s;
  }

  .slideDown-enter, .slideDown-leave {
    opacity: 0;
    -webkit-transform: translateY(20px);
    -moz-transform: translateY(20px);
    -ms-transform: translateY(20px);
    -o-transform: translateY(20px);
    transform: translateY(20px);
  }
</style>
