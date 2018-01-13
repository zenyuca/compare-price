<template lang="pug">
  div(ref="editor")
</template>

<script>
  import '../../../../static/ueditor/ueditor.config.js'
  import '../../../../static/ueditor/ueditor.all.js'
  import '../../../../static/ueditor/lang/zh-cn/zh-cn.js'
  import config from '../../../core/config'

  export default {
    name: 'ueditor',
    props: {
      id: {
        type: String
      },
      content: {
        type: String,
        default: ''
      },
      config: {
        type: Object,
        default () {
          return {
            autoHeightEnabled: false,
            autoFloatEnabled: true,
            initialContent: '',
            autoClearinitialContent: true,
            initialFrameWidth: null,
            initialFontSize: 14,
            initialFrameHeight: 300,
            serverUrl: `${config.hostname}/ueditor-upload/jsp/controller.jsp`,
            UEDITOR_HOME_URL: '/static/ueditor/',
            videoAllowFiles: [
              '.ogg', '.mp4'
            ],
            toolbars: [
              [
                'fullscreen',
                'source',
                'undo', // 撤销
                'redo', // 重做
                'removeformat', // 清除格式
                'selectall', // 全选
                'justifyleft', // 居左对齐
                'justifyright', // 居右对齐
                'justifycenter', // 居中对齐
                'justifyjustify', // 两端对齐
                'bold', // 加粗
                'forecolor', // 字体颜色
                'backcolor', // 背景色
                'insertorderedlist', // 有序列表
                'insertunorderedlist', // 无序列表
                'indent', // 首行缩进
                'formatmatch', // 格式刷
                'touppercase', // 字母大写
                'tolowercase' // 字母小写
              ],
              [
                'preview', // 预览
                'print', // 打印
                'time', // 时间
                'date', // 日期
                'horizontal', // 分隔线
                'inserttitle', // 插入标题
                'fontfamily', // 字体
                'fontsize', // 字号
                'paragraph', // 段落格式
                'insertimage', // 多图上传
                'imagecenter', // 居中
                'insertvideo', // 视频
                'map', // Baidu地图
                'rowspacingtop', // 段前距
                'link', // 超链接
                'emotion', // 表情
                'searchreplace', // 查询替换
                'rowspacingbottom', // 段后距
                'pagebreak', // 分页
                'background', // 背景
                'template' // 模板
              ]
            ]
          }
        }
      }
    },
    data () {
      return {
        editor: null
      }
    },
    watch: {
      content (val) {
        this.setUEContent(val)
      }
    },
    mounted () {
      let id = Math.random() + 'editor'
      this.$refs['editor'].id = id
      /* eslint-disable no-undef */
      this.editor = UE.getEditor(id, this.config)
    },
    destroyed () {
      this.editor.destroy()
    },
    methods: {
      getUEContent () {
        return this.editor.getContent()
      },
      setUEContent (content) {
        this.editor.ready(() => {
          this.editor.setContent(content)
        })
      }
    }
  }
</script>
