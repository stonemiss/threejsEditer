<template>
  <div id="view-port"></div>
</template>

<script setup>
import * as THREE from "three";
import * as dat from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";

let scene, camera, renderer;
let selectedObject = null;
let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();

const init = () => {
  const viewDom = document.getElementById("view-port");
  const sizes = {
    width: viewDom.clientWidth,
    height: viewDom.clientHeight,
  };
  // create a scene, that will hold all our elements such as objects, cameras and lights.
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xcccccc);
  //添加地面辅助网格
  scene.add(new THREE.GridHelper(20, 20, 0x888888, 0x444444));
  // 初始化相机
  camera = new THREE.PerspectiveCamera(
    75,
    viewDom.clientWidth / viewDom.clientHeight,
    0.1,
    100
  );
  camera.position.set(5, 5, 10);

  //初始化渲染器
  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(sizes.width, sizes.height);
  viewDom.appendChild(renderer.domElement);

  //灯光
  const ambientLight = new THREE.AmbientLight(0xffffff);
  scene.add(ambientLight);
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(5, 10, 7.5);
  scene.add(light);

  // create controls for the GUI
  const controls = new (function () {
    // Add controls...
    this.scaleX = 1;
  })();
  // create the GUI
  // const gui = new dat.GUI();
  // gui.add(controls, 'scaleX', 0, 5);

  const orbitControls = new OrbitControls(camera, renderer.domElement);
  // orbitControls.enableDamping = true
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry, material);
  cube.position.set(2, 0, 0);
  scene.add(cube);
  const geometry2 = new THREE.SphereGeometry(1, 32, 32);
  const material2 = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
  const cube2 = new THREE.Mesh(geometry2, material2);
  cube2.position.set(1, 0, 1);
  scene.add(cube2);

  function tick() {
    requestAnimationFrame(tick);
    renderer.render(scene, camera);
  }
  tick();

  // 监听窗口变化
  const onWindowResize = () => {
    const aspect = viewDom.clientWidth / viewDom.clientHeight;
    camera.aspect = aspect;
    camera.updateProjectionMatrix();

    renderer.setSize(viewDom.clientWidth, viewDom.clientHeight);
  };
  window.addEventListener("resize", onWindowResize);

  // 初始化移动控制 TransformControls
  const transformControls = new TransformControls(camera, renderer.domElement);
  transformControls.attach(cube);
  scene.add(transformControls);

  // const gizmo = transformControls.getHelper();
  // scene.add(gizmo);

  // 禁用 orbitControls 控制器在拖拽时冲突
  transformControls.addEventListener("dragging-changed", (event)=> {
    orbitControls.enabled = !event.value;
  });

  transformControls.addEventListener("objectChange", () => {
    console.log("物体位置:", transformControls);
  });

  // 键盘切换模式
  document.addEventListener("keydown", (event) => {
    switch (event.key.toLowerCase()) {
      case "t":
        transformControls.setMode("translate");
        break;
      case "r":
        transformControls.setMode("rotate");
        break;
      case "s":
        transformControls.setMode("scale");
        break;
    }
  });

  const rect = viewDom.getBoundingClientRect(); // 获取容器位置
  const onMouseClick = (event) => {
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    console.log(mouse.x, mouse.y);
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children);

    // if (
    //   intersects.length > 0 &&
    //   intersects[0].object.type !== "GridHelper" &&
    //   intersects[0].object.type !== "Line"
    // ) {
    //   transformControls.attach(intersects[0].object);
    // }

    //  高亮显示
    if (intersects.length > 0) {
      // if (selectedObject) {
      //   selectedObject.material.emissive?.set(0x000000); // 清除上一个高亮
      // }
      // selectedObject = intersects[0].object;
      // if (!selectedObject.material.emissive) {
      //   selectedObject.material = new THREE.MeshStandardMaterial({
      //     color: selectedObject.material.color,
      //   });
      // }
      // console.log("选中对象：", selectedObject);
      // selectedObject.material.emissive.set(0xffff00); // 高亮颜色
      transformControls.attach(selectedObject);
    }
  };

  viewDom.addEventListener("click", onMouseClick);
};
onMounted(() => {
  init();
});
</script>

<style lang="scss" scoped>
#view-port {
  position: absolute;
  top: 40px;
  left: 0;
  width: 100%;
  height: calc(100% - 40px);
}
</style>
