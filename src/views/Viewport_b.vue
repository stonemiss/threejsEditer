<template>
  <div ref="containerRef" class="three-container"></div>
</template>

<script setup>

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TransformControls } from 'three/addons/controls/TransformControls.js';
import { selectObjectInfoStore } from '@/store/modules/SelectObjectInfo'
const objectInfo = selectObjectInfoStore();


const containerRef = ref(null);
const scene = shallowRef(null); //shallowRef只遍历一层
const camera = shallowRef(null);
const renderer = shallowRef(null);
const transformControls = shallowRef(null);
const selectedObject = ref();
onMounted(() => {
  // 初始化场景
  scene.value = new THREE.Scene();
  scene.value.background = new THREE.Color(0xcccccc);

  // 初始化相机
  const width = containerRef.value.clientWidth;
  const height = containerRef.value.clientHeight;
  camera.value = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  camera.value.position.set(0, 2, 6);

  // 初始化渲染器
  renderer.value = new THREE.WebGLRenderer({ antialias: true });
  renderer.value.setSize(width, height);
  containerRef.value.appendChild(renderer.value.domElement);

  // 添加光源
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(5, 5, 5);
  scene.value.add(light, new THREE.AmbientLight(0x404040));

  // 添加立方体
  const geometry = new THREE.BoxGeometry();
  const material1 = new THREE.MeshStandardMaterial({ color: 0xff0000 });
  const material2 = new THREE.MeshStandardMaterial({ color: 0x0000ff });

  const cube1 = new THREE.Mesh(geometry, material1);
  cube1.position.x = -2;

  const cube2 = new THREE.Mesh(geometry, material2);
  cube2.position.x = 2;

  scene.value.add(cube1, cube2);

  // 初始化控制器
  const orbitControls = new OrbitControls(camera.value, renderer.value.domElement);
  transformControls.value = new TransformControls(camera.value, renderer.value.domElement);
  scene.value.add(transformControls.value.getHelper());
  //添加.getHelper()解决版本不兼容问题
  // const gizmo = transformControls.value.getHelper();
  // scene.value.add(gizmo);

  // 点击选择对象
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  renderer.value.domElement.addEventListener('pointerdown', (event) => {
    const rect = renderer.value.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera.value);
    const intersects = raycaster.intersectObjects([cube1, cube2]);
    // const intersects = raycaster.intersectObjects(scene.children);


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
      transformControls.value.attach(selectedObject.value);
      objectInfo.updateObjectInfo(selectedObject.value);
      objectInfo.testInfo();

    }
  });

  transformControls.value.addEventListener('dragging-changed', (event) => {
    orbitControls.enabled = !event.value;
  });

  // 渲染循环
  const animate = () => {
    requestAnimationFrame(animate);
    renderer.value.render(scene.value, camera.value);
  };
  animate();

  // 处理窗口大小变化
  window.addEventListener('resize', () => {
    const width = containerRef.value.clientWidth;
    const height = containerRef.value.clientHeight;
    camera.value.aspect = width / height;
    camera.value.updateProjectionMatrix();
    renderer.value.setSize(width, height);
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

