<template>
  <div class="diy-decoration-11" ref="decorationRef">
    <svg :width="width" :height="height">
      <polygon
        :fill="fade(mergedColor[1] || defaultColor[1], 10)"
        :stroke="mergedColor[1]"
        :points="`20 10, 25 4, 55 4 60 10`"
      />

      <polygon
        :fill="fade(mergedColor[1] || defaultColor[1], 10)"
        :stroke="mergedColor[1]"
        :points="`20 ${height - 10}, 25 ${height - 4}, 55 ${height - 4} 60 ${height - 10}`"
      />

      <polygon
        :fill="fade(mergedColor[1] || defaultColor[1], 10)"
        :stroke="mergedColor[1]"
        :points="`${width - 20} 10, ${width - 25} 4, ${width - 55} 4 ${width - 60} 10`"
      />

      <polygon
        :fill="fade(mergedColor[1] || defaultColor[1], 10)"
        :stroke="mergedColor[1]"
        :points="`${width - 20} ${height - 10}, ${width - 25} ${height - 4}, ${width - 55} ${height - 4} ${width - 60} ${height - 10}`"
      />

      <polygon
        :fill="fade(mergedColor[0] || defaultColor[0], 20)"
        :stroke="mergedColor[0]"
        :points="`
          20 10, 5 ${height / 2} 20 ${height - 10}
          ${width - 20} ${height - 10} ${width - 5} ${height / 2} ${width - 20} 10
        `"
      />

      <polyline
        fill="transparent"
        :stroke="fade(mergedColor[0] || defaultColor[0], 70)"
        :points="`25 18, 15 ${height / 2} 25 ${height - 18}`"
      />

      <polyline
        fill="transparent"
        :stroke="fade(mergedColor[0] || defaultColor[0], 70)"
        :points="`${width - 25} 18, ${width - 15} ${height / 2} ${width - 25} ${height - 18}`"
      />
    </svg>

    <div class="decoration-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue'
import { useElementSize } from '@vueuse/core'
import { merge, cloneDeep } from 'lodash'
import { fade } from '@jiaminghi/color'

const props = defineProps({
  color: {
    type: Array,
    default: () => []
  }
})

const decorationRef = ref(null)
const { width, height } = useElementSize(decorationRef)

const defaultColor = reactive(['#1a98fc', '#2cf7fe'])
const mergedColor = ref([])

const mergeColor = () => {
  mergedColor.value = merge(cloneDeep(defaultColor), props.color || [])
}

watch(() => props.color, mergeColor)

onMounted(mergeColor)
</script>

<style scoped>
.diy-decoration-11 {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
}

.diy-decoration-11 .decoration-content {
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

