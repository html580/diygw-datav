<template>
  <div
    class="diy-flyline-chart-enhanced"
    :style="`background-image: url(${mergedConfig ? mergedConfig.bgImgSrc : ''})`"
    ref="chartRef"
    @click="consoleClickPos"
  >
    <svg v-if="flylines.length" :width="width" :height="height">
      <defs>
        <radialGradient
          :id="flylineGradientId"
          cx="50%" cy="50%" r="50%"
        >
          <stop
            offset="0%" stop-color="#fff"
            stop-opacity="1"
          />
          <stop
            offset="100%" stop-color="#fff"
            stop-opacity="0"
          />
        </radialGradient>

        <radialGradient
          :id="haloGradientId"
          cx="50%" cy="50%" r="50%"
        >
          <stop
            offset="0%" stop-color="#fff"
            stop-opacity="0"
          />
          <stop
            offset="100%" stop-color="#fff"
            stop-opacity="1"
          />
        </radialGradient>
      </defs>

      <!-- points -->
      <g v-for="point in flylinePoints" :key="point.key + Math.random()">
        <defs>
          <circle
            v-if="point.halo.show"
            :id="`halo${unique}${point.key}`"
            :cx="point.coordinate[0]"
            :cy="point.coordinate[1]"
          >
            <animate
              attributeName="r"
              :values="`1;${point.halo.radius}`"
              :dur="`${point.halo.time}s`"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="1;0"
              :dur="`${point.halo.time}s`"
              repeatCount="indefinite"
            />
          </circle>
        </defs>

        <!-- halo gradient mask -->
        <mask :id="`mask${unique}${point.key}`">
          <use
            v-if="point.halo.show"
            :xlink:href="`#halo${unique}${point.key}`"
            :fill="`url(#${haloGradientId})`"
          />
        </mask>

        <!-- point halo -->
        <use
          v-if="point.halo.show"
          :xlink:href="`#halo${unique}${point.key}`"
          :fill="point.halo.color"
          :mask="`url(#mask${unique}${point.key})`"
        />

        <!-- point icon -->
        <image
          v-if="point.icon.show"
          :xlink:href="point.icon.src"
          :width="point.icon.width"
          :height="point.icon.height"
          :x="point.icon.x"
          :y="point.icon.y"
        />

        <!-- point text -->
        <text
          v-if="point.text.show"
          :style="`font-size:${point.text.fontSize}px;color:${point.text.color}`"
          :fill="point.text.color"
          :x="point.text.x"
          :y="point.text.y"
        >
          {{ point.name }}
        </text>
      </g>

      <!-- flylines -->
      <g v-for="(line, i) in flylines" :key="line.key + Math.random()">
        <defs>
          <path
            :id="line.key"
            :ref="el => { if (el) pathRefs[i] = el }"
            :d="line.d"
            fill="transparent"
          />
        </defs>

        <!-- orbit line -->
        <use
          :xlink:href="`#${line.key}`"
          :stroke-width="line.width"
          :stroke="line.orbitColor"
        />

        <!-- fly line gradient mask -->
        <mask :id="`mask${unique}${line.key}`">
          <circle cx="0" cy="0" :r="line.radius" :fill="`url(#${flylineGradientId})`">
            <animateMotion
              :dur="line.time"
              :path="line.d"
              rotate="auto"
              repeatCount="indefinite"
            />
          </circle>
        </mask>

        <!-- fly line -->
        <use
          v-if="flylineLengths[i]"
          :xlink:href="`#${line.key}`"
          :stroke-width="line.width"
          :stroke="line.color"
          :mask="`url(#mask${unique}${line.key})`"
        >
          <animate
            attributeName="stroke-dasharray"
            :from="`0, ${flylineLengths[i]}`"
            :to="`${flylineLengths[i]}, 0`"
            :dur="line.time"
            repeatCount="indefinite"
          />
        </use>
      </g>
    </svg>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, nextTick } from 'vue'
import { useElementSize } from '@vueuse/core'
import { merge, cloneDeep } from 'lodash'
import { randomExtend, getPointDistance, uuid } from '../util'

const props = defineProps({
  config: {
    type: Object,
    default: () => ({})
  },
  dev: {
    type: Boolean,
    default: false
  }
})

const chartRef = ref(null)
const { width, height } = useElementSize(chartRef)

const unique = Math.random()
const id = uuid()
const flylineGradientId = `flyline-gradient-id-${id}`
const haloGradientId = `halo-gradient-id-${id}`

const defaultConfig = {
  points: [],
  lines: [],
  halo: {
    show: false,
    duration: [20, 30],
    color: '#fb7293',
    radius: 120
  },
  text: {
    show: false,
    offset: [0, 15],
    color: '#ffdb5c',
    fontSize: 12
  },
  icon: {
    show: false,
    src: '',
    width: 15,
    height: 15
  },
  line: {
    width: 1,
    color: '#ffde93',
    orbitColor: 'rgba(103, 224, 227, .2)',
    duration: [20, 30],
    radius: 100
  },
  bgImgSrc: '',
  k: -0.5,
  curvature: 5,
  relative: true
}

const mergedConfig = ref(null)
const flylines = ref([])
const flylineLengths = ref([])
const flylinePoints = ref([])
const pathRefs = reactive([])

const mergeConfig = () => {
  mergedConfig.value = merge(cloneDeep(defaultConfig), props.config || {})
  const { points, lines, halo, text, icon, line } = mergedConfig.value

  mergedConfig.value.points = points.map(item => ({
    ...item,
    halo: merge(cloneDeep(halo), item.halo || {}),
    text: merge(cloneDeep(text), item.text || {}),
    icon: merge(cloneDeep(icon), item.icon || {})
  }))

  mergedConfig.value.lines = lines.map(item => merge(cloneDeep(line), item))
}

const calcFlylinePoints = () => {
  const { relative, points } = mergedConfig.value

  flylinePoints.value = points.map((item, i) => {
    const { coordinate: [x, y], halo, icon, text } = item

    if (relative) item.coordinate = [x * width.value, y * height.value]

    item.halo.time = randomExtend(...halo.duration) / 10

    const { width: iw, height: ih } = icon
    item.icon.x = item.coordinate[0] - iw / 2
    item.icon.y = item.coordinate[1] - ih / 2

    const [ox, oy] = text.offset
    item.text.x = item.coordinate[0] + ox
    item.text.y = item.coordinate[1] + oy

    item.key = `${item.coordinate.toString()}${i}`

    return item
  })
}

const getPath = (start, end) => {
  const controlPoint = getControlPoint(start, end)
  return [start, controlPoint, end]
}

const getControlPoint = ([sx, sy], [ex, ey]) => {
  const { curvature, k } = mergedConfig.value
  const [mx, my] = [(sx + ex) / 2, (sy + ey) / 2]
  const distance = getPointDistance([sx, sy], [ex, ey])
  const targetLength = distance / curvature
  const disDived = targetLength / 2
  let [dx, dy] = [mx, my]

  do {
    dx += disDived
    dy = getKLinePointByx(k, [mx, my], dx)[1]
  } while (getPointDistance([mx, my], [dx, dy]) < targetLength)

  return [dx, dy]
}

const getKLinePointByx = (k, [lx, ly], x) => {
  const y = ly - k * lx + k * x
  return [x, y]
}

const calcLinePaths = () => {
  const { points, lines } = mergedConfig.value

  flylines.value = lines.map(item => {
    const { source, target, duration } = item
    const sourcePoint = points.find(({ name }) => name === source).coordinate
    const targetPoint = points.find(({ name }) => name === target).coordinate

    const path = getPath(sourcePoint, targetPoint).map(item => item.map(v => parseFloat(v.toFixed(10))))
    const d = `M${path[0].toString()} Q${path[1].toString()} ${path[2].toString()}`
    const key = `path${path.toString()}`
    const time = randomExtend(...duration) / 10

    return { ...item, path, key, d, time }
  })
}

const calcLineLengths = async () => {
  await nextTick()
  flylineLengths.value = pathRefs.map(path => path.getTotalLength())
}

const calcData = async () => {
  mergeConfig()
  calcFlylinePoints()
  calcLinePaths()
  await calcLineLengths()
}

const consoleClickPos = ({ offsetX, offsetY }) => {
  if (!props.dev) return
  const relativeX = (offsetX / width.value).toFixed(2)
  const relativeY = (offsetY / height.value).toFixed(2)
  console.warn(`diy-flyline-chart-enhanced DEV: \n Click Position is [${offsetX}, ${offsetY}] \n Relative Position is [${relativeX}, ${relativeY}]`)
}

watch(() => props.config, calcData)

watch([width, height], calcData)

onMounted(calcData)
</script>

<style scoped>
.diy-flyline-chart-enhanced {
  display: flex;
  flex-direction: column;
  background-size: 100% 100%;
}

.diy-flyline-chart-enhanced :deep(text) {
  text-anchor: middle;
  dominant-baseline: middle;
}
</style>