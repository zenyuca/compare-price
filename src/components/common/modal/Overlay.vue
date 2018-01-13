<template>
  <transition name="overlay">
    <div :class="'overlay ' + (transparent ? 'transparent' : '')" v-if="show" @click="click && click()">
      <div class="inner" v-bind:style="{ opacity: opacity }"></div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      required: true
    },
    click: {
      type: Function,
      default: undefined
    },
    transparent: {
      type: Boolean,
      default: false
    },
    opacity: {
      type: Number,
      default: 1
    }
  }
}
</script>

<style lang="less" scoped>
.overlay {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  transition: opacity .3s;
  opacity: 1;

  .inner {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .6);

  }
  &.transparent .inner {
    background-color: transparent;
  }

  &.overlay-enter,
  &.overlay-leave-active {
    opacity: 0;
  }
}
</style>
