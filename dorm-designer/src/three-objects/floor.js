import * as THREE from 'three';


function getFloorMesh(scene, vertices, color) { //vertices: [THREE.vector2]
    
    const shape = new THREE.Shape( vertices );
    const geometry = new THREE.ShapeGeometry( shape );
    const mesh = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { color: color, side: THREE.DoubleSide } ) );
    mesh.rotateX(Math.PI/2);
    
    return mesh;
}



export default getFloorMesh