import * as THREE from 'three';


function getFloorMesh(vertices, color) { //vertices: [THREE.vector2]
    
    const shape = new THREE.Shape( vertices );

    const geometry = new THREE.ShapeGeometry( shape );
    const mesh = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: color, side: THREE.DoubleSide } ) );
    //mesh.rotateX(Math.PI/2);
    
    // scene.add(mesh);
    return mesh;
}

function getWallMeshes(vertices, color, height) { //vertices: [THREE.vector2]
    let meshes = [];
    const depth = 0.1
    for (let i = 0; i < vertices.length-1; i++) {
        let width = vertices[i].distanceTo(vertices[i+1])
        let wallGeometry = new THREE.BoxGeometry(width+depth, depth, height); //width+depth to extend at the corners
        let wallMesh = new THREE.Mesh( wallGeometry, new THREE.MeshLambertMaterial( { color: color, side: THREE.DoubleSide } ) );
        // scene.add(wallMesh);



        let center = new THREE.Vector2((vertices[i].x + vertices[i+1].x)/2, (vertices[i].y + vertices[i+1].y)/2);
        wallMesh.translateX(center.x);
        wallMesh.translateY(center.y);
        wallMesh.translateZ(height/2);

        let angle = Math.atan2(vertices[i+1].y - vertices[i].y, vertices[i+1].x - vertices[i].x);
        wallMesh.rotateZ(angle);

        meshes.push(wallMesh);
    }
    return meshes;
}


export {getFloorMesh, getWallMeshes} 