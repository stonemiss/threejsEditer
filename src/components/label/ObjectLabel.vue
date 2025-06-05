<template>
  <div class="label" ref="labelRef">
    12222222<br>
    名称：{{ name }}<br>
    坐标：{{ positionText }}<br>
    位置：{{ positionText }}
  </div>
</template>

<script setup>
import * as THREE from 'three';

const props = defineProps({
  object3D: Object,
  camera: Object,
  renderer: Object,
  name: String,
});

const labelRef = ref(null);
let animationFrame;

const positionText = computed(() => {

  const p = props.object3D?.position || { x: 0, y: 0, z: 0 };
  return `${p.x.toFixed(2)}, ${p.y.toFixed(2)}, ${p.z.toFixed(2)}`;
});

function updateLabel() {
  // console.log(props.object3D);
  animationFrame = requestAnimationFrame(updateLabel);

  if (!props.object3D || !props.camera || !props.renderer) return;

  const el = labelRef.value;
  const { camera, renderer, object3D } = props;

  const pos = new THREE.Vector3();
  object3D.getWorldPosition(pos);
  pos.project(camera);

  const widthHalf = renderer.domElement.clientWidth / 2;
  const heightHalf = renderer.domElement.clientHeight / 2;

  const x = pos.x * widthHalf + widthHalf;
  const y = -pos.y * heightHalf + heightHalf;
  console.log(`x:${x},y:${y}`);
  console.log(el);

  // el.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
  el.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
  el.style.display = pos.z > 1 || pos.z < -1 ? 'none' : 'block';
  


}
// function tick() {
//     requestAnimationFrame(tick);
//     console.log(123);
//   }
// tick();
onMounted(() => {
  updateLabel();
});

onBeforeUnmount(() => {
  cancelAnimationFrame(animationFrame);
});
</script>

<style scoped>
.label {
  position: absolute;
  padding: 6px 10px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border-radius: 4px;
  font-size: 12px;
  pointer-events: none;
  z-index: 100;
}
</style>
