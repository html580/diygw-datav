<template>
  <div class="diy-decoration-12" ref="decorationRef">
    <svg :width="width" :height="height">
      <defs>
        <g :id="gId">
          <path
            v-for="(d, i) in pathD"
            :key="d"
            :stroke="pathColor[i]"
            :stroke-width="width / 2"
            fill="transparent"
            :d="d"
          />
        </g>

        <radialGradient
          :id="gradientId"
          cx="50%" cy="50%" r="50%"
        >
          <stop offset="0%" stop-color="transparent" stop-opacity="1" />
          <stop offset="100%" :stop-color="fade(mergedColor[1] || defaultColor[1], 30)" stop-opacity="1" />
        </radialGradient>
      </defs>

      <circle
        v-for="r in circleR"
        :key="r"
        :r="r"
        :cx="x"
        :cy="y"
        :stroke="mergedColor[1]"
        stroke-width="0.5"
        fill="transparent"
      />

      <circle
        r="1"
        :cx="x"
        :cy="y"
        stroke="transparent"
        :fill="`url(#${gradientId})`"
      >
        <animate
          attributeName="r"
          :values="`1;${width / 2}`"
          :dur="`${props.haloDur}s`"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="1;0"
          :dur="`${props.haloDur}s`"
          repeatCount="indefinite"
        />
      </circle>

      <circle
        r="2"
        :cx="x"
        :cy="y"
        :fill="mergedColor[1]"
      />

      <g v-if="showSplitLine">
        <polyline
          v-for="p in splitLinePoints"
          :key="p"
          :points="p"
          :stroke="mergedColor[1]"
          stroke-width="0.5"
          opacity="0.5"
        />
      </g>

      <path
        v-for="d in arcD"
        :key="d"
        :d="d"
        :stroke="mergedColor[1]"
        stroke-width="2"
        fill="transparent"
      />

      <use :xlink:href="`#${gId}`">
        <animateTransform
          attributeName="transform"
          type="rotate"
          :values="`0, ${x} ${y};360, ${x} ${y}`"
          :dur="`${props.scanDur}s`"
          repeatCount="indefinite"
        />
      </use>
    </svg>

    <div class="decoration-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useElementSize } from '@vueuse/core'
import { merge, cloneDeep } from 'lodash'
import { fade } from '@jiaminghi/color'
import { uuid,getCircleRadianPoint } from '../util'

const props = defineProps({
  color: {
    type: Array,
    default: () => []
  },
  scanDur: {
    type: Number,
    default: 3
  },
  haloDur: {
    type: Number,
    default: 2
  }
})

const decorationRef = ref(null)
const { width, height } = useElementSize(decorationRef)

const gId = `decoration-12-g-${uuid()}`
const gradientId = `decoration-12-gradient-${uuid()}`

const defaultColor = ['#2783ce', '#2cf7fe']
const mergedColor = ref([])

const pathD = ref([])
const pathColor = ref([])
const circleR = ref([])
const splitLinePoints = ref([])
const arcD = ref([])

const segment = 30
const sectorAngle = Math.PI / 3
const ringNum = 3
const ringWidth = 1
const showSplitLine = true

const x = computed(() => width.value / 2)
const y = computed(() => height.value / 2)

const init = () => {
  mergeColor()
  calcPathD()
  calcPathColor()
  calcCircleR()
  calcSplitLinePoints()
  calcArcD()
}

const mergeColor = () => {
  mergedColor.value = merge(cloneDeep(defaultColor), props.color || [])
}

const calcPathD = () => {
  const startAngle = -Math.PI / 2
  const angleGap = sectorAngle / segment
  const r = width.value / 4
  let lastEndPoints = getCircleRadianPoint(x.value, y.value, r, startAngle)

  pathD.value = new Array(segment)
    .fill('')
    .map((_, i) => {
      const endPoints = getCircleRadianPoint(x.value, y.value, r, startAngle - (i + 1) * angleGap).map(_ => _.toFixed(5))
      const d = `M${lastEndPoints.join(',')} A${r}, ${r} 0 0 0 ${endPoints.join(',')}`
      lastEndPoints = endPoints

      return d
    })
}

const calcPathColor = () => {
  const color = mergedColor.value[0]
  const colorGap = 100 / (segment - 1)

  pathColor.value = new Array(segment)
    .fill(color)
    .map((_, i) => fade(color, 100 - i * colorGap))
}

const calcCircleR = () => {
  const radiusGap = (width.value / 2 - ringWidth / 2) / ringNum

  circleR.value = new Array(ringNum)
    .fill(0)
    .map((_, i) => radiusGap * (i + 1))
}

const calcSplitLinePoints = () => {
  const angleGap = Math.PI / 6
  const r = width.value / 2

  splitLinePoints.value = new Array(6)
    .fill('')
    .map((_, i) => {
      const startAngle = angleGap * (i + 1)
      const endAngle = startAngle + Math.PI
      const startPoint = getCircleRadianPoint(x.value, y.value, r, startAngle)
      const endPoint = getCircleRadianPoint(x.value, y.value, r, endAngle)

      return `${startPoint.join(',')} ${endPoint.join(',')}`
    })
}

const calcArcD = () => {
  const angleGap = Math.PI / 6
  const r = width.value / 2 - 1

  arcD.value = new Array(4)
    .fill('')
    .map((_, i) => {
      const startAngle = angleGap * (3 * i + 1)
      const endAngle = startAngle + angleGap
      const startPoint = getCircleRadianPoint(x.value, y.value, r, startAngle)
      const endPoint = getCircleRadianPoint(x.value, y.value, r, endAngle)

      return `M${startPoint.join(',')} A${x.value}, ${y.value} 0 0 1 ${endPoint.join(',')}`
    })
}

watch(() => props.color, mergeColor)

watch([width, height], init)

onMounted(init)
</script>

<style scoped>
.diy-decoration-12 {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
}

.diy-decoration-12 .decoration-content {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

