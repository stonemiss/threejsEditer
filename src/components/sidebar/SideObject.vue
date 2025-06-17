
<template>
  <div class="right-side">
    <el-collapse  v-model="activeNames">
      <el-collapse-item title="对象属性" name="1" :icon="CaretRight">
        <div class="attribute-list">
          <span>位置:</span>
          <div>
            <el-input v-model="transform.position.x" style="width: 60px" placeholder="x" @change="changePosition" />
            <el-input v-model="transform.position.y" style="width: 60px" placeholder="y" @change="changePosition" />
            <el-input v-model="transform.position.z" style="width: 60px" placeholder="z" @change="changePosition" />
          </div>
        </div>
        <div class="attribute-list">
          <span>旋转:</span>
          <div>
            <el-input v-model="transform.rotation.x" style="width: 60px" placeholder="x" @change="changePosition"/>
            <el-input v-model="transform.rotation.y" style="width: 60px" placeholder="y" @change="changePosition"/>
            <el-input v-model="transform.rotation.z" style="width: 60px" placeholder="z" @change="changePosition"/>
          </div>
        </div>
        <div class="attribute-list">
          <span>缩放:</span>
          <div>
            <el-input v-model="transform.scale.x" style="width: 60px" placeholder="x" @change="changePosition"/>
            <el-input v-model="transform.scale.y" style="width: 60px" placeholder="y" @change="changePosition"/>
            <el-input v-model="transform.scale.z" style="width: 60px" placeholder="z" @change="changePosition"/>
          </div>
        </div>
        <div class="attribute-list">
          <span>显示标签:</span>
          <el-switch v-model="showLabel" />{{ showLabel ? '显示标签' : '隐藏标签' }}
        </div>
        <div class="attribute-list">
          <span>模型名称:</span>
          <el-input v-model="objName" style="width: 160px" @change="changeName" placeholder="模型名称" />
        </div>
      </el-collapse-item>
      <el-collapse-item title="材质属性" name="2" :icon="CaretRight">
        <div>
          颜色：
          <input type="color" :value="colorHex" @input="changeColor" />
        </div>
      </el-collapse-item>
      <el-collapse-item title="动画" name="3" :icon="CaretRight">
        <div class="attribute-list">
          <span>显示动画:</span>
        </div>
      </el-collapse-item>
      <el-collapse-item title="代码编辑" name="4" :icon="CaretRight">
        <div class="attribute-list">
          <span>代码编辑:</span>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script setup>
import * as THREE from 'three';
import { selectObjectInfoStore } from '@/store/modules/SelectObjectInfo'
import { useSceneStore } from '@/store/scene.js'
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { CaretRight } from '@element-plus/icons-vue'
const showLabel = ref(true)
const sceneStore = useSceneStore();
const emit = defineEmits(["update-modelValue"]);
const objectInfo = selectObjectInfoStore();


const transform = reactive({
  position: objectInfo.transformData.position,
  rotation: objectInfo.transformData.rotation,
  scale: objectInfo.transformData.scale,
})
const objName = ref()
const colorHex = computed(() => {
  const color = objectInfo?.material?.color;
  return color
});
const changePosition = ()=>{
  if (sceneStore.selectedObject) {
    console.log(123);
    updateModelValue()
  }
}
function changeColor(e) {
  objectInfo.material.color = e.target.value
  objectInfo.updateObjectColor(e.target.value)
}
const changeName = () => {
  if (sceneStore.selectedObject) {
    sceneStore.selectedObject.name =  objName.value
  }
}
const updateModelValue = ()=>{
  sceneStore.selectedObject.position.x = transform.position.x
  sceneStore.selectedObject.position.y = transform.position.y
  sceneStore.selectedObject.position.z = transform.position.z
  sceneStore.selectedObject.rotation.x = transform.rotation.x * THREE.MathUtils.DEG2RAD
  sceneStore.selectedObject.rotation.y = transform.rotation.y * THREE.MathUtils.DEG2RAD
  sceneStore.selectedObject.rotation.z = transform.rotation.z * THREE.MathUtils.DEG2RAD
  sceneStore.selectedObject.scale.x = transform.scale.x
  sceneStore.selectedObject.scale.y = transform.scale.y
  sceneStore.selectedObject.scale.z = transform.scale.z
}
watch(() => showLabel.value, (newValue, oldValue) => {
  const label = findLabelByUUID(sceneStore.selectedObjectId)
  if (label) {
    label.visible = newValue;
  }
})
function findLabelByUUID(uuid) {
  const myScene = sceneStore.scene
  const object = myScene.getObjectByProperty('uuid', uuid);
  if (!object) return null;

  // 查找这个 object 的子对象中有没有 CSS2DObject
  const label = object.children.find(child => child instanceof CSS2DObject);
  return label || null;
}

onMounted(() => {
  // objName = sceneStore.selectedObject.name
})
watch(() => sceneStore.selectedObject, (newValue, oldValue) => {
  console.log(newValue);
  if (sceneStore.selectedObject) {
    objName.value = newValue.name
  }
})
</script>

<style lang="scss" scoped>
:deep(.el-collapse-item__header){
  font-weight: bold;
}
.right-side{
  position: absolute;
  right: 0;
  top: 40px;
  width: 300px;
  height: calc(100vh - 40px);
  overflow: auto;
  // background: #f5f7fa;
  padding: 10px;
  box-sizing: border-box;
  .attribute-list{
    span{
      width: 80px;
    }
    display: flex;
    padding: 4px 0;
    align-items: center;
  }
}
// .object-transform-panel {
//   position: absolute;
//   right: 0;
//   top: 40px;
//   width: 300px;
//   background: #f5f7fa;
//   padding: 16px;
//   box-sizing: border-box;
// }
.section {
  margin-bottom: 16px;
}
.section h4 {
  margin-bottom: 8px;
  font-size: 14px;
  color: #333;
}
</style>
