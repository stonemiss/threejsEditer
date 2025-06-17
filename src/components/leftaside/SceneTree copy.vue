<template>
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
// 过滤掉物体上面的CSS2DObject标签
// function deepFilterCSS2DObjects(list) {
//   return list
//     .filter(obj => !(obj instanceof CSS2DObject))
//     .map(obj => {
//       const copy = { ...obj };
//       if (copy.children) {
//         copy.children = deepFilterCSS2DObjects(copy.children);
//       }
//       return copy;
//     });
// }
// const rawList = computed(() => sceneStore.modeList);
// const modeList = ref([]);

// watchEffect(() => {
//   modeList.value = deepFilterCSS2DObjects(rawList.value);
// });

// const modeList = computed(() => deepFilterCSS2DObjects(sceneStore.modeList));
const modeList = sceneStore.modeList;
onMounted(() => {
  // modeList.value = sceneStore.modeList
  
});

const defaultProps = {
  children: 'children',
  label: 'name',
}
</script>
<style lang="scss" scoped>

</style>