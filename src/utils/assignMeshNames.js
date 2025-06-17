// 自动添加物体名称
let modelCount = 0;
export function assignMeshNames(mesh) {
 if (!mesh.name) {
  modelCount++
  const modtype = getObjectType(mesh)
  mesh.name = `${modtype}_${modelCount}`
 }

  // scene.traverse((obj) => {
  //   if (obj.isMesh && (!obj.name || obj.name.trim() === '')) {
  //     obj.name = `Mesh_${mesh.uuid}`
  //   }
  // })
}
function getObjectType(obj) {
  if (obj.isMesh) {
    return obj.geometry?.type || 'Mesh';
  } else if (obj.isGroup) {
    return 'Group';
  } else if (obj.isLine) {
    return 'Line';
  } else if (obj.isPoints) {
    return 'Points';
  } else if (obj.isCamera) {
    return 'Camera';
  } else if (obj.isLight) {
    return 'Light';
  } else {
    return obj.type || 'Unknown';
  }
}
