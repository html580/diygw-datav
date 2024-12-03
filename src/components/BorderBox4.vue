<template>
  <div class="diy-border-box-4" ref="borderRef">
    <svg :class="`diy-border-svg-container ${reverse ? 'diy-reverse' : ''}`" :width="width" :height="height">
      <polygon :fill="backgroundColor" :points="`
        ${width - 15}, 22 170, 22 150, 7 40, 7 28, 21 32, 24
        16, 42 16, ${height - 32} 41, ${height - 7} ${width - 15}, ${height - 7}
      `" />

      <polyline class="diy-bb4-line-1"
        :stroke="mergedColor[0]"
        :points="`145, ${height - 5} 40, ${height - 5} 10, ${height - 35}
          10, 40 40, 5 150, 5 170, 20 ${width - 15}, 20`"
      />
      <polyline
        :stroke="mergedColor[1]"
        class="diy-bb4-line-2" :points="`245, ${height - 1} 36, ${height - 1} 14, ${height - 23}
          14, ${height - 100}`"
      />

      <polyline class="diy-bb4-line-3" :stroke="mergedColor[0]" :points="`7, ${height - 40} 7, ${height - 75}`" />
      <polyline class="diy-bb4-line-4" :stroke="mergedColor[0]" :points="`28, 24 13, 41 13, 64`" />
      <polyline class="diy-bb4-line-5" :stroke="mergedColor[0]" :points="`5, 45 5, 140`" />
      <polyline class="diy-bb4-line-6" :stroke="mergedColor[1]" :points="`14, 75 14, 180`" />
      <polyline class="diy-bb4-line-7" :stroke="mergedColor[1]" :points="`55, 11 147, 11 167, 26 250, 26`" />
      <polyline class="diy-bb4-line-8" :stroke="mergedColor[1]" :points="`158, 5 173, 16`" />
      <polyline class="diy-bb4-line-9" :stroke="mergedColor[0]" :points="`200, 17 ${width - 10}, 17`" />
      <polyline class="diy-bb4-line-10" :stroke="mergedColor[1]" :points="`385, 17 ${width - 10}, 17`" />
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
const defaultColor = reactive(['red', 'rgba(0,0,255,0.8)']);
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
.diy-border-box-4 {
  position: relative;
  width: 100%;
  height: 100%;
}

.diy-border-box-4 .diy-reverse {
  transform: rotate(180deg);
}

.diy-border-box-4 .diy-border-svg-container {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
}

.diy-border-box-4 .diy-border-svg-container > polyline {
  fill: none;
}

.diy-border-box-4 .sw1 {
  stroke-width: 1;
}

.diy-border-box-4 .sw3 {
  stroke-width: 3px;
  stroke-linecap: round;
}

.diy-border-box-4 .diy-bb4-line-1 {
  stroke-width: 1;
}

.diy-border-box-4 .diy-bb4-line-2 {
  stroke-width: 1;
}

.diy-border-box-4 .diy-bb4-line-3 {
  stroke-width: 3px;
  stroke-linecap: round;
}

.diy-border-box-4 .diy-bb4-line-4 {
  stroke-width: 3px;
  stroke-linecap: round;
}

.diy-border-box-4 .diy-bb4-line-5 {
  stroke-width: 1;
}

.diy-border-box-4 .diy-bb4-line-6 {
  stroke-width: 1;
}

.diy-border-box-4 .diy-bb4-line-7 {
  stroke-width: 1;
}

.diy-border-box-4 .diy-bb4-line-8 {
  stroke-width: 3px;
  stroke-linecap: round;
}

.diy-border-box-4 .diy-bb4-line-9 {
  stroke-width: 3px;
  stroke-linecap: round;
  stroke-dasharray: 100 250;
}

.diy-border-box-4 .diy-bb4-line-10 {
  stroke-width: 1;
  stroke-dasharray: 80 270;
}

.diy-border-box-4 .border-box-content {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>