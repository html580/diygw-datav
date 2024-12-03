<template>
  <div class="diy-decoration-8" ref="decorationRef">
    <svg :width="width" :height="height">
      <polyline
        :stroke="mergedColor[0]"
        stroke-width="2"
        fill="transparent"
        :points="`${xPos(0)}, 0 ${xPos(30)}, ${height / 2}`"
      />

      <polyline
        :stroke="mergedColor[0]"
        stroke-width="2"
        fill="transparent"
        :points="`${xPos(20)}, 0 ${xPos(50)}, ${height / 2} ${xPos(width)}, ${height / 2}`"
      />

      <polyline
        :stroke="mergedColor[1]"
        fill="transparent"
        stroke-width="3"
        :points="`${xPos(0)}, ${height - 3}, ${xPos(200)}, ${height - 3}`"
      />
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
  },
  reverse: {
    type: Boolean,
    default: false
  }
})

const decorationRef = ref(null)
const { width, height } = useElementSize(decorationRef)

const defaultColor = reactive(['#3f96a5', '#3f96a5'])
const mergedColor = ref([])

const xPos = computed(() => (pos) => {
  if (!props.reverse) return pos
  return width.value - pos
})

const mergeColor = () => {
  mergedColor.value = merge(cloneDeep(defaultColor), props.color || [])
}

watch(() => props.color, mergeColor)

onMounted(mergeColor)
</script>

<style scoped>
.diy-decoration-8 {
  display: flex;
  width: 100%;
  height: 100%;
}
</style>

