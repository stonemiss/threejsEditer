<template>
  <div class="top-menu">
    <el-dropdown placement="bottom-start">
      <span class="top-menu-el"> 文件 </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item>新建</el-dropdown-item>
          <el-dropdown-item>保存</el-dropdown-item>
          <el-dropdown-item>打开</el-dropdown-item>
          <el-dropdown-item>导入</el-dropdown-item>
          <el-dropdown-item>导出</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <!-- <div class="import">
      <el-button type="primary" @click="importMod">
        导入<el-icon class="el-icon--right"><Download /></el-icon>
      </el-button>
      <el-button type="primary">
        导出<el-icon class="el-icon--right"><Upload /></el-icon>
      </el-button>
    </div> -->

    <el-upload
      :show-file-list="false"
      :before-upload="handleUpload"
      accept=".gltf,.glb,.fbx"
    >
      <el-button type="primary">导入3D模型</el-button>
    </el-upload>

    <el-progress
      v-if="loading"
      :percentage="progress"
      status="active"
      :stroke-width="4"
      style=""
    />

   
  </div>
</template>

<script setup>
import {
  Delete,
  Edit,
  Search,
  Share,
  Download,
  Upload,
} from "@element-plus/icons-vue";
import { useAnyModelLoader } from "@/core/loader/modelLoader";
import { useSceneStore } from "@/store/scene.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from 'three';
const geometry = new THREE.BoxGeometry();
const material2 = new THREE.MeshStandardMaterial({ color: 0x0000ff });
const cube2 = new THREE.Mesh(geometry, material2);
cube2.position.x = 2;

const sceneStore = useSceneStore();
const { loadModel, loading, progress, error } = useAnyModelLoader(
  sceneStore,
  () => {
    // 可触发 mesh 刷新
    console.log("模型已添加到场景");
  }
);

const handleUpload = async (file) => {
  console.log(sceneStore.scene);
  try {
    // await loadModel(file);
    await loadModel(file);
    ElMessage.success("模型加载成功！");
  } catch (e) {
    ElMessage.error("模型加载失败");
    console.error(e);
  }
  return false;
};

function handleFileUpload(event) {
  // sceneStore.addModel(cube2)
  const file = event.target.files[0];
  if (!file) return;

  const loader = new GLTFLoader();
  const url = URL.createObjectURL(file); // 把文件转换成可加载的 URL
  loader.load(
    url,
    (gltf) => {
      sceneStore.addModel(gltf.scene);
      URL.revokeObjectURL(url); // 加载完释放资源
    },
    undefined,
    (error) => {
      console.error("模型加载失败：", error);
    }
  );
}
</script>

<style lang="scss" scoped>
.top-menu {
  top: 0;
  left: 0;
  height: 40px;
  border: none;
  display: flex;
  align-items: center;
  .top-menu-el {
    line-height: 40px;
    padding: 0 10px;
  }
}
:focus-visible {
  outline: none;
}
.example-showcase .el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}
</style>
