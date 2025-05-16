
<template>
  <el-card class="object-transform-panel">
    <div class="section">
      <h4>位置 Position</h4>
      <el-row :gutter="10">
        <el-col :span="8">
          <el-input-number v-model="objectInfo.transformData.position.x" :step="0.1" label="X" size="small" />
        </el-col>
        <el-col :span="8">
          <el-input-number v-model="objectInfo.transformData.position.y" :step="0.1" label="Y" size="small" />
        </el-col>
        <el-col :span="8">
          <el-input-number v-model="objectInfo.transformData.position.z" :step="0.1" label="Z" size="small" />
        </el-col>
      </el-row>
    </div>

    <div class="section">
      <h4>旋转 Rotation</h4>
      <el-row :gutter="10">
        <el-col :span="8">
          <el-input-number v-model="objectInfo.transformData.rotation.x" :step="1" label="X" size="small" />
        </el-col>
        <el-col :span="8">
          <el-input-number v-model="objectInfo.transformData.rotation.y" :step="1" label="Y" size="small" />
        </el-col>
        <el-col :span="8">
          <el-input-number v-model="objectInfo.transformData.rotation.z" :step="1" label="Z" size="small" />
        </el-col>
      </el-row>
    </div>

    <div class="section">
      <h4>缩放 Scale</h4>
      <el-row :gutter="10">
        <el-col :span="8">
          <el-input-number v-model="objectInfo.transformData.scale.x" :step="0.1" :min="0.01" label="X" size="small" />
        </el-col>
        <el-col :span="8">
          <el-input-number v-model="objectInfo.transformData.scale.y" :step="0.1" :min="0.01" label="Y" size="small" />
        </el-col>
        <el-col :span="8">
          <el-input-number v-model="objectInfo.transformData.scale.z" :step="0.1" :min="0.01" label="Z" size="small" />
        </el-col>
      </el-row>
    </div>

  </el-card>
</template>

<script setup>
import { selectObjectInfoStore } from '@/store/modules/SelectObjectInfo'
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
//     emit('update:modelValue', {
//       position: { ...transform.position },
//       rotation: { ...transform.rotation },
//       scale: { ...transform.scale },
//     })
//   },
//   { deep: true }
// )
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
