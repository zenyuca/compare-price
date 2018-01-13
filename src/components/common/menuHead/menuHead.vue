<style lang="less" scoped>
.menuNames {
  height: 60px;
  margin-left: 47px;
  overflow: hidden;
  .menuName {
    float: left;
    height: 57px;
    line-height: 57px;
    border-bottom: 3px solid transparent;
    margin-right: 20px;
    cursor: pointer;
    font-size: 14px;
    a{ display: block;height: 100%}
    &:last-child {
      margin-right: 0;
    }
    &.on, &:hover{
      border-color: #121212;
    }
  }
}
</style>
<template>
  <div class="page1">
    <ul class="menuNames">
      <li v-for="(item,index) in items" class="menuName" :class="{on:$route.params.id === item.id}">
        <router-link :to="{path: item.url}">{{item.name}}</router-link>
      </li>
    </ul>
  </div>
</template>

<script type="es6">
  export default{
    props: {
      items: {
        type: Array,
        default: []
      }
    },
    data(){
      return{
      }
    },
    components: {

    }
  }
</script>
