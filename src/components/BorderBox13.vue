<template>
  <div class="diy-border-box-13" ref="borderRef">
    <svg class="diy-border-svg-container" :width="width" :height="height">
      <path
        :fill="backgroundColor"
        :stroke="mergedColor[0]"
        :d="`
          M 5 20 L 5 10 L 12 3  L 60 3 L 68 10
          L ${width - 20} 10 L ${width - 5} 25
          L ${width - 5} ${height - 5} L 20 ${height - 5}
          L 5 ${height - 20} L 5 20
        `"
      />

      <path
        fill="transparent"
        stroke-width="3"
        stroke-linecap="round"
        stroke-dasharray="10, 5"
        :stroke="mergedColor[0]"
        :d="`M 16 9 L 61 9`"
      />

      <path
        fill="transparent"
        :stroke="mergedColor[1]"
        :d="`M 5 20 L 5 10 L 12 3  L 60 3 L 68 10`"
      />

      <path
        fill="transparent"
        :stroke="mergedColor[1]"
        :d="`M ${width - 5} ${height - 30} L ${width - 5} ${height - 5} L ${width - 30} ${height - 5}`"
      />
    </svg>

    <div class="border-box-content">
      <slot></slot>
    </div>
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
  backgroundColor: {
    type: String,
    default: 'transparent'
  }
})

const borderRef = ref(null)
const { width, height } = useElementSize(borderRef)

const defaultColor = reactive(['#6586ec', '#2cf7fe'])
const mergedColor = ref([])

const mergeColor = () => {
  mergedColor.value = merge(cloneDeep(defaultColor), props.color || [])
}

watch(() => props.color, mergeColor)

onMounted(() => {
  mergeColor()
})
</script>

<style scoped>
.diy-border-box-13 {
  position: relative;
  width: 100%;
  height: 100%;
}

.diy-border-box-13 .diy-border-svg-container {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
}

.diy-border-box-13 .border-box-content {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>

