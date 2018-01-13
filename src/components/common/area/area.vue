<style lang="less">

</style>

<template>
  <div class="area">
    <el-cascader style="width:100%" expand-trigger="hover"
                 :options="options" :value="region"
                 @change="handleChange"></el-cascader>
  </div>
</template>
<script type="text/ecmascript-6">
  import DISTRICTS from '../../../core/const/city'
  const DEFAULT_CODE = 100000
  export default {
    props: {
      region: {
        type: Array,
        default: function () {
          return []
        }
      }
    },
    data () {
      return {
        options: []
      }
    },
    created () {
      this.provinces = this.getDistricts()
      for (let code in this.provinces) {
        this.options.push({
          code: code,
          value: this.provinces[code],
          label: this.provinces[code],
          children: []
        })
      }
      this.options.map((item, index) => {
        for (let y in this.getDistricts(item.code)) {
          item.children.push({
            code: y,
            value: this.getDistricts(item.code)[y],
            label: this.getDistricts(item.code)[y],
            children: []
          })
        }
      })
      this.options.map((item, index) => {
        item.children.map((child) => {
          for (let z in this.getDistricts(child.code)) {
            child.children.push({
              code: z,
              value: this.getDistricts(child.code)[z],
              label: this.getDistricts(child.code)[z]
            })
          }
        })
      })
      // **********获得省市区级联动结束
    },
    mounted () {
    },
    components: {
    },
    methods: {
      // 级联选择
      handleChange (value) {
        this.$emit('change', value)
      },
      getDistricts (code = DEFAULT_CODE) {
        return DISTRICTS[code] || null
      }
    }
  }
</script>
