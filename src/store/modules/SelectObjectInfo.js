import { defineStore } from 'pinia'
import * as THREE from 'three';

export const selectObjectInfoStore = defineStore('objectInfo', {
  state: () => ({
    count: 0,
    transformData :{
      position: { x: 10, y: 20, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
    },
    material:{
      color: '#ffffff',
    }
  }),
  actions: {
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

