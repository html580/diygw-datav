<script setup lang="ts">
defineProps<{ msg: string }>()
</script>

<template>
  <h1>{{ msg }}</h1>
  <p>基于Vue 大屏数据展示组件库DataV魔改兼容vue3</p>
  <p><a href="http://datav.jiaminghi.com" target="_blank">DATAV</a></p>
  <p>
    <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank">源码下载</a>
  </p>
  <p>
    <a href="https://www.diygw.com" target="_blank">DIYGW可视化大屏</a>
  </p>
</template>

<style scoped>
h1{
  font-size: 20px;
}
.read-the-docs {
  color: #888;
}
</style>
