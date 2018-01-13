<template lang="pug">
  #census.wrapper-content
    c-header(:menuNames="menuNames")
      .goback(slot="right")
        img(src='/static/icon/goback.png', alt='返回', @click='goBack')
    .wrapper-list-content
      .wrapper-list-middle
        ul.pillars
          li.pillar
            ul.counters
              li.counter.box-light
                .count
                  | 200
                .label
                  | 报名人数(人)
              li.counter.box-light
                .count
                  | 200
                .label
                  | 签到人数(人)
            .box-chart.box-light.box-chart-footer.box-chart-footer1
              .title-chart
                | 报名走势图
          li.pillar
            .box-chart.box-light.box-chart-top.box-chart-top2
              .title-chart
                | 会员统计
              .items
                e-charts(:options="vipOption1")
                ul.legends
                  li.legend(v-for="(legend, index) of vipOption1Legends")
                    span.left
                      .color(:style="{'background-color': getColor(index)}")
                      .value
                        | {{ legend.name }}：{{ legend.value }}
              .items
                e-charts(:options="vipOption2")
                ul.legends
                  li.legend(v-for="(legend, index) of vipOption2Legends")
                    span.left
                      .color(:style="{'background-color': getColor(index)}")
                      .value
                        | {{ legend.name }}：{{ legend.value }}
            .box-chart.box-light.box-chart-footer.box-chart-footer2
              .title-chart
                | 年龄段统计
              e-charts(:options="ageOption1")
          li.pillar
            .box-chart.box-light.box-chart-top.box-chart-top3
              .title-chart
                | 婚姻状况统计图
              .items
                e-charts(:options="marryOption1")
                ul.legends
                  li.legend(v-for="(legend, index) of marryOption1Legends")
                    span.left
                      .color(:style="{'background-color': getColor(index)}")
                      .value
                        | {{ legend.name }}：{{ legend.value }}
              .items
                e-charts(:options="marryOption2")
                ul.legends
                  li.legend(v-for="(legend, index) of marryOption2Legends")
                    span.left
                      .color(:style="{'background-color': getColor(index)}")
                      .value
                        | {{ legend.name }}：{{ legend.value }}
              .items
                e-charts(:options="marryOption3")
                ul.legends
                  li.legend(v-for="(legend, index) of marryOption3Legends")
                    span.left
                      .color(:style="{'background-color': getColor(index)}")
                      .value
                        | {{ legend.name }}：{{ legend.value }}
              .items
                e-charts(:options="marryOption4")
                ul.legends
                  li.legend(v-for="(legend, index) of marryOption4Legends")
                    span.left
                      .color(:style="{'background-color': getColor(index)}")
                      .value
                        | {{ legend.name }}：{{ legend.value }}
              .items
                e-charts(:options="marryOption5")
                ul.legends
                  li.legend(v-for="(legend, index) of marryOption5Legends")
                    span.left
                      .color(:style="{'background-color': getColor(index)}")
                      .value
                        | {{ legend.name }}：{{ legend.value }}
              .items
                e-charts(:options="marryOption6")
                ul.legends
                  li.legend(v-for="(legend, index) of marryOption6Legends")
                    span.left
                      .color(:style="{'background-color': getColor(index)}")
                      .value
                        | {{ legend.name }}：{{ legend.value }}
</template>

<script>
  import CHeader from '../../../../common/header/cHeader.vue'
  import ECharts from 'vue-echarts/components/ECharts.vue'
  import 'echarts/lib/chart/pie'
  import 'echarts/lib/chart/bar'
  import 'echarts/lib/component/tooltip'
  import 'echarts/lib/component/legend'
  import { mapGetters, mapActions } from 'vuex'
  import { color, getColor } from '../../../../../core/utils/echartsColor'
  export default {
    name: 'namelistActivity',
    components: {
      CHeader,
      ECharts
    },
    data () {
      return {
        menuNames: [
          {
            name: '牵线统计',
            route: '',
            on: true
          }
        ],
        menuNames2: [
          {
            name: '活动统计',
            route: '',
            on: true
          }
        ],
        menuNames3: [
          {
            name: '活动参与年龄段统计',
            route: '',
            on: true
          }
        ],
        ageOption1: {
          tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          // legend: {
          //   data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎', '百度', '谷歌', '必应', '其他']
          // },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: [
            {
              name: '直接访问',
              type: 'bar',
              data: [640, 332, 301, 334, 390, 330, 320]
            },
            {
              name: '邮件营销',
              type: 'bar',
              stack: '广告',
              data: [120, 132, 101, 134, 90, 230, 210]
            },
            {
              name: '联盟广告',
              type: 'bar',
              stack: '广告',
              data: [220, 182, 191, 234, 290, 330, 310]
            },
            {
              name: '视频广告',
              type: 'bar',
              stack: '广告',
              data: [150, 232, 201, 154, 190, 330, 410]
            },
            {
              name: '搜索引擎',
              type: 'bar',
              data: [862, 1018, 964, 1026, 1679, 1600, 1570],
              markLine: {
                lineStyle: {
                  normal: {
                    type: 'dashed'
                  }
                },
                data: [
                  [{type: 'min'}, {type: 'max'}]
                ]
              }
            },
            {
              name: '百度',
              type: 'bar',
              barWidth: 5,
              stack: '搜索引擎',
              data: [620, 732, 701, 734, 1090, 1130, 1120]
            },
            {
              name: '谷歌',
              type: 'bar',
              stack: '搜索引擎',
              data: [120, 132, 101, 134, 290, 230, 220]
            },
            {
              name: '必应',
              type: 'bar',
              stack: '搜索引擎',
              data: [60, 72, 71, 74, 190, 130, 110]
            },
            {
              name: '其他',
              type: 'bar',
              stack: '搜索引擎',
              data: [62, 82, 91, 84, 109, 110, 120]
            }
          ]
        },
        vipOption1Legends: [],
        vipOption1: {
          tooltip: {
            trigger: 'item',
            formatter: '{b}: {c} ({d}%)'
          },
          series: [
            {
              name: '报名',
              type: 'pie',
              radius: ['60%', '80%'],
              color: color,
              avoidLabelOverlap: false,
              label: {
                normal: {
                  formatter: () => {
                    return '报名'
                  },
                  show: true,
                  position: 'center',
                  textStyle: {
                    fontSize: '23',
                    fontWeight: 'normal'
                  }
                },
                emphasis: {
                  show: false,
                  textStyle: {
                    fontSize: '16',
                    fontWeight: 'normal'
                  }
                }
              },
              labelLine: {
                normal: {
                  show: true
                }
              },
              data: []
            }
          ]
        },
        vipOption2Legends: [],
        vipOption2: {
          tooltip: {
            trigger: 'item',
            formatter: '{b}: {c} ({d}%)'
          },
          series: [
            {
              name: '签到',
              type: 'pie',
              radius: ['60%', '80%'],
              color: color,
              avoidLabelOverlap: false,
              label: {
                normal: {
                  formatter: () => {
                    return '签到'
                  },
                  show: true,
                  position: 'center',
                  textStyle: {
                    fontSize: '23',
                    fontWeight: 'normal'
                  }
                },
                emphasis: {
                  show: false,
                  textStyle: {
                    fontSize: '16',
                    fontWeight: 'normal'
                  }
                }
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              data: []
            }
          ]
        },
        marryOption1Legends: [],
        marryOption1: {
          tooltip: {
            trigger: 'item',
            formatter: '{b}: {c} ({d}%)'
          },
          series: [
            {
              name: '签到',
              type: 'pie',
              radius: ['60%', '80%'],
              color: color,
              avoidLabelOverlap: false,
              label: {
                normal: {
                  formatter: () => {
                    return '签到'
                  },
                  show: true,
                  position: 'center',
                  textStyle: {
                    fontSize: '23',
                    fontWeight: 'normal'
                  }
                },
                emphasis: {
                  show: false,
                  textStyle: {
                    fontSize: '16',
                    fontWeight: 'normal'
                  }
                }
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              data: []
            }
          ]
        },
        marryOption2Legends: [],
        marryOption2: {
          tooltip: {
            trigger: 'item',
            formatter: '{b}: {c} ({d}%)'
          },
          series: [
            {
              name: '签到',
              type: 'pie',
              radius: ['60%', '80%'],
              color: color,
              avoidLabelOverlap: false,
              label: {
                normal: {
                  formatter: () => {
                    return '签到'
                  },
                  show: true,
                  position: 'center',
                  textStyle: {
                    fontSize: '23',
                    fontWeight: 'normal'
                  }
                },
                emphasis: {
                  show: false,
                  textStyle: {
                    fontSize: '16',
                    fontWeight: 'normal'
                  }
                }
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              data: []
            }
          ]
        },
        marryOption3Legends: [],
        marryOption3: {
          tooltip: {
            trigger: 'item',
            formatter: '{b}: {c} ({d}%)'
          },
          series: [
            {
              name: '签到',
              type: 'pie',
              radius: ['60%', '80%'],
              color: color,
              avoidLabelOverlap: false,
              label: {
                normal: {
                  formatter: () => {
                    return '签到'
                  },
                  show: true,
                  position: 'center',
                  textStyle: {
                    fontSize: '23',
                    fontWeight: 'normal'
                  }
                },
                emphasis: {
                  show: false,
                  textStyle: {
                    fontSize: '16',
                    fontWeight: 'normal'
                  }
                }
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              data: []
            }
          ]
        },
        marryOption4Legends: [],
        marryOption4: {
          tooltip: {
            trigger: 'item',
            formatter: '{b}: {c} ({d}%)'
          },
          series: [
            {
              name: '签到',
              type: 'pie',
              radius: ['60%', '80%'],
              color: color,
              avoidLabelOverlap: false,
              label: {
                normal: {
                  formatter: () => {
                    return '签到'
                  },
                  show: true,
                  position: 'center',
                  textStyle: {
                    fontSize: '23',
                    fontWeight: 'normal'
                  }
                },
                emphasis: {
                  show: false,
                  textStyle: {
                    fontSize: '16',
                    fontWeight: 'normal'
                  }
                }
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              data: []
            }
          ]
        },
        marryOption5Legends: [],
        marryOption5: {
          tooltip: {
            trigger: 'item',
            formatter: '{b}: {c} ({d}%)'
          },
          series: [
            {
              name: '签到',
              type: 'pie',
              radius: ['60%', '80%'],
              color: color,
              avoidLabelOverlap: false,
              label: {
                normal: {
                  formatter: () => {
                    return '签到'
                  },
                  show: true,
                  position: 'center',
                  textStyle: {
                    fontSize: '23',
                    fontWeight: 'normal'
                  }
                },
                emphasis: {
                  show: false,
                  textStyle: {
                    fontSize: '16',
                    fontWeight: 'normal'
                  }
                }
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              data: []
            }
          ]
        },
        marryOption6Legends: [],
        marryOption6: {
          tooltip: {
            trigger: 'item',
            formatter: '{b}: {c} ({d}%)'
          },
          series: [
            {
              name: '签到',
              type: 'pie',
              radius: ['60%', '80%'],
              color: color,
              avoidLabelOverlap: false,
              label: {
                normal: {
                  formatter: () => {
                    return '签到'
                  },
                  show: true,
                  position: 'center',
                  textStyle: {
                    fontSize: '23',
                    fontWeight: 'normal'
                  }
                },
                emphasis: {
                  show: false,
                  textStyle: {
                    fontSize: '16',
                    fontWeight: 'normal'
                  }
                }
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              data: []
            }
          ]
        }
      }
    },
    created () {
      this.loadData()
    },
    mounted () {
    },
    destroyed () {
    },
    computed: {
      ...mapGetters(['getPage'])
    },
    methods: {
      ...mapActions(['loadHLActivity', 'deleteHLActivity', 'goBack']),
      loadData () {
        // 加载会员统计数据
        this.vipOption1Legends = [
          {
            name: '男',
            value: 203
          },
          {
            name: '女',
            value: 320
          }
        ]
        this.vipOption1.series[0].data = this.vipOption1Legends
        this.vipOption2Legends = [
          {
            name: '男',
            value: 203
          },
          {
            name: '女',
            value: 320
          }
        ]
        this.vipOption2.series[0].data = this.vipOption2Legends
        // 婚姻状况统计图
        this.marryOption1Legends = [
          {
            name: '男',
            value: 1454
          },
          {
            name: '女',
            value: 3220
          }
        ]
        this.marryOption1.series[0].data = this.marryOption1Legends
        this.marryOption2Legends = [
          {
            name: '男',
            value: 1454
          },
          {
            name: '女',
            value: 3220
          }
        ]
        this.marryOption2.series[0].data = this.marryOption2Legends
        this.marryOption3Legends = [
          {
            name: '男',
            value: 1454
          },
          {
            name: '女',
            value: 3220
          }
        ]
        this.marryOption3.series[0].data = this.marryOption3Legends
        this.marryOption4Legends = [
          {
            name: '男',
            value: 1454
          },
          {
            name: '女',
            value: 3220
          }
        ]
        this.marryOption4.series[0].data = this.marryOption4Legends
        this.marryOption5Legends = [
          {
            name: '男',
            value: 1454
          },
          {
            name: '女',
            value: 3220
          }
        ]
        this.marryOption5.series[0].data = this.marryOption5Legends
        this.marryOption6Legends = [
          {
            name: '男',
            value: 1454
          },
          {
            name: '女',
            value: 3220
          }
        ]
        this.marryOption6.series[0].data = this.marryOption6Legends
      },
      getPercentHand2Hand (value) {
        return this._getPercent(value, this.hand2handLegends)
      },
      getPercentVip1 (value) {
        return this._getPercent(value, this.vipOption1Legends)
      },
      getPercentVip2 (value) {
        return this._getPercent(value, this.vipOption2Legends)
      },
      getColor (index) {
        return getColor(index)
      },
      getHand2HandCount () {
        return this._getCount(this.hand2handLegends)
      },
      _getCount (list) {
        let sum = 0
        for (let item of list) {
          sum += item.value
        }
        return sum
      },
      _getPercent (value, list) {
        let sum = this._getCount(list)
        return ((value / sum) * 100).toFixed(2)
      }
    }
  }
</script>

<style lang="less">
  @import "../common/common";

  @chartTopHeight1: 153px;
  @chartTopHeight2: 253px;

  // div盒子发光
  .box-light {
    box-shadow: 0px 0px 8px 2px #F1F3F5;
  }
  #census {
    .pillars {
      width: 100%;
      height: inherit;
      .pillar {
        width: calc(~"(100% - 30px) / 3");
        height: 100%;
        background-color: #ffffff;
        overflow-y: auto;
        float: left;
        margin-right: 15px;
        padding: 10px;
        box-sizing: border-box;
        position: relative;
        &:last-child {
          margin-right: 0px;
        }
        .counters {
          width: 100%;
          height: @chartTopHeight1;
          .counter {
            width: calc(~"(100% - 15px) / 2");
            margin-right: 15px;
            text-align: center;
            float: left;
            height: @chartTopHeight1;
            &:last-child {
              margin-right: 0px;
            }
            .count {
              font-size: 50px;
              color: #34393D;
              margin-top: 27px;
            }
            .label {
              color: #939292;
            }
          }
        }
        .box-chart-top {

        }
        .box-chart-top2 {
          height: @chartTopHeight2;
          .items {
            width: 50%;
            height: 100%;
            float: left;
            .echarts {
              float: left;
              width: 100%;
              height: calc(~"100% - 106px");
            }
          }
        }
        .box-chart-top3 {
          height: 100%;
          .items {
            width: 50%;
            height: calc(~"(100% - 106px) / 3");
            float: left;
            .echarts {
              float: left;
              width: 100%;
              height: 200px;
            }
          }
        }
        .box-chart-footer {
          margin-top: 15px;
        }
        .box-chart-footer1 {
          height: calc(~"100% - 15px - " @chartTopHeight1);
        }
        .box-chart-footer2 {
          height: calc(~"100% - 15px - " @chartTopHeight2);
        }
        .box-chart {
          .title-chart {
            height: 56px;
            line-height: 56px;
            padding-left: 20px;
            font-weight: bold;
            font-size: 16px;
            color: #9AAFBF;
          }
          .legends {
            box-sizing: border-box;
            width: 100%;
            float: left;
            padding: 0 20px;
            .legend {
              width: 50%;
              font-size: 14px;
              color: #050505;
              float: left;
              .left {
                .color, .value {
                  float: left;
                }
                .color {
                  margin-right: 8px;
                  margin-top: 3px;
                  width: 14px;
                  height: 14px;
                  border-radius: 50%;
                }
              }
              .right {
                float: right;
              }
            }
          }
        }
      }
    }
  }
</style>
