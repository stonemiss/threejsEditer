<template>
  <div class="resource-content">
    <!-- 场景图层列表 -->
    <div class="sceneTree">
      <SceneTree/>
    </div>
    <!-- 场景资源列表 -->
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
     <el-tab-pane label="资源库" name="first">
      <div class="resource-panel">
        <div class="resource" v-for="item in modelList" :key="item.type" >
          <img :src="item.icon" :alt="item.label" draggable="true" :data-type="item.type" @dragstart="onDragStart"/>
          {{ item.label }}
        </div>
      </div>
     </el-tab-pane>
     <el-tab-pane label="模型库" name="second">
      <div>模型库</div>
     </el-tab-pane>
     <el-tab-pane label="标签库" name="third">
      <div>标签库</div>
     </el-tab-pane>

   </el-tabs>
   
  </div>
</template>

<script setup>
import SceneTree from "@/components/leftaside/SceneTree.vue"; 
const activeName = ref('first')
// const emit = defineEmits(["dragstart"]);
function onDragStart(e) {
  const type = e.target.dataset.type;
  e.dataTransfer.setData("type", type);
  // emit("dragstart", type);
}

const modelList = [
  { type: 'box', label: '方块', icon: '/src/assets/models/box.png' },
  { type: 'sphere', label: '球体', icon: '/src/assets/models/sphere.png' },
  { type: 'cylinder', label: '圆柱体', icon: '/src/assets/models/cylinder.png' },
  { type: 'torus', label: '圆环体', icon: '/src/assets/models/torus.png' },
  { type: 'cone', label: '圆锥体', icon: '/src/assets/models/cone.png' },
  { type: 'plane', label: '平面', icon: '/src/assets/models/plane.png' },
  { type: 'icosahedron', label: '二十面体', icon: '/src/assets/models/icosahedron.png' },
  { type: 'octahedron', label: '八面体', icon: '/src/assets/models/octahedron.png' },
  { type: 'tetrahedron', label: '四面体', icon: '/src/assets/models/tetrahedron.png' },
  { type: 'torusKnot', label: '圆环结', icon: '/src/assets/models/torusKnot.png' },
]
const handleClick = (tab, event) => {
  console.log(tab, event)
}
</script>

<style lang="scss" scoped>
.resource-content{
  position: absolute;
  top: 40px;
  width: 300px;
  height: calc(100vh - 40px);
  overflow: auto;
  background: #ffffff;
  padding: 10px;
  box-sizing: border-box;
  .sceneTree{
    height: 300px;
  }
}
.resource-panel {
  display: flex;
  flex-flow: wrap;
  justify-content: space-between;
  align-content: flex-start;
  color: #333333;
  /* padding: 10px; */
  box-sizing: border-box;

}
.resource {
  width: 86px;
  height: 100px;
  box-sizing: border-box;
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  background: #eeeeee;
  padding: 6px;
  margin-bottom: 10px;
  cursor: grab;
  font-size: 14px;
}
.resource img {
  width: 100%;
  /* height: 80px; */
  background-size: cover;
}
</style>
