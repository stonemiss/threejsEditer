
<template>
  <el-card class="object-transform-panel">
    <div class="section">
      <h4>位置 Position</h4>
      <el-row :gutter="10">
        <el-col :span="8">
          <el-input-number v-model="transform.position.x" :step="0.1" label="X" size="small" />
        </el-col>
        <el-col :span="8">
          <el-input-number v-model="transform.position.y" :step="0.1" label="Y" size="small" />
        </el-col>
        <el-col :span="8">
          <el-input-number v-model="transform.position.z" :step="0.1" label="Z" size="small" />
        </el-col>
      </el-row>
    </div>

    <div class="section">
      <h4>旋转 Rotation</h4>
      <el-row :gutter="10">
        <el-col :span="8">
          <el-input-number v-model="transform.rotation.x" :step="1" label="X" size="small" />
        </el-col>
        <el-col :span="8">
          <el-input-number v-model="transform.rotation.y" :step="1" label="Y" size="small" />
        </el-col>
        <el-col :span="8">
          <el-input-number v-model="transform.rotation.z" :step="1" label="Z" size="small" />
        </el-col>
      </el-row>
    </div>

    <div class="section">
      <h4>缩放 Scale</h4>
      <el-row :gutter="10">
        <el-col :span="8">
          <el-input-number v-model="transform.scale.x" :step="0.1" :min="0.01" label="X" size="small" />
        </el-col>
        <el-col :span="8">
          <el-input-number v-model="transform.scale.y" :step="0.1" :min="0.01" label="Y" size="small" />
        </el-col>
        <el-col :span="8">
          <el-input-number v-model="transform.scale.z" :step="0.1" :min="0.01" label="Z" size="small" />
        </el-col>
      </el-row>
    </div>

    <label>
      颜色：
      <input type="color" :value="colorHex" @input="changeColor" />
    </label>
    <div>
      <span>显示标签：</span><el-switch v-model="showLabel" />
    </div>
  </el-card>
</template>

<script setup>
import { selectObjectInfoStore } from '@/store/modules/SelectObjectInfo'

const showLabel = ref(true)

const emit = defineEmits(["update-modelValue"]);

const objectInfo = selectObjectInfoStore();



const transform = reactive({
  position: objectInfo.transformData.position,
  rotation: objectInfo.transformData.rotation,
  scale: objectInfo.transformData.scale,
})

// 当本地 transform 改变时，通知父组件
// watch(
//   transform,
//   () => {
//     console.log(transform);
//     emit('update-modelValue', {
//       position: { ...transform.position },
//       rotation: { ...transform.rotation },
//       scale: { ...transform.scale },
//     })
//   },
//   { deep: true }
// )
// emit("view-change", viewNames[faceIndex]);
const colorHex = computed(() => {
  const color = objectInfo?.material?.color;
  // return color ? `#${color.getHexString()}` : '#ffffff';
  return color
});
function changeColor(e) {
  objectInfo.material.color = e.target.value
  objectInfo.updateObjectColor(e.target.value)
  // objectInfo.material.color.set(e.target.value);
}
</script>

<style lang="scss" scoped>
:deep(.object-transform-panel){
  box-shadow: none;
}
.object-transform-panel {
  position: absolute;
  right: 0;
  top: 40px;
  width: 300px;
  background: #f5f7fa;
  padding: 16px;
  box-sizing: border-box;
}
.section {
  margin-bottom: 16px;
}
.section h4 {
  margin-bottom: 8px;
  font-size: 14px;
  color: #333;
}
</style>
<!-- <template>
  <div class="panel" v-if="object">
    <h3>物体属性</h3>

    <label>
      名称：
      <input v-model="object.name" type="text" />
    </label>

    <label>
      颜色：
      <input type="color" :value="colorHex" @input="changeColor" />
    </label>

    <fieldset>
      <legend>位置</legend>
      <input type="number" v-model.number="object.position.x" step="0.1" />
      <input type="number" v-model.number="object.position.y" step="0.1" />
      <input type="number" v-model.number="object.position.z" step="0.1" />
    </fieldset>

    <fieldset>
      <legend>缩放</legend>
      <input type="number" v-model.number="object.scale.x" step="0.1" />
      <input type="number" v-model.number="object.scale.y" step="0.1" />
      <input type="number" v-model.number="object.scale.z" step="0.1" />
    </fieldset>

    <label>
      可见性：
      <input type="checkbox" v-model="object.visible" />
    </label>
  </div>
</template>

<script setup>

import { selectObjectInfoStore } from '@/store/modules/SelectObjectInfo'

const props = defineProps({
  object: Object,
});

const colorHex = computed(() => {
  const color = props.object?.material?.color;
  return color ? `#${color.getHexString()}` : '#ffffff';
});

function changeColor(e) {
  props.object.material.color.set(e.target.value);
}
</script>

<style scoped>
.panel {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 220px;
  background: #9b0b0b;
  border: 1px solid #ccc;
  padding: 12px;
  font-size: 14px;
  z-index: 100;
}

.panel h3 {
  margin-top: 0;
}

label,
fieldset {
  display: block;
  margin-bottom: 10px;
}

input[type='text'],
input[type='number'],
input[type='color'] {
  width: 100%;
  box-sizing: border-box;
  margin-top: 4px;
}

fieldset input {
  width: 32%;
  margin-right: 2%;
}
</style> -->
