<template>
  <div class="diy-decoration-1" ref="decorationRef">
    <svg :width="`${svgWH[0]}px`" :height="`${svgWH[1]}px`" :style="`transform:scale(${svgScale[0]},${svgScale[1]});`">
      <template v-for="(point, i) in points" :key="i">
        <rect
          v-if="Math.random() > 0.6"
          :fill="mergedColor[0]"
          :x="point[0] - halfPointSideLength"
          :y="point[1] - halfPointSideLength"
          :width="pointSideLength"
          :height="pointSideLength"
        >
          <animate
            v-if="Math.random() > 0.6"
            attributeName="fill"
            :values="`${mergedColor[0]};transparent`"
            dur="1s"
            :begin="Math.random() * 2"
            repeatCount="indefinite"
          />
        </rect>
      </template>

      <rect
        v-if="rects[0]"
        :fill="mergedColor[1]"
        :x="rects[0][0] - pointSideLength"
        :y="rects[0][1] - pointSideLength"
        :width="pointSideLength * 2"
        :height="pointSideLength * 2"
      >
        <animate
          attributeName="width"
          :values="`0;${pointSideLength * 2}`"
          dur="2s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="height"
          :values="`0;${pointSideLength * 2}`"
          dur="2s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="x"
          :values="`${rects[0][0]};${rects[0][0] - pointSideLength}`"
          dur="2s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="y"
          :values="`${rects[0][1]};${rects[0][1] - pointSideLength}`"
          dur="2s"
          repeatCount="indefinite"
        />
      </rect>

      <rect
        v-if="rects[1]"
        :fill="mergedColor[1]"
        :x="rects[1][0] - 40"
        :y="rects[1][1] - pointSideLength"
        :width="40"
        :height="pointSideLength * 2"
      >
        <animate
          attributeName="width"
          values="0;40;0"
          dur="2s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="x"
          :values="`${rects[1][0]};${rects[1][0] - 40};${rects[1][0]}`"
          dur="2s"
          repeatCount="indefinite"
        />
      </rect>
    </svg>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useElementSize } from '@vueuse/core'
import { merge, cloneDeep } from 'lodash'

const props = defineProps({
  color: {
    type: Array,
    default: () => []
  }
})

const decorationRef = ref(null)
const { width, height } = useElementSize(decorationRef)

const pointSideLength = 2.5
const halfPointSideLength = pointSideLength / 2

const svgWH = reactive([200, 50])
const svgScale = reactive([1, 1])
const rowNum = 4
const rowPoints = 20

const points = ref([])
const rects = ref([])

const defaultColor = ['#fff', '#0de7c2']
const mergedColor = ref([])

const calcPointsPosition = () => {
  const [w, h] = svgWH
  const horizontalGap = w / (rowPoints + 1)
  const verticalGap = h / (rowNum + 1)

  points.value = new Array(rowNum).fill(0).map((_, i) =>
    new Array(rowPoints).fill(0).map((_, j) => [
      horizontalGap * (j + 1), verticalGap * (i + 1)
    ])).reduce((all, item) => [...all, ...item], [])
}

const calcRectsPosition = () => {
  rects.value = [
    points.value[rowPoints * 2 - 1],
    points.value[rowPoints * 2 - 3]
  ]
}

const calcScale = () => {
  const [w, h] = svgWH
  svgScale[0] = width.value / w
  svgScale[1] = height.value / h
}

const calcSVGData = () => {
  calcPointsPosition()
  calcRectsPosition()
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
.diy-decoration-1 {
  width: 100%;
  height: 100%;
}

.diy-decoration-1 svg {
  transform-origin: left top;
}
</style>

