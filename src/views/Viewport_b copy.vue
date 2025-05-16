<template>
  <div ref="containerRef" class="three-container"></div>
</template>

<script setup>

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { selectObjectInfoStore } from '@/store/modules/SelectObjectInfo'
import sceneManager  from "@/core/three/sceneManager.js";
import { useSceneStore } from '@/store/scene.js'
const containerRef = ref(null);
// const scene = shallowRef(null); //shallowRef只遍历一层
const selectedObject = ref();
const objectInfo = selectObjectInfoStore();
const manager = new sceneManager(containerRef.value)
const sceneStore = useSceneStore();
sceneStore.setManager(manager)


let myscene = null;
let renderer = null;
let camera = null;
let transformControls = null;
onMounted(() => {
  myscene =   new sceneManager(containerRef.value);
  renderer = myscene.getRenderer();
  camera = myscene.getCamera();
  transformControls = myscene.transformControls;

  sceneStore.setScene(myscene.getScene());
  sceneStore.flushModels();
  // 添加立方体
  const geometry = new THREE.BoxGeometry();
  const material1 = new THREE.MeshStandardMaterial({ color: 0xff0000 });
  const material2 = new THREE.MeshStandardMaterial({ color: 0x0000ff });

  const cube1 = new THREE.Mesh(geometry, material1);
  cube1.position.x = -2;

  const cube2 = new THREE.Mesh(geometry, material2);
  cube2.position.x = 2;

  myscene.addModel(cube1)
  // myscene.addModel(cube2)


  // 点击选择对象
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  renderer.domElement.addEventListener('pointerdown', (event) => {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(myscene.modlist);
    console.log("myscene.modlist---",myscene.modlist);


    if (intersects.length > 0) {

      if (selectedObject.value) {
        selectedObject.value.material.emissive?.set(0x000000); // 清除上一个高亮
      }
      selectedObject.value = intersects[0].object

      if (!selectedObject.value.material.emissive) {
        selectedObject.value.material = new THREE.MeshStandardMaterial({
          color: selectedObject.value.material.color,
        });
      }
      console.log("选中对象：", selectedObject.value);
      selectedObject.value.material.emissive.set(0xffff00); // 高亮颜色
      transformControls.attach(selectedObject.value);
      objectInfo.updateObjectInfo(selectedObject.value);

    }
  });


  transformControls.addEventListener('change', () => {
    // transformControls.value.updateMatrixWorld();
    const object = transformControls.object;
    if (object !== undefined) {
      objectInfo.updateObjectInfo(object);
    }
  });
});
</script>


<style scoped>
.three-container {
  position: absolute;
  top: 40px;
  left: 0;
  width: calc(100% - 300px);
  height: calc(100% - 40px);
  overflow: hidden;
}
</style>

