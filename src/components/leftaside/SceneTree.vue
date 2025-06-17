<!-- <template>
  <el-tree
    style="max-width: 400px"
    :data="modeList"
    :props="defaultProps"
    @node-click="getUID"
  />
</template>

<script  setup>
import sceneManager  from "@/core/three/sceneManager.js";
import { useSceneStore } from '@/store/scene.js'
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
const sceneStore = useSceneStore();
const getUID = (data) => {
  sceneStore.selectedObject = data //更新选中物体
  sceneStore.sceneTreeUid = data.uuid //更新选中物体UID
}
const modeList = sceneStore.modeList;
onMounted(() => {

  
});

const defaultProps = {
  children: 'children',
  label: 'name',
}
</script>
<style lang="scss" scoped>

</style> -->
<template>
  <el-tree
    :data="modeList"
    :props="defaultProps"
    @node-click="onNodeClick"
    highlight-current
  />
</template>

<script setup>
import * as THREE from 'three';
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { useSceneStore } from '@/store/scene.js'

//建立objectMap，方便通过UUID找回obj进行操作
const objectMap = new Map();
const sceneStore = useSceneStore();

onMounted(() => {

});

// ****转换函数：Object3D → 轻量节点 ，直接modeList=Object3D会因为3d内部结构复杂，el-tree直接引用会页面很卡顿
function convertObjectToNode(obj) {
  if (obj instanceof CSS2DObject) return null;
  const node = {
    uuid: obj.uuid,
    name: obj.name || obj.type,
    children: []
  };
   // 存储映射关系：uuid -> 原始 Object3D
  objectMap.set(obj.uuid, obj);
  for (const child of obj.children) {
    const c = convertObjectToNode(child);
    if (c) node.children.push(c);
  }
  return node;
}

// 用于渲染的树状结构
const modeList = computed(() => {
  const rootNodes = [];
  for (const child of sceneStore.modeList) {
    const node = convertObjectToNode(child);
    if (node) rootNodes.push(node);
  }
  return rootNodes;
});

// Vue 映射 props
const defaultProps = {
  children: 'children',
  label: 'name'
};

// 点击事件处理
const onNodeClick = (data) => {
  const selectedObj = objectMap.get(data.uuid);
  console.log('Selected Object3D:', selectedObj);
  sceneStore.selectedObject = selectedObj //更新选中物体
  sceneStore.sceneTreeUid = selectedObj.uuid //更新选中物体UID
  // 这里可以让选中物体高亮、聚焦、显示参数面板等
};
</script>

