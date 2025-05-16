// 自动添加物体名称

export function assignMeshNames(scene) {
  let meshIndex = 1

  scene.traverse((obj) => {
    if (obj.isMesh && (!obj.name || obj.name.trim() === '')) {
      obj.name = `Mesh_${meshIndex++}`
    }
  })
}
