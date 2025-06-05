<template>
  <div class="resource-panel">
    <div class="resource" v-for="item in modelList" :key="item.type" >
      <img :src="item.icon" :alt="item.label" draggable="true" :data-type="item.type" @dragstart="onDragStart"/>
      {{ item.label }}
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(["dragstart"]);

function onDragStart(e) {
  const type = e.target.dataset.type;
  e.dataTransfer.setData("type", type);
  emit("dragstart", type);
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
</script>

<style scoped>

.resource-panel {
  position: absolute;
  top: 40px;
  width: 300px;
  height: calc(100vh - 40px);
  background: #ffffff;
  display: flex;
  flex-flow: wrap;
  /* flex-wrap: wrap; */
  justify-content: space-between;
  align-content: flex-start;
  color: #333333;
  padding: 10px;
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
