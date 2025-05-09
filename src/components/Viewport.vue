<template>
  <div id="app" @click="onAppClick">
    <div id="info">
      <button @click.stop="addBuilding">新增</button>
      <button @click.stop="showEditor">编辑</button>
      <button @click.stop="exportModelData">导出</button>
      <input type="file" @change="importModelData" ref="fileInput" />
    </div>
    <div id="editor" v-if="editorVisible" @click.stop>
      <h3>Edit Building</h3>
      <label for="color">Color:</label>
      <input type="color" id="color" v-model="selectedObjectProps.color" /><br />
      <label for="posX">Position X:</label>
      <input
        type="number"
        id="posX"
        v-model="selectedObjectProps.posX"
        step="0.1"
      /><br />
      <label for="posY">Position Y:</label>
      <input
        type="number"
        id="posY"
        v-model="selectedObjectProps.posY"
        step="0.1"
      /><br />
      <label for="posZ">Position Z:</label>
      <input
        type="number"
        id="posZ"
        v-model="selectedObjectProps.posZ"
        step="0.1"
      /><br />
      <label for="scaleX">Scale X:</label>
      <input
        type="number"
        id="scaleX"
        v-model="selectedObjectProps.scaleX"
        step="0.1"
      /><br />
      <label for="scaleY">Scale Y:</label>
      <input
        type="number"
        id="scaleY"
        v-model="selectedObjectProps.scaleY"
        step="0.1"
      /><br />
      <label for="scaleZ">Scale Z:</label>
      <input
        type="number"
        id="scaleZ"
        v-model="selectedObjectProps.scaleZ"
        step="0.1"
      /><br />
      <label for="rotX">Rotation X:</label>
      <input
        type="number"
        id="rotX"
        v-model="selectedObjectProps.rotX"
        step="0.1"
      /><br />
      <label for="rotY">Rotation Y:</label>
      <input
        type="number"
        id="rotY"
        v-model="selectedObjectProps.rotY"
        step="0.1"
      /><br />
      <label for="rotZ">Rotation Z:</label>
      <input
        type="number"
        id="rotZ"
        v-model="selectedObjectProps.rotZ"
        step="0.1"
      /><br />
      <button @click="applyEdit">保存</button>
      <button @click="deleteBuilding">删除</button>
    </div>
    <div ref="canvasContainer" style="width: 100vw; height: 100vh"></div>
  </div>
</template>

<script>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export default {
  data() {
    return {
      editorVisible: false,
      selectedObject: null,
      selectedObjectProps: {
        color: "#00ff00",
        posX: 0,
        posY: 0,
        posZ: 0,
        scaleX: 1,
        scaleY: 1,
        scaleZ: 1,
        rotX: 0,
        rotY: 0,
        rotZ: 0,
      },
      raycaster: null,
    };
  },
  mounted() {
    this.init();
    this.animate();
    window.addEventListener("resize", this.onWindowResize, false);
    this.loadModelData(); // Load saved model data on page load
  },
  methods: {
    init() {
      console.log("Initializing Three.js");

      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0xcccccc);
      this.camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      this.camera.position.set(0, 10, 20);
      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.$refs.canvasContainer.appendChild(this.renderer.domElement);
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);

      const light = new THREE.DirectionalLight(0xffffff, 1);
      light.position.set(5, 10, 7.5);
      this.scene.add(light);

      this.raycaster = new THREE.Raycaster();

      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
      this.cube = new THREE.Mesh(geometry, material);
      this.scene.add(this.cube);
    },
    onWindowResize() {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    },
    onAppClick(event) {
      const mouse = new THREE.Vector2();
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      this.raycaster.setFromCamera(mouse, this.camera);
      const intersects = this.raycaster.intersectObjects(this.scene.children, true);
      if (intersects.length > 0) {
        this.selectedObject = intersects[0].object;
        console.log("Object selected:", this.selectedObject);
        this.showEditor();
      }
    },
    addBuilding() {
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
      const building = new THREE.Mesh(geometry, material);
      building.position.set(Math.random() * 10 - 5, 0.5, Math.random() * 10 - 5);
      this.scene.add(building);
    },
    showEditor() {
      if (this.selectedObject) {
        this.editorVisible = true;
        this.updateEditor(this.selectedObject);
      }
    },
    updateEditor(object) {
      this.selectedObjectProps.color = `#${object.material.color.getHexString()}`;
      this.selectedObjectProps.posX = object.position.x;
      this.selectedObjectProps.posY = object.position.y;
      this.selectedObjectProps.posZ = object.position.z;
      this.selectedObjectProps.scaleX = object.scale.x;
      this.selectedObjectProps.scaleY = object.scale.y;
      this.selectedObjectProps.scaleZ = object.scale.z;
      this.selectedObjectProps.rotX = object.rotation.x;
      this.selectedObjectProps.rotY = object.rotation.y;
      this.selectedObjectProps.rotZ = object.rotation.z;
    },
    applyEdit() {
      if (this.selectedObject) {
        const color = this.selectedObjectProps.color;
        this.selectedObject.material.color.set(color);
        this.selectedObject.position.set(
          parseFloat(this.selectedObjectProps.posX),
          parseFloat(this.selectedObjectProps.posY),
          parseFloat(this.selectedObjectProps.posZ)
        );
        this.selectedObject.scale.set(
          parseFloat(this.selectedObjectProps.scaleX),
          parseFloat(this.selectedObjectProps.scaleY),
          parseFloat(this.selectedObjectProps.scaleZ)
        );
        this.selectedObject.rotation.set(
          parseFloat(this.selectedObjectProps.rotX),
          parseFloat(this.selectedObjectProps.rotY),
          parseFloat(this.selectedObjectProps.rotZ)
        );
      }
    },
    deleteBuilding() {
      if (this.selectedObject) {
        this.scene.remove(this.selectedObject);
        this.selectedObject = null;
        this.editorVisible = false;
      }
    },
    animate() {
      requestAnimationFrame(this.animate);
      this.renderer.render(this.scene, this.camera);
      this.controls.update();
    },
    exportModelData() {
      const modelData = {
        objects: this.scene.children
          .filter((obj) => obj instanceof THREE.Mesh) // 过滤出是 Mesh 对象的物体
          .map((obj) => ({
            position: obj.position.toArray(),
            scale: obj.scale.toArray(),
            rotation: obj.rotation.toArray(),
            color: `#${obj.material.color.getHexString()}`,
          })),
      };
      const jsonData = JSON.stringify(modelData);
      const blob = new Blob([jsonData], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = "model_data.json";
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    },
    importModelData(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const data = JSON.parse(reader.result);
            console.log("Imported data:", data); // 输出导入的完整数据，确保格式和内容正确

            this.clearScene();
            data.objects.forEach((objData, index) => {
              const geometry = new THREE.BoxGeometry();

              // 设置默认颜色为红色
              const color = new THREE.Color(0xff0000); // 红色

              // 如果数据中有颜色字段并且是合法的颜色值，则使用数据中的颜色
              if (objData.color && typeof objData.color === "string") {
                try {
                  color.set(objData.color);
                } catch (error) {
                  console.error(`Error parsing color for object ${index}:`, error);
                }
              } else {
                console.warn(`Invalid color value for object ${index}:`, objData.color);
              }

              const material = new THREE.MeshStandardMaterial({
                color: color,
                metalness: 0.5, // 示例中的金属度设置为0.5，可以根据需求调整
                roughness: 0.8, // 示例中的粗糙度设置为0.8，可以根据需求调整
              });
              const object = new THREE.Mesh(geometry, material);
              object.position.fromArray(objData.position);
              object.scale.fromArray(objData.scale);
              object.rotation.fromArray(objData.rotation);
              this.scene.add(object);
            });
          } catch (error) {
            console.error("Error importing model data:", error);
          }
        };
        reader.readAsText(file);
      }
    },
    clearScene() {
      while (this.scene.children.length > 0) {
        this.scene.remove(this.scene.children[0]);
      }
    },
    saveModelData() {
      const modelData = {
        objects: this.scene.children.map((obj) => ({
          position: obj.position.toArray(),
          scale: obj.scale.toArray(),
          rotation: obj.rotation.toArray(),
          color: `#${obj.material.color.getHexString()}`,
        })),
      };
      localStorage.setItem("modelData", JSON.stringify(modelData));
    },
    loadModelData() {
      const savedData = localStorage.getItem("modelData");
      if (savedData) {
        try {
          const data = JSON.parse(savedData);
          this.clearScene();
          data.objects.forEach((objData) => {
            const geometry = new THREE.BoxGeometry();
            const material = new THREE.MeshStandardMaterial({
              color: parseInt(objData.color.replace("#", "0x"), 16),
            });
            const object = new THREE.Mesh(geometry, material);
            object.position.fromArray(objData.position);
            object.scale.fromArray(objData.scale);
            object.rotation.fromArray(objData.rotation);
            this.scene.add(object);
          });
        } catch (error) {
          console.error("Error loading model data from localStorage:", error);
        }
      }
    },
  },
};
</script>

<style>
body {
  margin: 0;
  overflow: hidden;
}

canvas {
  display: block;
}

#info {
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(255, 255, 255, 0.8);
  padding: 10px;
}

#editor {
  position: absolute;
  top: 100px;
  left: 10px;
  background: rgba(255, 255, 255, 0.8);
  padding: 10px;
}
</style>

