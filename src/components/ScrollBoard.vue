<template>
    <div class="diy-scroll-board" ref="scrollBoardRef">
      <div class="header" v-if="header.length && mergedConfig" :style="`background-color: ${mergedConfig.headerBGC};`">
        <div
          class="header-item"
          v-for="(headerItem, i) in header"
          :key="`${headerItem}${i}`"
          :style="`
            height: ${mergedConfig.headerHeight}px;
            line-height: ${mergedConfig.headerHeight}px;
            width: ${widths[i]}px;
          `"
          :align="aligns[i]"
          v-html="headerItem"
        />
      </div>
  
      <div
        v-if="mergedConfig"
        class="rows"
        :style="`height: ${height - (header.length ? mergedConfig.headerHeight : 0)}px;`"
      >
        <div
          class="row-item"
          v-for="(row, ri) in rows"
          :key="`${row.toString()}${row.scroll}`"
          :style="`
            height: ${heights[ri]}px;
            line-height: ${heights[ri]}px;
            background-color: ${mergedConfig[row.rowIndex % 2 === 0 ? 'evenRowBGC' : 'oddRowBGC']};
          `"
        >
          <div
            class="ceil"
            v-for="(ceil, ci) in row.ceils"
            :key="`${ceil}${ri}${ci}`"
            :style="`width: ${widths[ci]}px;`"
            :align="aligns[ci]"
            v-html="ceil"
            @click="emitEvent('click', ri, ci, row, ceil)"
            @mouseenter="handleHover(true, ri, ci, row, ceil)"
            @mouseleave="handleHover(false)"
          />
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
    }
  })
  
  const emit = defineEmits(['click', 'mouseover'])
  
  const scrollBoardRef = ref(null)
  const { width, height } = useElementSize(scrollBoardRef)
  
  const defaultConfig = reactive({
    header: [],
    data: [],
    rowNum: 5,
    headerBGC: '#00BAFF',
    oddRowBGC: '#003B51',
    evenRowBGC: '#0A2732',
    waitTime: 2000,
    headerHeight: 35,
    columnWidth: [],
    align: [],
    index: false,
    indexHeader: '#',
    carousel: 'single',
    hoverPause: true
  })
  
  const mergedConfig = ref(null)
  const header = ref([])
  const rowsData = ref([])
  const rows = ref([])
  const widths = ref([])
  const heights = ref([])
  const avgHeight = ref(0)
  const aligns = ref([])
  const animationIndex = ref(0)
  const animationHandler = ref(null)
  const updater = ref(0)
  const needCalc = ref(false)
  
  const mergeConfig = () => {
    mergedConfig.value = merge(cloneDeep(defaultConfig), props.config || {})
  }
  
  const calcHeaderData = () => {
    let { header: configHeader, index, indexHeader } = mergedConfig.value
  
    if (!configHeader.length) {
      header.value = []
      return
    }
  
    configHeader = [...configHeader]
  
    if (index) configHeader.unshift(indexHeader)
  
    header.value = configHeader
  }
  
  const calcRowsData = () => {
    let { data, index, headerBGC, rowNum } = mergedConfig.value
  
    if (index) {
      data = data.map((row, i) => {
        row = [...row]
        const indexTag = `<span class="index" style="background-color: ${headerBGC};">${i + 1}</span>`
        row.unshift(indexTag)
        return row
      })
    }
  
    data = data.map((ceils, i) => ({ ceils, rowIndex: i }))
  
    const rowLength = data.length
  
    if (rowLength > rowNum && rowLength < 2 * rowNum) {
      data = [...data, ...data]
    }
  
    data = data.map((d, i) => ({ ...d, scroll: i }))
  
    rowsData.value = data
    rows.value = data
  }
  
  const calcWidths = () => {
    const { columnWidth } = mergedConfig.value
  
    const usedWidth = columnWidth.reduce((all, w) => all + w, 0)
  
    let columnNum = 0
    if (rowsData.value[0]) {
      columnNum = rowsData.value[0].ceils.length
    } else if (header.value.length) {
      columnNum = header.value.length
    }
  
    const avgWidth = (width.value - usedWidth) / (columnNum - columnWidth.length)
  
    const newWidths = new Array(columnNum).fill(avgWidth)
  
    widths.value = merge(newWidths, columnWidth)
  }
  
  const calcHeights = (onresize = false) => {
    const { headerHeight, rowNum, data } = mergedConfig.value
  
    let allHeight = height.value
  
    if (header.value.length) allHeight -= headerHeight
  
    const tavgHeight = allHeight / rowNum
  
    avgHeight.value = tavgHeight
  
    if (!onresize) heights.value = new Array(data.length).fill(tavgHeight)
  }
  
  const calcAligns = () => {
    const columnNum = header.value.length
  
    let newAligns = new Array(columnNum).fill('left')
  
    const { align } = mergedConfig.value
  
    aligns.value = merge(newAligns, align)
  }
  
  const animation = async (start = false) => {
    if (needCalc.value) {
      calcRowsData()
      calcHeights()
      needCalc.value = false
    }
  
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
  
    rows.value = newRows.slice(0, carousel === 'page' ? rowNum * 2 : rowNum + 1)
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
  
  const handleHover = (enter, ri, ci, row, ceil) => {
    if (enter) emit('mouseover', { row: row.ceils, ceil, rowIndex: row.rowIndex, columnIndex: ci })
    if (!mergedConfig.value.hoverPause) return
  
    if (enter) {
      stopAnimation()
    } else {
      animation(true)
    }
  }
  
  const emitEvent = (type, ri, ci, row, ceil) => {
    const { ceils, rowIndex } = row
    emit(type, { row: ceils, ceil, rowIndex, columnIndex: ci })
  }
  
  const updateRows = (newRows, newAnimationIndex) => {
    mergedConfig.value = {
      ...mergedConfig.value,
      data: [...newRows]
    }
  
    needCalc.value = true
  
    if (typeof newAnimationIndex === 'number') animationIndex.value = newAnimationIndex
    if (!animationHandler.value) animation(true)
  }
  
  const calcData = () => {
    mergeConfig()
    calcHeaderData()
    calcRowsData()
    calcWidths()
    calcHeights()
    calcAligns()
    animation(true)
  }
  
  watch(() => props.config, () => {
    stopAnimation()
    animationIndex.value = 0
    calcData()
  })
  
  watch([width, height], () => {
    if (!mergedConfig.value) return
    calcWidths()
    calcHeights()
  })
  
  onMounted(calcData)
  onUnmounted(stopAnimation)
  </script>
  
  <style scoped>
.diy-scroll-board {
  position: relative;
  width: 100%;
  height: 100%;
  color: #fff;
}

.diy-scroll-board .text,
.diy-scroll-board .header-item,
.diy-scroll-board .ceil {
  padding: 0 10px;
  box-sizing: border-box;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.diy-scroll-board .header {
  display: flex;
  flex-direction: row;
  font-size: 15px;
}

.diy-scroll-board .header-item {
  transition: all 0.3s;
}

.diy-scroll-board .rows {
  overflow: hidden;
}

.diy-scroll-board .row-item {
  display: flex;
  font-size: 14px;
  transition: all 0.3s;
}

.diy-scroll-board .index {
  border-radius: 3px;
  padding: 0px 3px;
}
  </style>
  
  