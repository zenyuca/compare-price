<template>
    <span class="mySelectInput">
        <el-select v-model="val" :placeholder="placeholder" :style="`width:${width}`" @change="changed">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="(value, key) in options" :key="key" :label="label?value[label]:value" :value="key"></el-option>
        </el-select>
    </span>
</template>
<script type="es6">
  export default{
    name: 'mySelect',
    data(){
      return {
        val: this.value
      }
    },
    props: {
      width: {
        type: String,
        default: '120px'
      },
      title: String,
      value: {
        type: String,
        default: ''
      },
      field: String,
      options: {
        type: Object,
        required: true
      },
      placeholder: {
        type: String,
        default: '请选择...'
      },
      label: String,
      change: Function
    },
    methods: {
      changed(v){
        this.change(this.field, v)
      }
    }
  }

</script>
