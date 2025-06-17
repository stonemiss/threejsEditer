<template>
  <div ref="containerRef" class="three-container">
    <TransformToolbar @mode-change="onModeChange" />
    <ViewGizmo @view-change="changeCameraView" /> 
    <!-- <ObjectLabel
      :object3D="mesh"
      :camera="camera"
      :renderer="renderer"
      name="立方体A"
    /> -->
  </div>
</template>

<script setup>
import * as THREE from 'three';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { selectObjectInfoStore } from '@/store/modules/SelectObjectInfo'
import sceneManager  from "@/core/three/sceneManager.js";
import { useSceneStore } from '@/store/scene.js'
import { assignMeshNames } from '@/utils/assignMeshNames'

import TransformToolbar from "@/components/view/TransformToolbar.vue";
import ViewGizmo from "@/components/view/ViewGizmo.vue"; //右下角视图

import { markRaw } from 'vue';

const containerRef = ref(null);
// const scene = shallowRef(null); //shallowRef只遍历一层
const selectedObject = ref();
const mesh = markRaw(selectedObject); // 避免 Vue 响应式系统污染
const objectInfo = selectObjectInfoStore();
const transformInfo = reactive({
  position: objectInfo.transformData.position,
  rotation: objectInfo.transformData.rotation,
  scale: objectInfo.transformData.scale,
})
const ObjectColorInfo = reactive({
  color: objectInfo.material.color,

})
const sceneStore = useSceneStore();


const renderer = ref();
const camera = ref();
let raycaster;
let mouse;
let ground;
let transformControls = null;
let orbitControls = null;
let myScene = null;

function onModeChange(mode) {
  if (transformControls) {
    transformControls.setMode(mode);
  }
}

function changeCameraView(view) {
  const targetPos = {
    '+X': [5, 0, 0],
    '-X': [-5, 0, 0],
    '+Y': [0, 5, 0],
    '-Y': [0, -5, 0],
    '+Z': [0, 0, 5],
    '-Z': [0, 0, -5]
  };

  const pos = targetPos[view];
  if (pos) {
    camera.value.position.set(...pos);
    camera.value.lookAt(0, 0, 0); // 或你的模型中心
    orbitControls.update();
  }
}
onMounted(() => {
  myScene = new sceneManager(containerRef.value)
  
  sceneStore.scene = myScene.getScene();

  renderer.value = myScene.getRenderer();
  camera.value = myScene.getCamera();
  orbitControls = myScene.getControls();
  transformControls = myScene.transformControls;
  
  sceneStore.selectedObject = selectedObject.value

  // ground = new THREE.Mesh(
  //   new THREE.PlaneGeometry(100, 100),
  //   new THREE.MeshStandardMaterial({ color: 0x333333 })
  // )
  // ground.rotation.x = -Math.PI / 2
  // ground.name = 'ground'
  // myScene.addModel(ground)

  // 添加立方体
  const geometry = new THREE.BoxGeometry();
  const material1 = new THREE.MeshStandardMaterial({ color: 0xff0000 });
  const material2 = new THREE.MeshStandardMaterial({ color: 0x0000ff });

  const cube1 = new THREE.Mesh(geometry, material1);
  cube1.position.x = -2;

  const cube2 = new THREE.Mesh(geometry, material2);
  cube2.position.x = 2;
  // sceneStore.addModelToScene(cube1)
  // transformControls.attach(cube1);

  // myScene.addModel(cube1)
  // myScene.addModel(cube2)


  // 点击选择对象
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  renderer.value.domElement.addEventListener('pointerdown', (event) => {
    // 如果当前在使用 TransformControls 拖动，就不处理点击选中
    if (transformControls.dragging) return

    const rect = renderer.value.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(mouse, camera.value);

    // 只考虑场景中非 TransformControls 自己的物体
 
    const objects = myScene.scene.children.filter(obj =>
      obj.isMesh && obj !== transformControls.object
    )
    // const intersects = raycaster.intersectObjects(objects);
    // const intersects = raycaster.intersectObjects(myScene.modlist);
    const intersects = raycaster.intersectObjects(sceneStore.modeList);
 
  


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
      // console.log("选中对象：", selectedObject.value);
      // selectedObject.value.material.emissive.set(0xffff00); // 高亮颜色
      transformControls.attach(selectedObject.value);
      const newcolor = `#${selectedObject.value.material.color.getHexString()}`;
      // objectInfo.selectObject(intersects[0].object.uuid)//更新选中物体id;
      sceneStore.selectedObject = intersects[0].object//更新选中物体id;
      // objectInfo.updateObjectInfo(selectedObject.value)//更新移动信息;

    }else {
      selectedObject.value = null
      // objectInfo.selectObject('')
      sceneStore.selectedObjectId = ''
      transformControls.detach()
    }
  });


  transformControls.addEventListener('change', () => {
    // transformControls.value.updateMatrixWorld();
    const object = transformControls.object;
    if (object !== undefined) {
      objectInfo.updateObjectInfo(object);
    }
  });
  // drop 监听资源拖入
  const canvas = renderer.value.domElement
  canvas.addEventListener('dragover', e => e.preventDefault())
  canvas.addEventListener('drop', onDrop)
  
  // 监听按键删除
  window.addEventListener('keydown', onKeyDown)

});
function onDrop(event) {
  event.preventDefault()
  const type = event.dataTransfer.getData('type')
  if (!type) return
  addResourceModel(type, event)
}
//添加资源模型
function addResourceModel(type, event) {
  selectedObject.value = ''//清楚选中模型
  const rect = renderer.value.domElement.getBoundingClientRect()
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

  raycaster.setFromCamera(mouse, camera.value)

  const planeY = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0) // y=0 水平面
  const intersectPoint = new THREE.Vector3()
  raycaster.ray.intersectPlane(planeY, intersectPoint)

  if (!intersectPoint) return
  let geometry
  switch (type) {
    case 'box': geometry = new THREE.BoxGeometry(1, 1, 1); break
    case 'sphere': geometry = new THREE.SphereGeometry(0.5, 32, 32); break
    case 'cylinder': geometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32); break
    case 'torus': geometry = new THREE.TorusGeometry(0.5, 0.2, 16, 100); break
    case 'cone': geometry = new THREE.ConeGeometry(0.5, 1, 32); break
    case 'plane': geometry = new THREE.PlaneGeometry(1, 1); break
    case 'icosahedron': geometry = new THREE.IcosahedronGeometry(0.6); break
    case 'octahedron': geometry = new THREE.OctahedronGeometry(0.6); break
    case 'tetrahedron': geometry = new THREE.TetrahedronGeometry(0.6); break
    case 'torusKnot': geometry = new THREE.TorusKnotGeometry(0.4, 0.1, 100, 16); break
  }

  if (geometry) {
    const mesh = new THREE.Mesh(
      geometry,
      new THREE.MeshStandardMaterial({ color: Math.random() * 0xffffff })
    )
    mesh.position.copy(intersectPoint)
    mesh.position.y += 0.5
    assignMeshNames(mesh)//更新模型名称
    myScene.addModel(mesh)
    selectedObject.value = mesh//添加完模型默认选中
  }
}

function createLabeledBox(id, position, labelText) {
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const box = new THREE.Mesh(geometry, material);
  box.name = id;
  box.position.copy(position);
  myScene.addModel(box);

  const div = document.createElement('div');
  div.className = 'label';
  div.textContent = labelText;
  div.style.marginTop = '-1em';
  const label = new CSS2DObject(div);
  label.position.set(0, 1, 0); // 标签位置偏上
  box.add(label);
}





const updateModelValue = (val)=>{
  selectedObject.value.position.x = val.position.x
  selectedObject.value.position.y = val.position.y
  selectedObject.value.position.z = val.position.z
  selectedObject.value.rotation.x = val.rotation.x * THREE.MathUtils.DEG2RAD
  selectedObject.value.rotation.y = val.rotation.y * THREE.MathUtils.DEG2RAD
  selectedObject.value.rotation.z = val.rotation.z * THREE.MathUtils.DEG2RAD
  selectedObject.value.scale.x = val.scale.x
  selectedObject.value.scale.y = val.scale.y
  selectedObject.value.scale.z = val.scale.z
}
// 更新颜色
const updateModelColor =(val)=>{
  selectedObject.value?.material.color.set(val);
}
// 删除选中
function onKeyDown(event) {
  if (event.key === 'Delete' || event.key === 'Backspace') {
    if (!transformControls.object) return
    
    const target = transformControls.object
      // 移除所有 CSS2D 子对象
      target.children.forEach(child => {
        if (child.isCSS2DObject) {
          target.remove(child)
          sceneStore.scene.remove(child)// 防止直接 add 到 scene 的情况
        }
      })
    transformControls.detach()
    sceneStore.scene.remove(target)//  移除本体
      // 从数组中移除该物体
    const index = sceneStore.modeList.indexOf(target)
    if (index !== -1) sceneStore.modeList.splice(index, 1)
    
  }
}

watch(
  transformInfo,
  () => {
    if (selectedObject.value) {
      updateModelValue(transformInfo)
      // emit('update-modelValue', {
      //   position: { ...transform.position },
      //   rotation: { ...transform.rotation },
      //   scale: { ...transform.scale },
      // })
    }
  },
  { deep: true }
)
watch(() => objectInfo.material.color, (newValue, oldValue) => {
  if (selectedObject.value) {
    updateModelColor(newValue)
  }
})
// 监听选中物体id更新控制器选中
watch(() => sceneStore.sceneTreeUid, (newValue, oldValue) => {
  console.log(newValue);
  const object = sceneStore.scene.getObjectByProperty('uuid', newValue);
  if (!object) return;
  transformControls.attach(object);
})
</script>


<style scoped>
.three-container {
  position: absolute;
  top: 40px;
  left: 300px;
  width: calc(100% - 600px);
  height: calc(100% - 40px);
  overflow: hidden;
}

</style>

