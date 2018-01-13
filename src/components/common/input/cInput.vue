<template lang="pug">
  .cInput
    section.box-input(:class="outClassName")
      textarea.input(:disabled="disabled", :class="inputClassName", :placeholder="placeholder", v-model="currentValue", type="text", :maxlength="max", rows="1")
      .word-limit(v-if="max", :class="limitClassName")
        | {{ currentValue.length }} / {{ max }}
</template>

<script>
  export default {
    name: 'cInput',
    props: {
      placeholder: {
        type: String,
        default: ''
      },
      value: [String, Number],
      max: Number,
      outClassName: {
        type: [String, Object],
        default: ''
      },
      inputClassName: {
        type: [String, Object],
        default: ''
      },
      limitClassName: {
        type: [String, Object],
        default: ''
      },
      disabled: {
        type: [Boolean, String],
        defalut: false
      }
    },
    data () {
      return {
        currentValue: ''
      }
    },
    watch: {
      value (val) {
        this.currentValue = val
      },
      currentValue (newVal) {
        this.$emit('input', newVal)
      }
    },
    created () {
    },
    mounted () {
      for (let text of document.querySelectorAll('textarea.input')) {
        this.autoTextarea(text)
      }
    },
    computed: {
    },
    methods: {
      autoTextarea (elem, extra, maxHeight) {
        extra = extra || 0
        let isFirefox = !!document.getBoxObjectFor || 'mozInnerScreenX' in window
        let isOpera = !!window.opera && !!window.opera.toString().indexOf('Opera')
        let addEvent = function (type, callback) {
          elem.addEventListener ? elem.addEventListener(type, callback, false) : elem.attachEvent('on' + type, callback)
        }
        let getStyle = elem.currentStyle ? function (name) {
          var val = elem.currentStyle[name]
          if (name === 'height' && val.search(/px/i) !== 1) {
            var rect = elem.getBoundingClientRect()
            return rect.bottom - rect.top -
              parseFloat(getStyle('paddingTop')) -
              parseFloat(getStyle('paddingBottom')) + 'px'
          }
          return val
        } : function (name) {
          return getComputedStyle(elem, null)[name]
        }
        let minHeight = parseFloat(getStyle('height'))

        elem.style.resize = 'none'

        let change = function () {
          let scrollTop
          let height
          let padding = 0
          let style = elem.style

          if (elem._length === elem.value.length) return
          elem._length = elem.value.length

          if (!isFirefox && !isOpera) {
            padding = parseInt(getStyle('paddingTop')) + parseInt(getStyle('paddingBottom'))
          }
          scrollTop = document.body.scrollTop || document.documentElement.scrollTop

          elem.style.height = minHeight + 'px'
          if (elem.scrollHeight > minHeight) {
            if (maxHeight && elem.scrollHeight > maxHeight) {
              height = maxHeight - padding
              style.overflowY = 'auto'
            } else {
              height = elem.scrollHeight - padding
              style.overflowY = 'hidden'
            }
            style.height = height + extra + 'px'
            scrollTop += parseInt(style.height) - elem.currHeight
            document.body.scrollTop = scrollTop
            document.documentElement.scrollTop = scrollTop
            elem.currHeight = parseInt(style.height)
          }
        }
        addEvent('propertychange', change)
        addEvent('input', change)
        addEvent('focus', change)
        change()
      }
    }
  }
</script>

<style lang="less">
  @import "../less/common";

  .cInput {
    section {
      transition: border-color 0.8s;
      &:hover {
        border-color: rgb(131, 140, 165);
      }
      &:focus {
        border-color: #477cbe;
      }
      .input {
        border: 0;
        width: 100%;
        outline: none;
        resize: none;
        background-color: transparent;
        line-height: 24px;
        color: #4D4D4D;
      }
      .word-limit {
        margin-top: 3px;
        text-align: right;
        color: #4A4E52;
        font-size: 12px;
        line-height: 12px;
      }
    }
  }
</style>
