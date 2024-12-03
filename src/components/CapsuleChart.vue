<template>
  <div class="diy-capsule-chart">
    <template v-if="mergedConfig">
      <div class="label-column" :style="`color: ${mergedConfig.labelColor};`">
        <div v-for="item in mergedConfig.data" :key="item.name">{{ item.name }}</div>
        <div>&nbsp;</div>
      </div>

      <div class="capsule-container">
        <div class="capsule-item" v-for="(capsule, index) in capsuleLength" :key="index">
          <div
            class="capsule-item-column"
            :style="`width: ${capsule * 100}%; background-color: ${mergedConfig.colors[index % mergedConfig.colors.length]};`"
          >
            <div
              v-if="mergedConfig.showValue"
              class="capsule-item-value"
              :style="`color: ${mergedConfig.valueColor};`"
            >{{ capsuleValue[index] }}</div>
          </div>
        </div>

        <div class="unit-label" :style="`color: ${mergedConfig.labelColor};`">
          <div
            v-for="(label, index) in labelData"
            :key="label + index"
          >{{ label }}</div>
        </div>
      </div>

      <div class="unit-text" v-if="mergedConfig.unit" :style="`color: ${mergedConfig.unitColor};`">{{ mergedConfig.unit }}</div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { merge, cloneDeep } from 'lodash'

const props = defineProps({
  config: {
    type: Object,
    default: () => ({})
  }
})

const defaultConfig = {
  data: [],
  colors: [
    '#37a2da',
    '#32c5e9',
    '#67e0e3',
    '#9fe6b8',
    '#ffdb5c',
    '#ff9f7f',
    '#fb7293'
  ],
  unit: '',
  showValue: false,
  labelColor: '#37a2da',
  valueColor: '#37a2da',
  unitColor: '#37a2da'
}

const mergedConfig = ref(null)
const capsuleLength = ref([])
const capsuleValue = ref([])
const labelData = ref([])
const labelDataLength = ref([])

const mergeConfig = () => {
  mergedConfig.value = merge(cloneDeep(defaultConfig), props.config || {})
}

const calcCapsuleLengthAndLabelData = () => {
  const { data } = mergedConfig.value

  if (!data.length) return

  const values = data.map(({ value }) => value)
  const maxValue = Math.max(...values)

  capsuleValue.value = values
  capsuleLength.value = values.map(v => (maxValue ? v / maxValue : 0))

  const oneFifth = maxValue / 5
  const labels = Array.from(
    new Set(new Array(6).fill(0).map((v, i) => Math.ceil(i * oneFifth)))
  )

  labelData.value = labels
  labelDataLength.value = labels.map(v => (maxValue ? v / maxValue : 0))
}

const calcData = () => {
  mergeConfig()
  calcCapsuleLengthAndLabelData()
}

watch(() => props.config, calcData)

onMounted(calcData)
</script>

<style scoped>
.diy-capsule-chart {
  position: relative;
  display: flex;
  flex-direction: row;
  box-sizing: border-box;
  padding: 10px;
}

.label-column {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;
  padding-right: 10px;
  text-align: right;
  font-size: 12px;
}

.label-column div {
  height: 20px;
  line-height: 20px;
}

.capsule-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.capsule-item {
  box-shadow: 0 0 3px #999;
  height: 10px;
  margin: 5px 0px;
  border-radius: 5px;
}

.capsule-item-column {
  position: relative;
  height: 8px;
  margin-top: 1px;
  border-radius: 5px;
  transition: all 0.3s;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.capsule-item-value {
  font-size: 12px;
  transform: translateX(100%);
}

.unit-label {
  height: 20px;
  font-size: 12px;
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.unit-text {
  text-align: right;
  display: flex;
  align-items: flex-end;
  font-size: 12px;
  line-height: 20px;
  margin-left: 10px;
}
</style>

