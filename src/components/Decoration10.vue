<template>
  <div class="diy-decoration-10" ref="decorationRef">
    <svg :width="width" :height="height">
      <polyline
        :stroke="mergedColor[1]"
        stroke-width="2"
        :points="`0, ${height / 2} ${width}, ${height / 2}`"
      />

      <polyline
        :stroke="mergedColor[0]"
        stroke-width="2"
        :points="`5, ${height / 2} ${width * 0.2 - 3}, ${height / 2}`"
        :stroke-dasharray="`0, ${width * 0.2}`"
        fill="freeze"
      >
        <animate
          :id="animationId2"
          attributeName="stroke-dasharray"
          :values="`0, ${width * 0.2};${width * 0.2}, 0;`"
          dur="3s"
          :begin="`${animationId1}.end`"
          fill="freeze"
        />
        <animate
          attributeName="stroke-dasharray"
          :values="`${width * 0.2}, 0;0, ${width * 0.2}`"
          dur="0.01s"
          :begin="`${animationId7}.end`"
          fill="freeze"
        />
      </polyline>

      <polyline
        :stroke="mergedColor[0]"
        stroke-width="2"
        :points="`${width * 0.2 + 3}, ${height / 2} ${width * 0.8 - 3}, ${height / 2}`"
        :stroke-dasharray="`0, ${width * 0.6}`"
      >
        <animate
          :id="animationId4"
          attributeName="stroke-dasharray"
          :values="`0, ${width * 0.6};${width * 0.6}, 0`"
          dur="3s"
          :begin="`${animationId3}.end + 1s`"
          fill="freeze"
        />
        <animate
          attributeName="stroke-dasharray"
          :values="`${width * 0.6}, 0;0, ${width * 0.6}`"
          dur="0.01s"
          :begin="`${animationId7}.end`"
          fill="freeze"
        />
      </polyline>

      <polyline
        :stroke="mergedColor[0]"
        stroke-width="2"
        :points="`${width * 0.8 + 3}, ${height / 2} ${width - 5}, ${height / 2}`"
        :stroke-dasharray="`0, ${width * 0.2}`"
      >
        <animate
          :id="animationId6"
          attributeName="stroke-dasharray"
          :values="`0, ${width * 0.2};${width * 0.2}, 0`"
          dur="3s"
          :begin="`${animationId5}.end + 1s`"
          fill="freeze"
        />
        <animate
          attributeName="stroke-dasharray"
          :values="`${width * 0.2}, 0;0, ${width * 0.3}`"
          dur="0.01s"
          :begin="`${animationId7}.end`"
          fill="freeze"
        />
      </polyline>

      <circle cx="2" :cy="height / 2" r="2" :fill="mergedColor[1]">
        <animate
          :id="animationId1"
          attributeName="fill"
          :values="`${mergedColor[1]};${mergedColor[0]}`"
          :begin="`0s;${animationId7}.end`"
          dur="0.3s"
          fill="freeze"
        />
      </circle>

      <circle :cx="width * 0.2" :cy="height / 2" r="2" :fill="mergedColor[1]">
        <animate
          :id="animationId3"
          attributeName="fill"
          :values="`${mergedColor[1]};${mergedColor[0]}`"
          :begin="`${animationId2}.end`"
          dur="0.3s"
          fill="freeze"
        />
        <animate
          attributeName="fill"
          :values="`${mergedColor[1]};${mergedColor[1]}`"
          dur="0.01s"
          :begin="`${animationId7}.end`"
          fill="freeze"
        />
      </circle>

      <circle :cx="width * 0.8" :cy="height / 2" r="2" :fill="mergedColor[1]">
        <animate
          :id="animationId5"
          attributeName="fill"
          :values="`${mergedColor[1]};${mergedColor[0]}`"
          :begin="`${animationId4}.end`"
          dur="0.3s"
          fill="freeze"
        />
        <animate
          attributeName="fill"
          :values="`${mergedColor[1]};${mergedColor[1]}`"
          dur="0.01s"
          :begin="`${animationId7}.end`"
          fill="freeze"
        />
      </circle>

      <circle :cx="width - 2" :cy="height / 2" r="2" :fill="mergedColor[1]">
        <animate
          :id="animationId7"
          attributeName="fill"
          :values="`${mergedColor[1]};${mergedColor[0]}`"
          :begin="`${animationId6}.end`"
          dur="0.3s"
          fill="freeze"
        />
        <animate
          attributeName="fill"
          :values="`${mergedColor[1]};${mergedColor[1]}`"
          dur="0.01s"
          :begin="`${animationId7}.end`"
          fill="freeze"
        />
      </circle>
    </svg>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useElementSize } from '@vueuse/core'
import { merge, cloneDeep } from 'lodash'
import { uuid } from '../util'

const props = defineProps({
  color: {
    type: Array,
    default: () => []
  }
})

const decorationRef = ref(null)
const { width, height } = useElementSize(decorationRef)

const id = uuid()
const animationId1 = `d10ani1${id}`
const animationId2 = `d10ani2${id}`
const animationId3 = `d10ani3${id}`
const animationId4 = `d10ani4${id}`
const animationId5 = `d10ani5${id}`
const animationId6 = `d10ani6${id}`
const animationId7 = `d10ani7${id}`

const defaultColor = ['#00c2ff', 'rgba(0, 194, 255, 0.3)']
const mergedColor = ref([])

const mergeColor = () => {
  mergedColor.value = merge(cloneDeep(defaultColor), props.color || [])
}

watch(() => props.color, mergeColor)

onMounted(mergeColor)
</script>

<style scoped>
.diy-decoration-10 {
  width: 100%;
  height: 100%;
  display: flex;
}
</style>

