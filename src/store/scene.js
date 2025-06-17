import { defineStore } from 'pinia'
import * as THREE from 'three';
import { store } from '@/store';
export const useSceneStore = defineStore('scene', {
  state: () => ({
    // scene: null,//场景信息
    scene: new THREE.Scene(),
    selectedObject: '',//选中模型信息,目前先放在modules/selectobjectinfo里
    sceneTreeUid: '',//场景树选列表中的UID，创建这个时因为场景树列表我过滤掉了css2dObject，通过这个UID再找物体
    modeList:[]
  }),
  actions: {
    setManager(manager) {
      this.scene = manager
    },
    addModelToScene(model) {
      if (this.scene) {
        this.scene.addModel(model)
      } else {
        console.warn('SceneManager 未初始化')
      }
    }
  }
})
// setup 之外使用
export function useSceneStoreWithOut() {
  return useSceneStore(store);
}