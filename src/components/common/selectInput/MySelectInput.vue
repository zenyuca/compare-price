<style lang="less">
</style>
<template>
    <span class="mySelectInput">
        {{title}}{{title?'：':''}}
        <el-select v-model="key" style="width:110px;" @change="changeKey">
            <el-option v-for="(val, idx) in options" :key="idx" :label="val" :value="idx"></el-option>
        </el-select>
         <el-input style="width:auto;" :placeholder="placeholder" icon="search" :value="val" @blur="changed">
        </el-input>
    </span>
</template>
<script>
  import { mapGetters } from 'vuex'
  export default{
    name: 'mySelectInput',
    data () {
      return {
        key: this.defKey,
        val: this.defVal,
        old: this.defKey
      }
    },
    props: {
      title: String,
      defKey: String,
      defVal: {
        type: String,
        default: ''
      },
      options: {
        type: Object,
        required: true
      },
      placeholder: {
        type: String,
        default: '请输入...'
      },
      change: Function
    },
    computed: {
      ...mapGetters(['getPage'])
    },
    methods: {
      changeKey (v) {
        this.val = ''
        if (this.val && this.change) {
          this.getPage.keyParam = {
            searchType: isNaN(parseInt(this.key)) ? this.key : parseInt(this.key),
            searchText: isNaN(parseInt(this.val)) ? this.val : parseInt(this.val)
          }
          this.change()
        }
      },
      changed (v) {
        const val = v.target ? v.target.value : v
        if (!this.key || (!this.val && !val) || (!!v.target && this.val === val)) {
          return
        }
        this.getPage.keyParam = {
          searchType: isNaN(parseInt(this.key)) ? this.key : parseInt(this.key),
          searchText: isNaN(parseInt(val)) ? val : parseInt(val)
        }
        this.change()
        this.val = val
      }
    },
    created () {
      this.key = this.defKey || ''
      this.val = this.defVal || ''
      this.old = this.defKey || ''
    }
  }
</script>
