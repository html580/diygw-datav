<template>
  <div class="diy-decoration-9" ref="decorationRef">
    <svg :width="`${svgWH[0]}px`" :height="`${svgWH[1]}px`" :style="`transform:scale(${svgScale[0]},${svgScale[1]});`">
      <defs>
        <polygon :id="polygonId" points="15, 46.5, 21, 47.5, 21, 52.5, 15, 53.5" />
      </defs>

      <circle
        cx="50"
        cy="50"
        r="45"
        fill="transparent"
        :stroke="mergedColor[1]"
        stroke-width="10"
        stroke-dasharray="80, 100, 30, 100"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          values="0 50 50;360 50 50"
          :dur="`${props.dur}s`"
          repeatCount="indefinite"
        />
      </circle>

      <circle
        cx="50"
        cy="50"
        r="45"
        fill="transparent"
        :stroke="mergedColor[0]"
        stroke-width="6"
        stroke-dasharray="50, 66, 100, 66"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          values="0 50 50;-360 50 50"
          :dur="`${props.dur}s`"
          repeatCount="indefinite"
        />
      </circle>

      <circle
        cx="50"
        cy="50"
        r="38"
        fill="transparent"
        :stroke="fade(mergedColor[1] || defaultColor[1], 30)"
        stroke-width="1"
        stroke-dasharray="5, 1"
      />

      <use
        v-for="(_, i) in new Array(20).fill(0)"
        :key="i"
        :xlink:href="`#${polygonId}`"
        :stroke="mergedColor[1]"
        :fill="Math.random() > 0.4 ? 'transparent' : mergedColor[0]"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          values="0 50 50;360 50 50"
          :dur="`${props.dur}s`"
          :begin="`${i * props.dur / 20}s`"
          repeatCount="indefinite"
        />
      </use>

      <circle
        cx="50"
        cy="50"
        r="26"
        fill="transparent"
        :stroke="fade(mergedColor[1] || defaultColor[1], 30)"
        stroke-width="1"
        stroke-dasharray="5, 1"
      />
    </svg>

    <slot></slot>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useElementSize } from '@vueuse/core'
import { merge, cloneDeep } from 'lodash'
import { fade } from '@jiaminghi/color'
import { uuid } from '../util'

const props = defineProps({
  color: {
    type: Array,
    default: () => []
  },
  dur: {
    type: Number,
    default: 3
  }
})

const decorationRef = ref(null)
const { width, height } = useElementSize(decorationRef)

const polygonId = `decoration-9-polygon-${uuid()}`

const svgWH = reactive([100, 100])
const svgScale = reactive([1, 1])

const defaultColor = ['rgba(3, 166, 224, 0.8)', 'rgba(3, 166, 224, 0.5)']
const mergedColor = ref([])

const calcScale = () => {
  const [w, h] = svgWH
  svgScale[0] = width.value / w
  svgScale[1] = height.value / h
}

const mergeColor = () => {
  mergedColor.value = merge(cloneDeep(defaultColor), props.color || [])
}

watch(() => props.color, mergeColor)

watch([width, height], calcScale)

onMounted(() => {
  mergeColor()
  calcScale()
})
</script>

<style scoped>
.diy-decoration-9 {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.diy-decoration-9 svg {
  position: absolute;
  left: 0px;
  top: 0px;
  transform-origin: left top;
}
</style>

