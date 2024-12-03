<template>
  <div class="diy-border-box-3" ref="borderRef">
    <svg class="diy-border-svg-container" :width="width" :height="height">
      <polygon :fill="backgroundColor" :points="`
        23, 23 ${width - 24}, 23 ${width - 24}, ${height - 24} 23, ${height - 24}
      `" />

      <polyline class="diy-bb3-line1"
        :stroke="mergedColor[0]"
        :points="`4, 4 ${width - 22} ,4 ${width - 22}, ${height - 22} 4, ${height - 22} 4, 4`"
      />
      <polyline class="diy-bb3-line2"
        :stroke="mergedColor[1]"
        :points="`10, 10 ${width - 16}, 10 ${width - 16}, ${height - 16} 10, ${height - 16} 10, 10`"
      />
      <polyline class="diy-bb3-line2"
        :stroke="mergedColor[1]"
        :points="`16, 16 ${width - 10}, 16 ${width - 10}, ${height - 10} 16, ${height - 10} 16, 16`"
      />
      <polyline class="diy-bb3-line2"
        :stroke="mergedColor[1]"
        :points="`22, 22 ${width - 4}, 22 ${width - 4}, ${height - 4} 22, ${height - 4} 22, 22`"
      />
    </svg>

    <div class="border-box-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue';
import { merge, cloneDeep } from 'lodash';
import { useElementSize } from '@vueuse/core';
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
const defaultColor = reactive(['#2862b7', '#2862b7']);
const mergedColor = ref([]);

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
.diy-border-box-3 {
  position: relative;
  width: 100%;
  height: 100%;
}

.diy-border-box-3 .diy-border-svg-container {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
}

.diy-border-box-3 .diy-border-svg-container > polyline {
  fill: none;
}

.diy-border-box-3 .diy-bb3-line1 {
  stroke-width: 3;
}

.diy-border-box-3 .diy-bb3-line2 {
  stroke-width: 1;
}

.diy-border-box-3 .border-box-content {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>