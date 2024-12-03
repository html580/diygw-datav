<template>
  <div class="diy-border-box-5" ref="borderRef">
    <svg :class="`diy-border-svg-container ${reverse ? 'diy-reverse' : ''}`" :width="width" :height="height">
      <polygon :fill="backgroundColor" :points="`
        10, 22 ${width - 22}, 22 ${width - 22}, ${height - 86} ${width - 84}, ${height - 24} 10, ${height - 24}
      `" />

      <polyline
        class="diy-bb5-line-1"
        :stroke="mergedColor[0]"
        :points="`8, 5 ${width - 5}, 5 ${width - 5}, ${height - 100}
          ${width - 100}, ${height - 5} 8, ${height - 5} 8, 5`"
      />
      <polyline
        class="diy-bb5-line-2"
        :stroke="mergedColor[1]"
        :points="`3, 5 ${width - 20}, 5 ${width - 20}, ${height - 60}
          ${width - 74}, ${height - 5} 3, ${height - 5} 3, 5`"
      />
      <polyline class="diy-bb5-line-3" :stroke="mergedColor[1]" :points="`50, 13 ${width - 35}, 13`" />
      <polyline class="diy-bb5-line-4" :stroke="mergedColor[1]" :points="`15, 20 ${width - 35}, 20`" />
      <polyline class="diy-bb5-line-5" :stroke="mergedColor[1]" :points="`15, ${height - 20} ${width - 110}, ${height - 20}`" />
      <polyline class="diy-bb5-line-6" :stroke="mergedColor[1]" :points="`15, ${height - 13} ${width - 110}, ${height - 13}`" />
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
  reverse: {
    type: Boolean,
    default: false
  },
  backgroundColor: {
    type: String,
    default: 'transparent'
  }
});

const borderRef = ref(null);
const defaultColor = reactive(['#4fd2dd', '#235fa7']);
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
.diy-border-box-5 {
  position: relative;
  width: 100%;
  height: 100%;
}

.diy-border-box-5 .diy-reverse {
  transform: rotate(180deg);
}

.diy-border-box-5 .diy-border-svg-container {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
}

.diy-border-box-5 .diy-border-svg-container > polyline {
  fill: none;
}

.diy-border-box-5 .diy-bb5-line-1,
.diy-border-box-5 .diy-bb5-line-2 {
  stroke-width: 1;
}

.diy-border-box-5 .diy-bb5-line-3,
.diy-border-box-5 .diy-bb5-line-6 {
  stroke-width: 5;
}

.diy-border-box-5 .diy-bb5-line-4,
.diy-border-box-5 .diy-bb5-line-5 {
  stroke-width: 2;
}

.diy-border-box-5 .border-box-content {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>