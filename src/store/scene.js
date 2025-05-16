import { defineStore } from 'pinia'

export const useSceneStore = defineStore('scene', {
  state: () => ({
    scene: null,//场景信息
    selectedObject: null,//选中模型信息,目前先放在modules/selectobjectinfo里
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
