<template>
  <div class="diy-decoration-5" ref="decorationRef">
    <svg :width="width" :height="height">
      <polyline
        fill="transparent"
        :stroke="mergedColor[0]"
        stroke-width="3"
        :points="line1Points"
      >
        <animate
          attributeName="stroke-dasharray"
          attributeType="XML"
          :from="`0, ${line1Length / 2}, 0, ${line1Length / 2}`"
          :to="`0, 0, ${line1Length}, 0`"
          :dur="`${dur}s`"
          begin="0s"
          calcMode="spline"
          keyTimes="0;1"
          keySplines="0.4,1,0.49,0.98"
          repeatCount="indefinite"
        />
      </polyline>
      <polyline
        fill="transparent"
        :stroke="mergedColor[1]"
        stroke-width="2"
        :points="line2Points"
      >
        <animate
          attributeName="stroke-dasharray"
          attributeType="XML"
          :from="`0, ${line2Length / 2}, 0, ${line2Length / 2}`"
          :to="`0, 0, ${line2Length}, 0`"
          :dur="`${dur}s`"
          begin="0s"
          calcMode="spline"
          keyTimes="0;1"
          keySplines=".4,1,.49,.98"
          repeatCount="indefinite"
        />
      </polyline>
    </svg>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useElementSize } from '@vueuse/core'
import { merge, cloneDeep } from 'lodash'
import { getPolylineLength } from '../util'

const props = defineProps({
  color: {
    type: Array,
    default: () => []
  },
  dur: {
    type: Number,
    default: 1.2
  }
})

const decorationRef = ref(null)
const { width, height } = useElementSize(decorationRef)

const line1Points = ref('')
const line2Points = ref('')
const line1Length = ref(0)
const line2Length = ref(0)

const defaultColor = reactive(['#3f96a5', '#3f96a5'])
const mergedColor = ref([])

const calcSVGData = () => {
  let points1 = [
    [0, height.value * 0.2],
    [width.value * 0.18, height.value * 0.2],
    [width.value * 0.2, height.value * 0.4],
    [width.value * 0.25, height.value * 0.4],
    [width.value * 0.27, height.value * 0.6],
    [width.value * 0.72, height.value * 0.6],
    [width.value * 0.75, height.value * 0.4],
    [width.value * 0.8, height.value * 0.4],
    [width.value * 0.82, height.value * 0.2],
    [width.value, height.value * 0.2]
  ]

  let points2 = [
    [width.value * 0.3, height.value * 0.8],
    [width.value * 0.7, height.value * 0.8]
  ]

  line1Length.value = getPolylineLength(points1)
  line2Length.value = getPolylineLength(points2)

  line1Points.value = points1.map(point => point.join(',')).join(' ')
  line2Points.value = points2.map(point => point.join(',')).join(' ')
}

const mergeColor = () => {
  mergedColor.value = merge(cloneDeep(defaultColor), props.color || [])
}

watch([width, height], calcSVGData)
watch(() => props.color, mergeColor)

onMounted(() => {
  mergeColor()
  calcSVGData()
})
</script>

<style scoped>
.diy-decoration-5 {
  width: 100%;
  height: 100%;
}
</style>

