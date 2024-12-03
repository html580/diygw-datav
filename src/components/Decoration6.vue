<template>
  <div class="diy-decoration-6" ref="decorationRef">
    <svg :width="`${svgWH[0]}px`" :height="`${svgWH[1]}px`" :style="`transform:scale(${svgScale[0]},${svgScale[1]});`">
      <template v-for="(point, i) in points" :key="i">
        <rect
          :fill="mergedColor[Math.random() > 0.5 ? 0 : 1]"
          :x="point[0] - halfRectWidth"
          :y="point[1] - heights[i] / 2"
          :width="rectWidth"
          :height="heights[i]"
        >
          <animate
            attributeName="y"
            :values="`${point[1] - minHeights[i] / 2};${point[1] - heights[i] / 2};${point[1] - minHeights[i] / 2}`"
            :dur="`${randoms[i]}s`"
            keyTimes="0;0.5;1"
            calcMode="spline"
            keySplines="0.42,0,0.58,1;0.42,0,0.58,1"
            begin="0s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="height"
            :values="`${minHeights[i]};${heights[i]};${minHeights[i]}`"
            :dur="`${randoms[i]}s`"
            keyTimes="0;0.5;1"
            calcMode="spline"
            keySplines="0.42,0,0.58,1;0.42,0,0.58,1"
            begin="0s"
            repeatCount="indefinite"
          />
        </rect>
      </template>
    </svg>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useElementSize } from '@vueuse/core'
import { merge, cloneDeep } from 'lodash'
import { randomExtend } from '../util'

const props = defineProps({
  color: {
    type: Array,
    default: () => []
  }
})

const decorationRef = ref(null)
const { width, height } = useElementSize(decorationRef)

const rectWidth = 7
const halfRectWidth = rectWidth / 2

const svgWH = reactive([300, 35])
const svgScale = reactive([1, 1])

const rowNum = 1
const rowPoints = 40

const points = ref([])
const heights = ref([])
const minHeights = ref([])
const randoms = ref([])

const defaultColor = reactive(['#7acaec', '#7acaec'])
const mergedColor = ref([])

const calcPointsPosition = () => {
  const [w, h] = svgWH

  const horizontalGap = w / (rowPoints + 1)
  const verticalGap = h / (rowNum + 1)

  let newPoints = new Array(rowNum).fill(0).map((_, i) =>
    new Array(rowPoints).fill(0).map((_, j) => [
      horizontalGap * (j + 1), verticalGap * (i + 1)
    ]))

  points.value = newPoints.reduce((all, item) => [...all, ...item], [])
  
  const newHeights = new Array(rowNum * rowPoints)
    .fill(0)
    .map(() => Math.random() > 0.8 ? randomExtend(0.7 * h, h) : randomExtend(0.2 * h, 0.5 * h))
  
  heights.value = newHeights

  minHeights.value = new Array(rowNum * rowPoints)
    .fill(0)
    .map((_, i) => newHeights[i] * Math.random())

  randoms.value = new Array(rowNum * rowPoints)
    .fill(0)
    .map(() => Math.random() + 1.5)
}

const calcScale = () => {
  const [w, h] = svgWH
  svgScale[0] = width.value / w
  svgScale[1] = height.value / h
}

const calcSVGData = () => {
  calcPointsPosition()
  calcScale()
}

const mergeColor = () => {
  mergedColor.value = merge(cloneDeep(defaultColor), props.color || [])
}

watch(() => props.color, mergeColor)

watch([width, height], calcSVGData)

onMounted(() => {
  mergeColor()
  calcSVGData()
})
</script>

<style scoped>
.diy-decoration-6 {
  width: 100%;
  height: 100%;
}

.diy-decoration-6 svg {
  transform-origin: left top;
}
</style>

