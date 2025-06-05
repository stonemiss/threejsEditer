<template>
  <div class="header">
    <Toolbar/>
  </div>
</template>

<script setup>
import Toolbar from '@/components/Toolbar.vue'
</script>

<style lang="scss" scoped>
.header{
  box-sizing: border-box;
  position: absolute;
  top: 0;
  left: 0;
  height: 40px;
  width: 100vw;
  border-bottom: 1px solid #eeeeee;
}
</style>

