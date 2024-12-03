<template>
    <div class="diy-percent-pond" ref="percentPondRef">
      <svg>
        <defs>
          <linearGradient :id="gradientId1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop v-for="lc in linearGradient" :key="lc[0]"
              :offset="`${lc[0]}%`"
              :stop-color="lc[1]" />
          </linearGradient>
  
          <linearGradient :id="gradientId2" x1="0%" y1="0%" :x2="gradient2XPos" y2="0%">
            <stop v-for="lc in linearGradient" :key="lc[0]"
              :offset="`${lc[0]}%`"
              :stop-color="lc[1]" />
          </linearGradient>
        </defs>
        <rect
          :x="mergedConfig ? mergedConfig.borderWidth / 2 : '0'"
          :y="mergedConfig ? mergedConfig.borderWidth / 2 : '0'"
          :rx="mergedConfig ? mergedConfig.borderRadius : '0'"
          :ry="mergedConfig ? mergedConfig.borderRadius : '0'"
          fill="transparent"
          :stroke-width="mergedConfig ? mergedConfig.borderWidth : '0'"
          :stroke="`url(#${gradientId1})`"
          :width="rectWidth > 0 ? rectWidth : 0"
          :height="rectHeight > 0 ? rectHeight : 0"
        />
        <polyline
          :stroke-width="polylineWidth"
          :stroke-dasharray="mergedConfig ? mergedConfig.lineDash.join(',') : '0'"
          :stroke="`url(#${polylineGradient})`"
          :points="points"
        />
        <text
          :stroke="mergedConfig ? mergedConfig.textColor : '#fff'"
          :fill="mergedConfig ? mergedConfig.textColor : '#fff'"
          :x="width / 2"
          :y="height / 2"
        >
          {{ details }}
        </text>
      </svg>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, watch, onMounted } from 'vue'
  import { useElementSize } from '@vueuse/core'
  import { merge, cloneDeep } from 'lodash'
  import { uuid } from '../util'
  
  const props = defineProps({
    config: {
      type: Object,
      default: () => ({})
    }
  })
  
  const percentPondRef = ref(null)
  const { width, height } = useElementSize(percentPondRef)
  
  const id = uuid()
  const gradientId1 = `percent-pond-gradientId1-${id}`
  const gradientId2 = `percent-pond-gradientId2-${id}`
  
  const defaultConfig = {
    value: 0,
    colors: ['#3DE7C9', '#00BAFF'],
    borderWidth: 3,
    borderGap: 3,
    lineDash: [5, 1],
    textColor: '#fff',
    borderRadius: 5,
    localGradient: false,
    formatter: '{value}%'
  }
  
  const mergedConfig = ref(null)
  
  const rectWidth = computed(() => {
    if (!mergedConfig.value) return 0
    return width.value - mergedConfig.value.borderWidth
  })
  
  const rectHeight = computed(() => {
    if (!mergedConfig.value) return 0
    return height.value - mergedConfig.value.borderWidth
  })
  
  const points = computed(() => {
    if (!mergedConfig.value) return `0, ${height.value / 2} 0, ${height.value / 2}`
  
    const { borderWidth, borderGap, value } = mergedConfig.value
    const halfHeight = height.value / 2
    const polylineLength = (width.value - (borderWidth + borderGap) * 2) / 100 * value
  
    return `
      ${borderWidth + borderGap}, ${halfHeight}
      ${borderWidth + borderGap + polylineLength}, ${halfHeight + 0.001}
    `
  })
  
  const polylineWidth = computed(() => {
    if (!mergedConfig.value) return 0
    const { borderWidth, borderGap } = mergedConfig.value
    return height.value - (borderWidth + borderGap) * 2
  })
  
  const linearGradient = computed(() => {
    if (!mergedConfig.value) return []
    const { colors } = mergedConfig.value
    const colorNum = colors.length
    const colorOffsetGap = 100 / (colorNum - 1)
    return colors.map((c, i) => [colorOffsetGap * i, c])
  })
  
  const polylineGradient = computed(() => {
    if (!mergedConfig.value) return gradientId2
    return mergedConfig.value.localGradient ? gradientId1 : gradientId2
  })
  
  const gradient2XPos = computed(() => {
    if (!mergedConfig.value) return '100%'
    return `${200 - mergedConfig.value.value}%`
  })
  
  const details = computed(() => {
    if (!mergedConfig.value) return ''
    const { value, formatter } = mergedConfig.value
    return formatter.replace('{value}', value)
  })
  
  const mergeConfig = () => {
    mergedConfig.value = merge(cloneDeep(defaultConfig), props.config || {})
  }
  
  watch(() => props.config, mergeConfig)
  
  onMounted(() => {
    mergeConfig()
  })
  </script>
  
  <style scoped>
  .diy-percent-pond {
    position: relative;
    display: flex;
    flex-direction: column;
  }
  
  .diy-percent-pond svg {
    position: absolute;
    left: 0px;
    top: 0px;
    width: 100%;
    height: 100%;
  }
  
  .diy-percent-pond :deep(polyline) {
    transition: all 0.3s;
  }
  
  .diy-percent-pond :deep(text) {
    font-size: 25px;
    font-weight: bold;
    text-anchor: middle;
  }
  </style>
  
  