import { defineStore } from 'pinia'
import * as THREE from 'three';
import { store } from '@/store';

export const selectObjectInfoStore = defineStore('objectInfo', {
  state: () => ({
    selectedObjectId: null,
    count: 0,
    transformData :{
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
    },
    material:{
      color: '#ffffff',
    }
  }),
  actions: {
    selectObject(id) {
      this.selectedObjectId = id;
    },
    updateObjectInfo(object) {
      // this.transformData.position.x = object.position.x.toFixed(3);
      this.transformData.position.x = object.position.x;
      this.transformData.position.y = object.position.y;
      this.transformData.position.z = object.position.z;
      this.transformData.rotation.x = object.rotation.x * THREE.MathUtils.RAD2DEG;
      this.transformData.rotation.y = object.rotation.y * THREE.MathUtils.RAD2DEG;
      this.transformData.rotation.z = object.rotation.z * THREE.MathUtils.RAD2DEG;
      // this.transformData.scale.x = object.scale.x.toFixed(3);
      this.transformData.scale.x = object.scale.x;
      this.transformData.scale.y = object.scale.y;
      this.transformData.scale.z = object.scale.z;
    },
    updateObjectColor(obj){
      this.material.color = obj
    },
    testInfo(){
      console.log(this.transformData);
    }
  }
})

// setup 之外使用
export function selectObjectInfoStoreWithOut() {
  return selectObjectInfoStore(store);
}