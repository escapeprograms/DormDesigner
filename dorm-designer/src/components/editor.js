import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js'

import {getFloorMesh, getWallMeshes} from '../three-objects/floor';

const Editor = () => {
    const mountRef = useRef(null);

    useEffect(() => {
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xdddddd);

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set( 0, 5, 15 );

        const renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.shadowMap.enabled = true;
        renderer.setSize(window.innerWidth, window.innerHeight);
        const controls = new OrbitControls(camera, renderer.domElement);

        mountRef.current.appendChild(renderer.domElement);


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

        //vertices = await fetch("/")
        vertices = vertices.map(v => {
            return v.multiplyScalar(2)
        })
        
        const group = new THREE.Group();
        group.rotateX(-Math.PI/2);

        const floor = getFloorMesh(group, vertices, 0xffffff);
        const walls = getWallMeshes(group, vertices, 0xddccbb, 2);

        //adding the wood texture to the floor
        const loader = new THREE.TextureLoader();
        loader.load(`${process.env.PUBLIC_URL}/wood_texture.jpg`, (texture) => {
            texture.repeat.set(0.05, 0.05);
            texture.offset.set(0.8, 0.8);
            floor.material = new THREE.MeshPhongMaterial({map: texture});
            floor.receiveShadow = true;
            scene.add(floor);
        });

        walls.forEach((wall) => {
          wall.castShadow = true;
          scene.add(wall);
        });

        const light = new THREE.AmbientLight(0xffffff, 1);
        scene.add(light);

        const lightD = new THREE.DirectionalLight(0xffddee);
        lightD.position.set(3, 1, 3);
        lightD.castShadow = true;
        lightD.shadow.mapSize.width = 1024;
        lightD.shadow.mapSize.height = 1024;
        lightD.shadow.camera.near = 0.001;
        lightD.shadow.camera.far = 500;
        lightD.shadow.bias = -1;
        lightD.target.position.set(0, 0, 0);
        scene.add(lightD);
        scene.add(lightD.target);

        // const axesHelper = new THREE.AxesHelper(5);
        // scene.add(axesHelper);

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