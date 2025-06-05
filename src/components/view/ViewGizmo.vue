<template>
  <div ref="gizmoContainer" class="gizmo-container"></div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import * as THREE from "three";

const emit = defineEmits(["view-change"]);
const gizmoContainer = ref(null);

onMounted(() => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 10);
  camera.position.set(2, 2, 2);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(200, 200);
  renderer.setScissorTest(true);
  gizmoContainer.value.appendChild(renderer.domElement);

  // const materials = [
  //   new THREE.MeshBasicMaterial({ color: 'red' }),    // +X
  //   new THREE.MeshBasicMaterial({ color: 'green' }),  // -X
  //   new THREE.MeshBasicMaterial({ color: 'blue' }),   // +Y
  //   new THREE.MeshBasicMaterial({ color: 'yellow' }), // -Y
  //   new THREE.MeshBasicMaterial({ color: 'purple' }), // +Z
  //   new THREE.MeshBasicMaterial({ color: 'cyan' })    // -Z
  // ];
  const materials = [
    createTextMaterial("右"), // +X
    createTextMaterial("左"), // -X
    createTextMaterial("上"), // +Y
    createTextMaterial("下"), // -Y
    createTextMaterial("前"), // +Z
    createTextMaterial("后"), // -Z
  ];
  function createTextMaterial(text, bgColor = "#333", textColor = "#fff") {
    const size = 256;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, size, size);

    ctx.fillStyle = textColor;
    ctx.font = "bold 80px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, size / 2, size / 2);

    const texture = new THREE.CanvasTexture(canvas);
    return new THREE.MeshBasicMaterial({ map: texture });
  }

  const cube = new THREE.Mesh(new THREE.BoxGeometry(), materials);
  scene.add(cube);

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  renderer.domElement.addEventListener("click", (event) => {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(cube, true);

    if (intersects.length > 0) {
      const faceIndex = intersects[0].face.materialIndex;
      const viewNames = ["+X", "-X", "+Y", "-Y", "+Z", "-Z"];
      emit("view-change", viewNames[faceIndex]);
    }
  });

  function animate() {
    requestAnimationFrame(animate);
    // cube.rotation.y += 0.01;
    renderer.render(scene, camera);
  }
  animate();
});
</script>

<style lang="scss" scoped>
.gizmo-container {
  position: absolute;
  bottom: 10px;
  right: 10px;
  width: 200px;
  height: 200px;
  pointer-events: auto;
  z-index: 20;
}
</style>
