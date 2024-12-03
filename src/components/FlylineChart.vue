<template>
    <div
      class="diy-flyline-chart"
      ref="flylineChartRef"
      :style="`background-image: url(${mergedConfig ? mergedConfig.bgImgUrl : ''})`"
      @click="consoleClickPos"
    >
      <svg v-if="mergedConfig" :width="width" :height="height">
        <defs>
          <radialGradient :id="gradientId" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#fff" stop-opacity="1" />
            <stop offset="100%" stop-color="#fff" stop-opacity="0" />
          </radialGradient>
  
          <radialGradient :id="gradient2Id" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#fff" stop-opacity="0" />
            <stop offset="100%" stop-color="#fff" stop-opacity="1" />
          </radialGradient>
  
          <circle
            v-if="paths[0]"
            :id="`circle${paths[0].toString()}`"
            :cx="paths[0][2][0]"
            :cy="paths[0][2][1]"
          >
            <animate
              attributeName="r"
              :values="`1;${mergedConfig.halo.radius}`"
              :dur="mergedConfig.halo.duration / 10 + 's'"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="1;0"
              :dur="mergedConfig.halo.duration / 10 + 's'"
              repeatCount="indefinite"
            />
          </circle>
        </defs>
  
        <image
          v-if="paths[0]"
          :xlink:href="mergedConfig.centerPointImg.url"
          :width="mergedConfig.centerPointImg.width"
          :height="mergedConfig.centerPointImg.height"
          :x="paths[0][2][0] - mergedConfig.centerPointImg.width / 2"
          :y="paths[0][2][1] - mergedConfig.centerPointImg.height / 2"
        />
  
        <mask :id="`maskhalo${paths[0].toString()}`">
          <use
            v-if="paths[0]"
            :xlink:href="`#circle${paths[0].toString()}`"
            :fill="`url(#${gradient2Id})`"
          />
        </mask>
  
        <use
          v-if="paths[0] && mergedConfig.halo.show"
          :xlink:href="`#circle${paths[0].toString()}`"
          :fill="mergedConfig.halo.color"
          :mask="`url(#maskhalo${paths[0].toString()})`"
        />
  
        <g v-for="(path, i) in paths" :key="i">
          <defs>
            <path
              :id="`path${path.toString()}`"
              :ref="el => { if (el) pathRefs[i] = el }"
              :d="`M${path[0].toString()} Q${path[1].toString()} ${path[2].toString()}`"
              fill="transparent"
            />
          </defs>
  
          <use
            :xlink:href="`#path${path.toString()}`"
            :stroke-width="mergedConfig.lineWidth"
            :stroke="mergedConfig.orbitColor"
          />
  
          <use
            v-if="lengths[i]"
            :xlink:href="`#path${path.toString()}`"
            :stroke-width="mergedConfig.lineWidth"
            :stroke="mergedConfig.flylineColor"
            :mask="`url(#mask${unique}${path.toString()})`"
          >
            <animate
              attributeName="stroke-dasharray"
              :from="`0, ${lengths[i]}`"
              :to="`${lengths[i]}, 0`"
              :dur="times[i] || 0"
              repeatCount="indefinite"
            />
          </use>
  
          <mask :id="`mask${unique}${path.toString()}`">
            <circle cx="0" cy="0" :r="mergedConfig.flylineRadius" :fill="`url(#${gradientId})`">
              <animateMotion
                :dur="times[i] || 0"
                :path="`M${path[0].toString()} Q${path[1].toString()} ${path[2].toString()}`"
                rotate="auto"
                repeatCount="indefinite"
              />
            </circle>
          </mask>
  
          <image
            :xlink:href="mergedConfig.pointsImg.url"
            :width="mergedConfig.pointsImg.width"
            :height="mergedConfig.pointsImg.height"
            :x="path[0][0] - mergedConfig.pointsImg.width / 2"
            :y="path[0][1] - mergedConfig.pointsImg.height / 2"
          />
  
          <text
            :style="`font-size:${mergedConfig.text.fontSize}px;`"
            :fill="mergedConfig.text.color"
            :x="path[0][0] + mergedConfig.text.offset[0]"
            :y="path[0][1] + mergedConfig.text.offset[1]"
          >
            {{ texts[i] }}
          </text>
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
  
  const flylineChartRef = ref(null)
  const { width, height } = useElementSize(flylineChartRef)
  
  const unique = Math.random()
  const id = uuid()
  const maskId = `flyline-mask-id-${id}`
  const maskCircleId = `mask-circle-id-${id}`
  const gradientId = `gradient-id-${id}`
  const gradient2Id = `gradient2-id-${id}`
  
  const defaultConfig = {
    centerPoint: [0, 0],
    points: [],
    lineWidth: 1,
    orbitColor: 'rgba(103, 224, 227, .2)',
    flylineColor: '#ffde93',
    k: -0.5,
    curvature: 5,
    flylineRadius: 100,
    duration: [20, 30],
    relative: true,
    bgImgUrl: '',
    text: {
      offset: [0, 15],
      color: '#ffdb5c',
      fontSize: 12
    },
    halo: {
      show: true,
      duration: 30,
      color: '#fb7293',
      radius: 120
    },
    centerPointImg: {
      width: 40,
      height: 40,
      url: ''
    },
    pointsImg: {
      width: 15,
      height: 15,
      url: ''
    }
  }
  
  const mergedConfig = ref(null)
  const paths = ref([])
  const lengths = ref([])
  const times = ref([])
  const texts = ref([])
  const pathRefs = reactive([])
  
  const mergeConfig = () => {
    mergedConfig.value = merge(cloneDeep(defaultConfig), props.config || {})
    const { points } = mergedConfig.value
    mergedConfig.value.points = points.map(item => {
      if (item instanceof Array) {
        return { position: item, text: '' }
      }
      return item
    })
  }
  
  const createFlylinePaths = () => {
    const { centerPoint, points, relative } = mergedConfig.value
    const pointPositions = points.map(({ position }) => position)
  
    if (relative) {
      const center = [width.value * centerPoint[0], height.value * centerPoint[1]]
      const scaledPoints = pointPositions.map(([x, y]) => [width.value * x, height.value * y])
      paths.value = scaledPoints.map(point => getPath(center, point))
    } else {
      paths.value = pointPositions.map(point => getPath(centerPoint, point))
    }
  }
  
  const getPath = (center, point) => {
    const controlPoint = getControlPoint(center, point)
    return [point, controlPoint, center]
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
  
  const calcLineLengths = async () => {
    await nextTick()
    lengths.value = pathRefs.map(path => path.getTotalLength())
  }
  
  const calcTimes = () => {
    const { duration, points } = mergedConfig.value
    times.value = points.map(() => randomExtend(...duration) / 10)
  }
  
  const calcTexts = () => {
    const { points } = mergedConfig.value
    texts.value = points.map(({ text }) => text)
  }
  
  const calcData = async () => {
    mergeConfig()
    createFlylinePaths()
    await calcLineLengths()
    calcTimes()
    calcTexts()
  }
  
  const consoleClickPos = ({ offsetX, offsetY }) => {
    if (!props.dev) return
    const relativeX = (offsetX / width.value).toFixed(2)
    const relativeY = (offsetY / height.value).toFixed(2)
    console.warn(`diy-flyline-chart DEV: \n Click Position is [${offsetX}, ${offsetY}] \n Relative Position is [${relativeX}, ${relativeY}]`)
  }
  
  watch(() => props.config, calcData)
  
  watch([width, height], calcData)
  
  onMounted(calcData)
  </script>
  
  <style scoped>
  .diy-flyline-chart {
    display: flex;
    flex-direction: column;
    background-size: 100% 100%;
  }
  
  .diy-flyline-chart :deep(polyline) {
    transition: all 0.3s;
  }
  
  .diy-flyline-chart :deep(text) {
    text-anchor: middle;
    dominant-baseline: middle;
  }
  </style>
  
  