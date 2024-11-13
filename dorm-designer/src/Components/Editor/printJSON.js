import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

function print() {
    const loader = new GLTFLoader();

    loader.load(`${process.env.PUBLIC_URL}/dresser-centered2.glb`, function (gltf) {
        const o = gltf.scene;
        console.log(JSON.stringify(o.toJSON()));
    });

}

export default print;