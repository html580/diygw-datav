<template>
  <div class="diy-decoration-2" ref="decorationRef">
    <svg :width="`${width}px`" :height="`${height}px`">
      <rect :x="x" :y="y" :width="w" :height="h" :fill="mergedColor[0]">
        <animate
          :attributeName="reverse ? 'height' : 'width'"
          from="0"
          :to="reverse ? height : width"
          :dur="`${dur}s`"
          calcMode="spline"
          keyTimes="0;1"
          keySplines=".42,0,.58,1"
          repeatCount="indefinite"
        />
      </rect>

      <rect :x="x" :y="y" width="1" height="1" :fill="mergedColor[1]">
        <animate
          :attributeName="reverse ? 'y' : 'x'"
          from="0"
          :to="reverse ? height : width"
          :dur="`${dur}s`"
          calcMode="spline"
          keyTimes="0;1"
          keySplines="0.42,0,0.58,1"
          repeatCount="indefinite"
        />
      </rect>
    </svg>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue'
import { useElementSize } from '@vueuse/core'
import { merge, cloneDeep } from 'lodash'

const props = defineProps({
  color: {
    type: Array,
    default: () => []
  },
  reverse: {
    type: Boolean,
    default: false
  },
  dur: {
    type: Number,
    default: 6
  }
})

const decorationRef = ref(null)
const { width, height } = useElementSize(decorationRef)

const x = ref(0)
const y = ref(0)
const w = ref(0)
const h = ref(0)

const defaultColor = ['#3faacb', '#fff']
const mergedColor = ref([])

const calcSVGData = () => {
  if (props.reverse) {
    w.value = 1
    h.value = height.value
    x.value = width.value / 2
    y.value = 0
  } else {
    w.value = width.value
    h.value = 1
    x.value = 0
    y.value = height.value / 2
  }
}

const mergeColor = () => {
  mergedColor.value = merge(cloneDeep(defaultColor), props.color || [])
}

watch(() => props.color, mergeColor)
watch(() => props.reverse, calcSVGData)
watch([width, height], calcSVGData)

onMounted(() => {
  mergeColor()
  calcSVGData()
})
</script>

<style scoped>
.diy-decoration-2 {
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
}
</style>

