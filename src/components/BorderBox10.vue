<template>
  <div class="diy-border-box-10" ref="borderRef" :style="`box-shadow: inset 0 0 25px 3px ${mergedColor[0]}`">
    <svg class="diy-border-svg-container" :width="width" :height="height">
      <polygon :fill="backgroundColor" :points="`
        4, 0 ${width - 4}, 0 ${width}, 4 ${width}, ${height - 4} ${width - 4}, ${height}
        4, ${height} 0, ${height - 4} 0, 4
      `" />
    </svg>

    <svg
      width="150px"
      height="150px"
      :key="item"
      v-for="item in border"
      :class="`${item} diy-border-svg-container`"
    >
      <polygon
        :fill="mergedColor[1]"
        points="40, 0 5, 0 0, 5 0, 16 3, 19 3, 7 7, 3 35, 3"
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

const border = reactive(['left-top', 'right-top', 'left-bottom', 'right-bottom'])
const defaultColor = reactive(['#1d48c4', '#d3e1f8'])
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
.diy-border-box-10 {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 6px;
}

.diy-border-box-10 .diy-border-svg-container {
  position: absolute;
  display: block;
}

.diy-border-box-10 .right-top {
  right: 0px;
  transform: rotateY(180deg);
}

.diy-border-box-10 .left-bottom {
  bottom: 0px;
  transform: rotateX(180deg);
}

.diy-border-box-10 .right-bottom {
  right: 0px;
  bottom: 0px;
  transform: rotateX(180deg) rotateY(180deg);
}

.diy-border-box-10 .border-box-content {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>

