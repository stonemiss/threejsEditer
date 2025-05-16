import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { assignMeshNames } from '@/utils/assignMeshNames'

export function useAnyModelLoader(sceneStore, onModelLoaded = () => {}) {
  const loading = ref(false)
  const progress = ref(0)
  const error = ref(null)

  const gltfLoader = new GLTFLoader()
  const fbxLoader = new FBXLoader()

  const loadModel = (file) => {
    return new Promise((resolve, reject) => {
      const ext = file.name.split('.').pop().toLowerCase()
      const url = URL.createObjectURL(file)
      loading.value = true
      progress.value = 0
      error.value = null

      const onSuccess = (model) => {
        model.name = file.name.replace(/\..+$/, '')
        model.scale.set(1, 1, 1)
        sceneStore.addModelToScene(model)
        assignMeshNames(model)
        onModelLoaded(model)
        URL.revokeObjectURL(url)
        loading.value = false
        resolve(model)
      }

      const onError = (err) => {
        error.value = err
        loading.value = false
        URL.revokeObjectURL(url)
        reject(err)
      }

      // 自动选择加载器
      if (ext === 'gltf' || ext === 'glb') {
        gltfLoader.load(url,
          (gltf) => onSuccess(gltf.scene),
          (xhr) => progress.value = Math.floor((xhr.loaded / xhr.total) * 100),
          onError
        )
      } else if (ext === 'fbx') {
        fbxLoader.load(url,
          (fbx) => onSuccess(fbx),
          (xhr) => progress.value = Math.floor((xhr.loaded / xhr.total) * 100),
          onError
        )
      } else {
        loading.value = false
        reject(new Error('不支持的格式: ' + ext))
      }
    })
  }

  return {
    loadModel,//加载并添加模型到 scene
    loading,//是否正在加载
    progress,//加载进度（0-100）
    error //错误信息（如果有）
  }
}
