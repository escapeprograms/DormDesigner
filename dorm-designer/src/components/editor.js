import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js'

import {getFloorMesh, getWallMeshes} from '../three-objects/floor';

const Editor = () => {
    const mountRef = useRef(null);

    useEffect(() => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set( 0, 5, 15 );
        const renderer = new THREE.WebGLRenderer();

        renderer.setSize(window.innerWidth, window.innerHeight);
        mountRef.current.appendChild(renderer.domElement);

        const controls = new OrbitControls(camera, renderer.domElement);


        //floor
        let vertices = [
            new THREE.Vector2(-3,-2.5),
            new THREE.Vector2(0,-2.5),
            new THREE.Vector2(0,-1.5),
            new THREE.Vector2(2,-1.5),
            new THREE.Vector2(2,-2.5),
            new THREE.Vector2(3,-2.5),
            new THREE.Vector2(3,1.5),
            new THREE.Vector2(2,1.5),
            new THREE.Vector2(2,2.5),
            new THREE.Vector2(-2,2.5),
            new THREE.Vector2(-2,1.5),
            new THREE.Vector2(-3,1.5),
            new THREE.Vector2(-3,1),
            new THREE.Vector2(-4,1),
            new THREE.Vector2(-4,0),
            new THREE.Vector2(-3,0),
            new THREE.Vector2(-3,-1),
            new THREE.Vector2(-4,-1),
            new THREE.Vector2(-4,-2),
            new THREE.Vector2(-3,-2),
            new THREE.Vector2(-3,-2.5)
        ];
        vertices = vertices.map(v => {
            return v.multiplyScalar(2)
        })

        const material2 = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        
        const group = new THREE.Group();
        group.rotateX(-Math.PI/2);

        getFloorMesh(group, vertices, 0xffff00);
        getWallMeshes(group, vertices, 0x0000ff, 2);
        
        scene.add(group);
        const animate = () => {
            requestAnimationFrame(animate);
        
            controls.update();
            renderer.render(scene, camera);
        };

        animate();

       

        return () => {
            mountRef.current.removeChild(renderer.domElement);
        };
    }, []);

    return <div ref={mountRef} />;
};

export default Editor;