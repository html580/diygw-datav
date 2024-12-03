<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
import BorderBox1 from './components/BorderBox1.vue'
import BorderBox2 from './components/BorderBox2.vue'
import BorderBox3 from './components/BorderBox3.vue'
import BorderBox4 from './components/BorderBox4.vue'
import BorderBox5 from './components/BorderBox5.vue'
import BorderBox6 from './components/BorderBox6.vue'
import BorderBox7 from './components/BorderBox7.vue'
import BorderBox8 from './components/BorderBox8.vue'
import BorderBox9 from './components/BorderBox9.vue'
import BorderBox10 from './components/BorderBox10.vue'
import BorderBox11 from './components/BorderBox11.vue'
import BorderBox12 from './components/BorderBox12.vue'
import BorderBox13 from './components/BorderBox13.vue'
import Decoration1 from './components/Decoration1.vue'
import Decoration2 from './components/Decoration2.vue'
import Decoration3 from './components/Decoration3.vue'
import Decoration4 from './components/Decoration4.vue'
import Decoration5 from './components/Decoration5.vue'
import Decoration6 from './components/Decoration6.vue'
import Decoration7 from './components/Decoration7.vue'
import Decoration8 from './components/Decoration8.vue'
import Decoration9 from './components/Decoration9.vue'
import Decoration10 from './components/Decoration10.vue'
import Decoration11 from './components/Decoration11.vue'
import Decoration12 from './components/Decoration12.vue'
import ScrollBoard from './components/ScrollBoard.vue'
import ConicalColumnChart from './components/ConicalColumnChart.vue'
import FlylineChart from './components/FlylineChart.vue'
import FlylineChartEnhanced from './components/FlylineChartEnhanced.vue'
import ScrollRankingBoard from './components/ScrollRankingBoard.vue'
import PercentPond from './components/PercentPond.vue'
import CapsuleChart from './components/CapsuleChart.vue'
import CountUp from './components/CountUp.vue'
import { ref } from 'vue'
import type { ICountUp, CountUpOptions } from './components/CountUp.vue'

const startValueRef = ref(0)
const endValueRef = ref(2022.22)
const options: CountUpOptions = {
  separator: '❤️',
  onCompleteCallback() {
    console.log('onCompleteCallback finished !!!')
  }
}
let countUp: ICountUp | undefined
const onInit = (ctx: ICountUp) => {
  countUp = ctx
}
const onFinished = () => {
  console.log('finished!!!')
}

const countupRef = ref<InstanceType<typeof CountUp>>()
const restart = () => {
  countupRef.value?.restart()
}

const changeStartVal = () => {
  startValueRef.value += 1000
}

const changeEndVal = () => {
  endValueRef.value += 1000
}
const config = ref( {
  header: ['列1', '列2', '列3'],
  data: [
    ['行1列1', '行1列2', '行1列3'],
    ['行2列1', '行2列2', '行2列3'],
    ['行3列1', '行3列2', '行3列3'],
    ['行4列1', '行4列2', '行4列3'],
    ['行5列1', '行5列2', '行5列3'],
    ['行6列1', '行6列2', '行6列3'],
    ['行7列1', '行7列2', '行7列3'],
    ['行8列1', '行8列2', '行8列3'],
    ['行9列1', '行9列2', '行9列3'],
    ['行10列1', '行10列2', '行10列3']
  ]
})

const conicalconfig = ref({
  data: [
    {
      name: '周口',
      value: 55
    },
    {
      name: '南阳',
      value: 120
    },
    {
      name: '西峡',
      value: 71
    },
    {
      name: '驻马店',
      value: 66
    },
    {
      name: '新乡',
      value: 80
    },
    {
      name: '信阳',
      value: 35
    },
    {
      name: '漯河',
      value: 15
    }
  ],
  img: [
    '/img/conicalColumnChart/1st.png',
    '/img/conicalColumnChart/2st.png',
    '/img/conicalColumnChart/3st.png',
    '/img/conicalColumnChart/4st.png',
    '/img/conicalColumnChart/5st.png',
    '/img/conicalColumnChart/6st.png',
    '/img/conicalColumnChart/7st.png'
  ]
})

const flylineChartConfig= {
  centerPoint: [0.48, 0.35],
  points: [
    [0.52, 0.23],
    [0.43, 0.29],
    [0.59, 0.35],
    [0.53, 0.47],
    [0.45, 0.54],
    [0.36, 0.38],
    [0.62, 0.55],
    [0.56, 0.56],
    [0.37, 0.66],
    [0.55, 0.81],
    [0.55, 0.67],
    [0.37, 0.29],
    [0.20, 0.36],
    [0.76, 0.41],
    [0.59, 0.18],
    [0.68, 0.17],
    [0.59, 0.10]
  ],
  bgImgUrl: '/img/flylineChart/map.png',
  centerPointImg: {
    url: '/img/flylineChart/mapCenterPoint.png'
  },
  pointsImg: {
    url: '/img/flylineChart/mapPoint.png'
  }
};

const flylineChartEnhancedConfig={
  points: [
    {
      name: '郑州',
      coordinate: [0.48, 0.35],
      halo: {
        show: true,
      },
      icon: {
        src: '/img/flylineChart/mapCenterPoint.png',
        width: 30,
        height: 30
      },
      text: {
        show: false
      }
    },
    {
      name: '新乡',
      coordinate: [0.52, 0.23]
    },
    {
      name: '焦作',
      coordinate: [0.43, 0.29]
    },
    {
      name: '开封',
      coordinate: [0.59, 0.35]
    },
    {
      name: '许昌',
      coordinate: [0.53, 0.47]
    },
    {
      name: '平顶山',
      coordinate: [0.45, 0.54]
    },
    {
      name: '洛阳',
      coordinate: [0.36, 0.38]
    },
    {
      name: '周口',
      coordinate: [0.62, 0.55],
      halo: {
        show: true,
        color: '#8378ea'
      }
    },
    {
      name: '漯河',
      coordinate: [0.56, 0.56]
    },
    {
      name: '南阳',
      coordinate: [0.37, 0.66],
      halo: {
        show: true,
        color: '#37a2da'
      }
    },
    {
      name: '信阳',
      coordinate: [0.55, 0.81]
    },
    {
      name: '驻马店',
      coordinate: [0.55, 0.67]
    },
    {
      name: '济源',
      coordinate: [0.37, 0.29]
    },
    {
      name: '三门峡',
      coordinate: [0.20, 0.36]
    },
    {
      name: '商丘',
      coordinate: [0.76, 0.41]
    },
    {
      name: '鹤壁',
      coordinate: [0.59, 0.18]
    },
    {
      name: '濮阳',
      coordinate: [0.68, 0.17]
    },
    {
      name: '安阳',
      coordinate: [0.59, 0.10]
    }
  ],
  lines: [
    {
      source: '新乡',
      target: '郑州'
    },
    {
      source: '焦作',
      target: '郑州'
    },
    {
      source: '开封',
      target: '郑州'
    },
    {
      source: '周口',
      target: '郑州',
      color: '#fb7293',
      width: 2
    },
    {
      source: '南阳',
      target: '郑州',
      color: '#fb7293',
      width: 2
    },
    {
      source: '济源',
      target: '郑州'
    },
    {
      source: '三门峡',
      target: '郑州'
    },
    {
      source: '商丘',
      target: '郑州'
    },
    {
      source: '鹤壁',
      target: '郑州'
    },
    {
      source: '濮阳',
      target: '郑州'
    },
    {
      source: '安阳',
      target: '郑州'
    },
    {
      source: '许昌',
      target: '南阳',
      color: '#37a2da'
    },
    {
      source: '平顶山',
      target: '南阳',
      color: '#37a2da'
    },
    {
      source: '洛阳',
      target: '南阳',
      color: '#37a2da'
    },
    {
      source: '驻马店',
      target: '周口',
      color: '#8378ea'
    },
    {
      source: '信阳',
      target: '周口',
      color: '#8378ea'
    },
    {
      source: '漯河',
      target: '周口',
      color: '#8378ea'
    }
  ],
  icon: {
    show: true,
    src: '/img/flylineChart/mapPoint.png'
  },
  text: {
    show: true,
  },
  k: 0.5,
  bgImgSrc: '/img/flylineChart/map.png'
}

const scrollRankingBoardConfig={
  data: [
    {
      name: '周口',
      value: 55123
    },
    {
      name: '南阳',
      value: 12022
    },
    {
      name: '西峡',
      value: 78932
    },
    {
      name: '驻马店',
      value: 63411
    },
    {
      name: '新乡',
      value: 44231
    },
    {
      name: '新乡1',
      value: 42231
    },
    {
      name: '新乡1',
      value: 40231
    }
  ]
}

const percentPondConfig={
  value: 66,
  lineDash: [10, 2]
}

const capsuleChartConfig={
  data: [
    {
      name: '南阳',
      value: 167
    },
    {
      name: '周口',
      value: 123
    },
    {
      name: '漯河',
      value: 98
    },
    {
      name: '郑州',
      value: 75
    },
    {
      name: '西峡',
      value: 66
    },
  ],
  colors: ['#e062ae', '#fb7293', '#e690d1', '#32c5e9', '#96bfff'],
  unit: '单位'
}
</script>

<template>
  <div>
    <a href="https://www.diygw.com" target="_blank">
      <img src="https://lib.diygw.com/themes/design/images/logo.png" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <DiygwBorderBox1 style="width:100%;height:300px">221</DiygwBorderBox1>
  <BorderBox1 style="width:100%;height:300px">1</BorderBox1>
  <BorderBox2 style="width:100%;height:300px">2</BorderBox2>
  <BorderBox3 style="width:100%;height:300px">3</BorderBox3>
  <BorderBox4 style="width:100%;height:300px">4</BorderBox4>
  <BorderBox5 style="width:100%;height:300px">5</BorderBox5>
  <BorderBox6 style="width:100%;height:300px">6</BorderBox6>
  <BorderBox7 style="width:100%;height:300px">7</BorderBox7>
  <BorderBox8 style="width:100%;height:300px">8</BorderBox8>
  <BorderBox9 style="width:100%;height:300px">9</BorderBox9>
  <BorderBox10 style="width:100%;height:300px">10</BorderBox10>
  <BorderBox11 style="width:100%;height:300px">11</BorderBox11>
  <BorderBox12 style="width:100%;height:300px">12</BorderBox12>
  <BorderBox13 style="width:100%;height:300px">13</BorderBox13>
  <Decoration1 style="width:100%;height:80px"></Decoration1>
  <Decoration2 style="width:100%;height:80px"></Decoration2>
  <Decoration3 style="width:100%;height:80px"></Decoration3>
  <Decoration4 style="width:100%;height:80px"></Decoration4>
  <Decoration5 style="width:100%;height:80px"></Decoration5>
  <Decoration6 style="width:100%;height:80px"></Decoration6>
  <Decoration7 style="width:150px; height:30px;">Decoration</Decoration7>
  <Decoration8 style="width:100%;height:80px"></Decoration8>
  <Decoration9 style="width:150px; height:150px;">66%</Decoration9>
  <Decoration10 style="width:100%;height:80px"></Decoration10>
  <Decoration11 style="width:100%;height:80px"></Decoration11>
  <Decoration12 style="width:80px;height:80px"></Decoration12>
  <scroll-board :config="config" style="width:500px;height:220px" />
  <ConicalColumnChart :config="conicalconfig" style="width:400px;height:200px;" />
  <FlylineChart :config="flylineChartConfig" style="width:100%;height:300px;" />
  <FlylineChartEnhanced :config="flylineChartEnhancedConfig" style="width:100%;height:300px;" />
  <ScrollRankingBoard  :config="scrollRankingBoardConfig" style="width:500px;height:300px" />
  <PercentPond  :config="percentPondConfig" style="width:500px;height:100px"></PercentPond>
  <CapsuleChart :config="capsuleChartConfig" style="width:500px;height:300px"></CapsuleChart>
  <CountUp :startVal='0' :endVal='2022' :duration="4"></CountUp>

  <button @click="restart">restart</button>
  <button @click="changeStartVal">change startVal</button>
  <button @click="changeEndVal">change endVal</button>
  <count-up
    ref="countupRef"
    :start-val="startValueRef"
    :end-val="endValueRef"
    :duration="2.5"
    :decimal-places="2"
    :options="options"
    :loop="2"
    :delay="2"
    @init="onInit"
    @finished="onFinished">
    <template #prefix>
      <span style="color: orange">前缀</span>
    </template>
    <template #suffix>
      <span style="color: red">后缀</span>
    </template>
  </count-up>
  <HelloWorld msg="DIY可视化+Datav兼容VUE3版本" />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}

</style>
<style>
.border-box-content{
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>