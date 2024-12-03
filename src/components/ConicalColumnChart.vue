<template>
    <div class="diy-conical-column-chart" ref="chartRef">
      <svg :width="width" :height="height">
        <g v-for="(item, i) in column" :key="i">
          <path :d="item.d" :fill="mergedConfig.columnColor" />
          <text
            :style="`font-size:${mergedConfig.fontSize}px`"
            :fill="mergedConfig.textColor"
            :x="item.x"
            :y="height - 4"
          >
            {{ item.name }}
          </text>
          <image
            v-if="mergedConfig.img.length"
            :xlink:href="mergedConfig.img[i % mergedConfig.img.length]"
            :width="mergedConfig.imgSideLength"
            :height="mergedConfig.imgSideLength"
            :x="item.x - mergedConfig.imgSideLength / 2"
            :y="item.y - mergedConfig.imgSideLength"
          />
          <text
            v-if="mergedConfig.showValue"
            :style="`font-size:${mergedConfig.fontSize}px`"
            :fill="mergedConfig.textColor"
            :x="item.x"
            :y="item.textY"
          >
            {{ item.value }}
          </text>
        </g>
      </svg>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, computed, watch, onMounted } from 'vue'
  import { useElementSize } from '@vueuse/core'
  import { merge, cloneDeep } from 'lodash'
  
  const props = defineProps({
    config: {
      type: Object,
      default: () => ({})
    }
  })
  
  const chartRef = ref(null)
  const { width, height } = useElementSize(chartRef)
  
  const defaultConfig = {
    data: [],
    img: [],
    fontSize: 12,
    imgSideLength: 30,
    columnColor: 'rgba(0, 194, 255, 0.4)',
    textColor: '#fff',
    showValue: false
  }
  
  const mergedConfig = ref(merge(cloneDeep(defaultConfig), props.config))
  const column = ref([])
  
  const initData = () => {
    let { data } = mergedConfig.value
    data = cloneDeep(data)
  
    data.sort(({ value: a }, { value: b }) => b - a)
  
    const max = data[0] ? data[0].value : 10
  
    mergedConfig.value.data = data.map(item => ({
      ...item,
      percent: item.value / max
    }))
  }
  
  const calcSVGPath = () => {
    const { imgSideLength, fontSize, data } = mergedConfig.value
  
    const itemNum = data.length
    const gap = width.value / (itemNum + 1)
  
    const useAbleHeight = height.value - imgSideLength - fontSize - 5
    const svgBottom = height.value - fontSize - 5
  
    column.value = data.map((item, i) => {
      const { percent } = item
  
      const middleXPos = gap * (i + 1)
      const leftXPos = gap * i
      const rightXpos = gap * (i + 2)
  
      const middleYPos = svgBottom - useAbleHeight * percent
      const controlYPos = useAbleHeight * percent * 0.6 + middleYPos
  
      const d = `
        M${leftXPos}, ${svgBottom}
        Q${middleXPos}, ${controlYPos} ${middleXPos},${middleYPos}
        M${middleXPos},${middleYPos}
        Q${middleXPos}, ${controlYPos} ${rightXpos},${svgBottom}
        L${leftXPos}, ${svgBottom}
        Z
      `
  
      const textY = (svgBottom + middleYPos) / 2 + fontSize / 2
  
      return {
        ...item,
        d,
        x: middleXPos,
        y: middleYPos,
        textY
      }
    })
  }
  
  const calcData = () => {
    mergedConfig.value = merge(cloneDeep(defaultConfig), props.config)
    initData()
    calcSVGPath()
  }
  
  watch(() => props.config, calcData)
  
  watch([width, height], calcSVGPath)
  
  onMounted(calcData)
  </script>
  
  <style scoped>
  .diy-conical-column-chart {
    width: 100%;
    height: 100%;
  }
  
  .diy-conical-column-chart text {
    text-anchor: middle;
  }
  </style>
  
  