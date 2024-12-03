<template>
  <div
    class="diy-border-box-7"
    :style="`box-shadow: inset 0 0 40px ${mergedColor[0]}; border: 1px solid ${mergedColor[0]}; background-color: ${backgroundColor}`"
    ref="borderRef"
  >
    <svg class="diy-border-svg-container" :width="width" :height="height">
      <polyline class="diy-bb7-line-width-2" :stroke="mergedColor[0]" :points="`0, 25 0, 0 25, 0`" />
      <polyline class="diy-bb7-line-width-2" :stroke="mergedColor[0]" :points="`${width - 25}, 0 ${width}, 0 ${width}, 25`" />
      <polyline class="diy-bb7-line-width-2" :stroke="mergedColor[0]" :points="`${width - 25}, ${height} ${width}, ${height} ${width}, ${height - 25}`" />
      <polyline class="diy-bb7-line-width-2" :stroke="mergedColor[0]" :points="`0, ${height - 25} 0, ${height} 25, ${height}`" />

      <polyline class="diy-bb7-line-width-5" :stroke="mergedColor[1]" :points="`0, 10 0, 0 10, 0`" />
      <polyline class="diy-bb7-line-width-5" :stroke="mergedColor[1]" :points="`${width - 10}, 0 ${width}, 0 ${width}, 10`" />
      <polyline class="diy-bb7-line-width-5" :stroke="mergedColor[1]" :points="`${width - 10}, ${height} ${width}, ${height} ${width}, ${height - 10}`" />
      <polyline class="diy-bb7-line-width-5" :stroke="mergedColor[1]" :points="`0, ${height - 10} 0, ${height} 10, ${height}`" />
    </svg>

    <div class="border-box-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue';
import { useElementSize } from '@vueuse/core';
import { merge, cloneDeep } from 'lodash';

const props = defineProps({
  color: {
    type: Array,
    default: () => []
  },
  backgroundColor: {
    type: String,
    default: 'transparent'
  }
});

const borderRef = ref(null);
const { width, height } = useElementSize(borderRef);

const defaultColor = reactive(['rgba(255,255,255,0)', '#4fd2dd']);
const mergedColor = ref([]);

const mergeColor = () => {
  mergedColor.value = merge(cloneDeep(defaultColor), props.color || []);
};

watch(() => props.color, mergeColor);

onMounted(() => {
  mergeColor();
});
</script>

<style scoped>
.diy-border-box-7 {
  position: relative;
  width: 100%;
  height: 100%;
}

.diy-border-box-7 .diy-border-svg-container {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
}

.diy-border-box-7 .diy-border-svg-container > polyline {
  fill: none;
  stroke-linecap: round;
}

.diy-border-box-7 .diy-bb7-line-width-2 {
  stroke-width: 2;
}

.diy-border-box-7 .diy-bb7-line-width-5 {
  stroke-width: 5;
}

.diy-border-box-7 .border-box-content {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>