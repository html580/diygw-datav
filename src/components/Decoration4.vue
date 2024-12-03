<template>
  <div class="diy-decoration-4" ref="decorationRef">
    <div
      :class="`container ${reverse ? 'reverse' : 'normal'}`"
      :style="containerStyle"
    >
      <svg :width="reverse ? width : 5" :height="reverse ? 5 : height">
        <polyline
          :stroke="mergedColor[0]"
          :points="polylinePoints"
        />
        <polyline
          class="bold-line"
          :stroke="mergedColor[1]"
          stroke-width="3"
          stroke-dasharray="20, 80"
          stroke-dashoffset="-30"
          :points="polylinePoints"
        />
      </svg>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
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
    default: 3
  }
})

const decorationRef = ref(null)
const { width, height } = useElementSize(decorationRef)

const defaultColor = ['#4fd2dd', '#235fa7']
const mergedColor = ref([])

const containerStyle = computed(() => {
  if (props.reverse) {
    return `width:${width.value}px;height:5px;animation-duration:${props.dur}s`
  } else {
    return `width:5px;height:${height.value}px;animation-duration:${props.dur}s`
  }
})

const polylinePoints = computed(() => {
  if (props.reverse) {
    return `0, 2.5 ${width.value}, 2.5`
  } else {
    return `2.5, 0 2.5, ${height.value}`
  }
})

const mergeColor = () => {
  mergedColor.value = merge(cloneDeep(defaultColor), props.color || [])
}

watch(() => props.color, mergeColor)

onMounted(() => {
  mergeColor()
})
</script>

<style scoped>
.diy-decoration-4 {
  position: relative;
  width: 100%;
  height: 100%;
}

.diy-decoration-4 .container {
  display: flex;
  overflow: hidden;
  position: absolute;
  flex: 1;
}

.diy-decoration-4 .normal {
  animation: ani-height ease-in-out infinite;
  left: 50%;
  margin-left: -2px;
}

.diy-decoration-4 .reverse {
  animation: ani-width ease-in-out infinite;
  top: 50%;
  margin-top: -2px;
}

@keyframes ani-height {
  0% {
    height: 0%;
  }

  70% {
    height: 100%;
  }

  100% {
    height: 100%;
  }
}

@keyframes ani-width {
  0% {
    width: 0%;
  }
  
  70% {
    width: 100%;
  }

  100% {
    width: 100%;
  }
}
</style>

