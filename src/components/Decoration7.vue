<template>
  <div class="diy-decoration-7">
    <svg width="21px" height="20px">
      <polyline
        stroke-width="4"
        fill="transparent"
        :stroke="mergedColor[0]"
        points="10, 0 19, 10 10, 20"
      />
      <polyline
        stroke-width="2"
        fill="transparent"
        :stroke="mergedColor[1]"
        points="2, 0 11, 10 2, 20"
      />
    </svg>
    <slot></slot>
    <svg width="21px" height="20px">
      <polyline
        stroke-width="4"
        fill="transparent"
        :stroke="mergedColor[0]"
        points="11, 0 2, 10 11, 20"
      />
      <polyline
        stroke-width="2"
        fill="transparent"
        :stroke="mergedColor[1]"
        points="19, 0 10, 10 19, 20"
      />
    </svg>
   
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { merge, cloneDeep } from 'lodash'

const props = defineProps({
  color: {
    type: Array,
    default: () => []
  }
})

const defaultColor = ['#1dc1f5', '#1dc1f5']
const mergedColor = ref([])

const mergeColor = () => {
  mergedColor.value = merge(cloneDeep(defaultColor), props.color || [])
}

watch(() => props.color, mergeColor)

onMounted(mergeColor)
</script>

<style scoped>
.diy-decoration-7 {
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
}
</style>

