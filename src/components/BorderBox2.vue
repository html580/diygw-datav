<template>
  <div class="diy-border-box-2" ref="borderRef">
    <svg class="diy-border-svg-container" :width="width" :height="height">
      <polygon :fill="backgroundColor" :points="`
        7, 7 ${width - 7}, 7 ${width - 7}, ${height - 7} 7, ${height - 7}
      `" />

      <polyline
        :stroke="mergedColor[0]"
        :points="`2, 2 ${width - 2} ,2 ${width - 2}, ${height - 2} 2, ${height - 2} 2, 2`"
      />
      <polyline
        :stroke="mergedColor[1]"
        :points="`6, 6 ${width - 6}, 6 ${width - 6}, ${height - 6} 6, ${height - 6} 6, 6`"
      />
      <circle :fill="mergedColor[0]" cx="11" cy="11" r="1" />
      <circle :fill="mergedColor[0]" :cx="width - 11" cy="11" r="1" />
      <circle :fill="mergedColor[0]" :cx="width - 11" :cy="height - 11" r="1" />
      <circle :fill="mergedColor[0]" cx="11" :cy="height - 11" r="1" />
    </svg>

    <div class="border-box-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue';
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
const defaultColor = reactive(['#4fd2dd', '#4fd2dd2b']);
const mergedColor = ref([]);
import { useElementSize } from '@vueuse/core';
const { width, height } = useElementSize(borderRef);

const mergeColor = () => {
  mergedColor.value = merge(cloneDeep(defaultColor), props.color || []);
};

watch(() => props.color, mergeColor);

onMounted(() => {
  mergeColor(); 
});
</script>

<style scoped>
.diy-border-box-2 {
  position: relative;
  width: 100%;
  height: 100%;
}

.diy-border-box-2 .diy-border-svg-container {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
}

.diy-border-box-2 .diy-border-svg-container > polyline {
  fill: none;
  stroke-width: 1;
}

.diy-border-box-2 .border-box-content {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>