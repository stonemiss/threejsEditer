<template>
  <div class="toolbar">
    <button
      v-for="mode in modes"
      :key="mode"
      :class="{ active: currentMode === mode }"
      @click="handleModeChange(mode)"
    >
      {{ labels[mode] }}
    </button>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref } from 'vue';

const props = defineProps({
  initialMode: {
    type: String,
    default: 'translate'
  }
});
const emit = defineEmits(['mode-change']);

const modes = ['translate', 'rotate', 'scale'];
const labels = {
  translate: '移动',
  rotate: '旋转',
  scale: '缩放'
};

const currentMode = ref(props.initialMode);

function handleModeChange(mode) {
  currentMode.value = mode;
  emit('mode-change', mode);
}
</script>

<style lang="scss" scoped>
.toolbar {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 10;
}
button {
  margin-right: 6px;
  padding: 8px 12px;
  border: 1px solid #ccc;
  background: white;
  cursor: pointer;
}
button.active {
  background: #409eff;
  color: white;
  border-color: #409eff;
}
</style>
