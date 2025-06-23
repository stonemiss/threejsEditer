// core/three/sceneManager.js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls'
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { selectObjectInfoStoreWithOut } from '@/store/modules/SelectObjectInfo.js'
import { useSceneStoreWithOut } from '@/store/scene.js'
const objectInfo = selectObjectInfoStoreWithOut();
const useSceneStroe = useSceneStoreWithOut()

// import Stats from 'three/examples/jsm/libs/stats.module.js' // 可选调试
// let modlist = []; //场景模型列表
export default class SceneManager {
  constructor(container) {
    this.container = container
    // this.modlist = modlist
    this.scene = new THREE.Scene()
    // this.scene = sceneStore.scene
    this.scene.background = new THREE.Color(0x0a192f)

    this.camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    )
    this.camera.position.set(2, 2, 5)

    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setSize(container.clientWidth, container.clientHeight)
    this.renderer.outputEncoding = THREE.sRGBEncoding
    container.appendChild(this.renderer.domElement)

    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.enableDamping = true
    this.controls.dampingFactor = 0.05

    this.transformControls = new TransformControls(this.camera, this.renderer.domElement);
    this.scene.add(this.transformControls.getHelper()); //添加.getHelper()解决版本不兼容问题
    //处理控制器冲突
    this.transformControls.addEventListener('dragging-changed', (event) => {
      this.controls.enabled = !event.value;
    });  
    //  初始化 CSS2DRenderer
    this.labelRenderer = new CSS2DRenderer();
    this.labelRenderer.setSize(container.clientWidth, container.clientHeight);
    this.labelRenderer.domElement.style.position = 'absolute';
    this.labelRenderer.domElement.style.top = '0px';
    this.labelRenderer.domElement.style.pointerEvents = 'none'; // 确保标签不阻挡鼠标事件
    container.appendChild(this.labelRenderer.domElement);

    this._addDefaultLights()
    this._onResize()
    window.addEventListener('resize', this._onResize.bind(this))

    // this.stats = new Stats()
    // container.appendChild(this.stats.dom)

    this.animate()
  }

  _addDefaultLights() {
    const directional = new THREE.DirectionalLight(0xffffff, 1)
    directional.position.set(5, 5, 5)
    this.scene.add(directional)

    const ambient = new THREE.AmbientLight(0xffffff, 0.4)
    this.scene.add(ambient)
  }

  _onResize() {
    const width = this.container.clientWidth
    const height = this.container.clientHeight
    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(width, height)
  }

  animate() {
    requestAnimationFrame(() => this.animate())
    this.controls.update()
    // this.stats && this.stats.update()
    this.renderer.render(this.scene, this.camera)
    this.labelRenderer.render(this.scene, this.camera);
  }
  _createLabeled(object3D){
    const div = document.createElement('div');
    div.className = 'label';
    div.textContent = "uuid: "+object3D.uuid;
    div.style.marginTop = '-1em';
    div.style.backgroundColor = 'rgba(0,0,0,0.4)'
    div.style.borderRadius = '20px'
    div.style.padding = '10px'
    div.style.color = '#ffffff'
    const label = new CSS2DObject(div);
    label.position.set(0, 1, 0); // 标签位置偏上
    object3D.add(label);

  }

  //  添加模型
  addModel(object3D) {
    this.scene.add(object3D)
    this._createLabeled(object3D)
    // objectInfo.selectedObjectId = object3D.uuid //更新选中物体UUID
    useSceneStroe.selectedObject = object3D //更新选中物体
    this.transformControls.attach(object3D)//添加模型自动聚焦
    // modlist.push(object3D)
    useSceneStroe.modeList.push(object3D)

  }

  //  清空场景（保留灯光等）
  clearScene() {
    const preserved = new Set(['AmbientLight', 'DirectionalLight'])
    this.scene.children = this.scene.children.filter(obj => {
      if (!preserved.has(obj.type)) {
        this.scene.remove(obj)
        if (obj.geometry) obj.geometry.dispose()
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach(m => m.dispose())
          } else {
            obj.material.dispose()
          }
        }
        return false
      }
      return true
    })
  }

  // 网格辅助线  
  // size -- 坐标格尺寸. 默认为 10.
// divisions -- 坐标格细分次数. 默认为 10.
// colorCenterLine -- 中线颜色. 值可以为 Color 类型, 16进制 和 CSS 颜色名. 默认为 0x444444
// // colorGrid -- 坐标格网格线颜色. 值可以为 Color 类型, 16进制 和 CSS 颜色名. 默认为 0x888888
  addGridHelper(size = 20, divisions = 20, colorCenterLine = 0xffffff, colorGrid = 0x444444 ) {
    const grid = new THREE.GridHelper(size, divisions,colorCenterLine,colorGrid)
    // 调整网格位置（默认在场景中心）
    grid.position.y = -0.5; // 放在地面上方
    // grid.material.opacity = 0.5; // 半透明
// grid.material.transparent = true;
    this.scene.add(grid)
  }

  // 坐标轴辅助线
  addAxesHelper(size = 5) {
    const axes = new THREE.AxesHelper(size)
    this.scene.add(axes)
  }

  // 获取核心组件
  getScene() { return this.scene }
  getCamera() { return this.camera }
  getRenderer() { return this.renderer }
  getControls() { return this.controls }

  // 清理
  dispose() {
    window.removeEventListener('resize', this._onResize)
    this.controls.dispose()
    this.renderer.dispose()
  }
}
