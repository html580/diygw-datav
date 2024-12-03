<template>
    <div class="diy-scroll-ranking-board" ref="scrollRankingBoardRef">
      <div
        class="row-item"
        v-for="(item, i) in rows"
        :key="item.toString() + item.scroll"
        :style="`height: ${heights[i]}px;`"
      >
        <div class="ranking-info">
          <div class="rank" :style="`color: ${props.rankColor};`">No.{{ item.ranking }}</div>
          <div class="info-name" :style="`color: ${props.infoNameColor};`" v-html="item.name" />
          <div class="ranking-value" :style="`color: ${props.rankingValueColor};`">
            {{ mergedConfig.valueFormatter ? mergedConfig.valueFormatter(item) : item.value + mergedConfig.unit }}
          </div>
        </div>
  
        <div class="ranking-column">
          <div
            class="inside-column"
            :style="`width: ${item.percent}%; background-color: ${props.rankColor};`"
          >
            <div class="shine" />
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, computed, watch, onMounted, onUnmounted } from 'vue'
  import { useElementSize } from '@vueuse/core'
  import { merge, cloneDeep } from 'lodash'
  
  const props = defineProps({
    config: {
      type: Object,
      default: () => ({})
    },
    rankColor: {
      type: String,
      default: '#1370fb'
    },
    infoNameColor: {
      type: String,
      default: '#1370fb'
    },
    rankingValueColor: {
      type: String,
      default: '#1370fb'
    }
  })
  
  const scrollRankingBoardRef = ref(null)
  const { width, height } = useElementSize(scrollRankingBoardRef)
  
  const defaultConfig = {
    data: [],
    rowNum: 5,
    waitTime: 2000,
    carousel: 'single',
    unit: '',
    sort: true,
    valueFormatter: null
  }
  
  const mergedConfig = ref(null)
  const rowsData = ref([])
  const rows = ref([])
  const heights = ref([])
  const animationIndex = ref(0)
  const animationHandler = ref(null)
  const updater = ref(0)
  const avgHeight = ref(0)
  
  const mergeConfig = () => {
    mergedConfig.value = merge(cloneDeep(defaultConfig), props.config || {})
  }
  
  const calcRowsData = () => {
    let { data, rowNum, sort } = mergedConfig.value
  
    if (sort) {
      data.sort(({ value: a }, { value: b }) => b - a)
    }
  
    const values = data.map(({ value }) => value)
    const min = Math.min(...values) || 0
    const minAbs = Math.abs(min)
    const max = Math.max(...values) || 0
    const maxAbs = Math.abs(max)
    const total = max + minAbs
  
    data = data.map((row, i) => ({ ...row, ranking: i + 1, percent: (row.value + minAbs) / total * 100 }))
  
    const rowLength = data.length
  
    if (rowLength > rowNum && rowLength < 2 * rowNum) {
      data = [...data, ...data]
    }
  
    data = data.map((d, i) => ({ ...d, scroll: i }))
  
    rowsData.value = data
    rows.value = data
  }
  
  const calcHeights = (onresize = false) => {
    const { rowNum, data } = mergedConfig.value
    avgHeight.value = height.value / rowNum
  
    if (!onresize) {
      heights.value = new Array(data.length).fill(avgHeight.value)
    }
  }
  
  const animation = async (start = false) => {
    const { waitTime, carousel, rowNum } = mergedConfig.value
    const rowLength = rowsData.value.length
  
    if (rowNum >= rowLength) return
  
    if (start) {
      await new Promise(resolve => setTimeout(resolve, waitTime))
      if (updater.value !== updater.value) return
    }
  
    const animationNum = carousel === 'single' ? 1 : rowNum
  
    let newRows = rowsData.value.slice(animationIndex.value)
    newRows.push(...rowsData.value.slice(0, animationIndex.value))
  
    rows.value = newRows.slice(0, rowNum + 1)
    heights.value = new Array(rowLength).fill(avgHeight.value)
  
    await new Promise(resolve => setTimeout(resolve, 300))
    if (updater.value !== updater.value) return
  
    heights.value.splice(0, animationNum, ...new Array(animationNum).fill(0))
  
    animationIndex.value += animationNum
  
    const back = animationIndex.value - rowLength
    if (back >= 0) animationIndex.value = back
  
    animationHandler.value = setTimeout(animation, waitTime - 300)
  }
  
  const stopAnimation = () => {
    updater.value = (updater.value + 1) % 999999
  
    if (animationHandler.value) {
      clearTimeout(animationHandler.value)
    }
  }
  
  const calcData = () => {
    mergeConfig()
    calcRowsData()
    calcHeights()
    animation(true)
  }
  
  watch(() => props.config, () => {
    stopAnimation()
    calcData()
  })
  
  watch([width, height], () => {
    if (!mergedConfig.value) return
    calcHeights(true)
  })
  
  onMounted(calcData)
  
  onUnmounted(stopAnimation)
  </script>
  
  <style scoped>
  .diy-scroll-ranking-board {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  
  .row-item {
    transition: all 0.3s;
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow: hidden;
  }
  
  .ranking-info {
    display: flex;
    width: 100%;
    font-size: 13px;
  }
  
  .rank {
    width: 40px;
  }
  
  .info-name {
    flex: 1;
    text-align: left;
    padding-right: 10px;
  }
  
  .ranking-column {
    border-bottom: 2px solid rgba(19, 112, 251, 0.5);
    margin-top: 5px;
  }
  
  .inside-column {
    position: relative;
    height: 6px;
    margin-bottom: 2px;
    border-radius: 1px;
    overflow: hidden;
  }
  
  .shine {
    position: absolute;
    left: 0%;
    top: 2px;
    height: 2px;
    width: 50px;
    transform: translateX(-100%);
    background: radial-gradient(rgb(40, 248, 255) 5%, transparent 80%);
    animation: shine 3s ease-in-out infinite alternate;
  }
  
  @keyframes shine {
    80% {
      left: 0%;
      transform: translateX(-100%);
    }
  
    100% {
      left: 100%;
      transform: translateX(0%);
    }
  }
  </style>
  
  