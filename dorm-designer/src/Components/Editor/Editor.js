import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import axios from 'axios'; 
import {OrbitControls} from 'three/addons/controls/OrbitControls.js'
import {getFloorMesh, getWallMeshes} from './three-objects/floor';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const Editor = () => {
    const mountRef = useRef(null);

    useEffect(() => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set( 0, 5, 15 );
        const renderer = new THREE.WebGLRenderer({antialias: true});

        scene.background = new THREE.Color(0xdddddd);

        renderer.setSize(window.innerWidth, window.innerHeight);
        mountRef.current.appendChild(renderer.domElement);
        

        const controls = new OrbitControls(camera, renderer.domElement);

        const group = new THREE.Group();
        group.rotateX(-Math.PI/2);
        
        

        const material2 = new THREE.MeshLambertMaterial({ color: 0xffff00 });
        


        //load floor
        axios.get('/api/layouts').then((data) => {
            console.log(data, "!!!!")
            let vertices = data.data[3].vertices.map((v) => {
                return new THREE.Vector2(v[0], v[1]);
            });
            //vertices = await fetch("/")
            vertices = vertices.map(v => {
                return v.multiplyScalar(2)
            });
            const floor = getFloorMesh(group, vertices, 0xffffff);
            const walls = getWallMeshes(group, vertices, 0xddccbb, 2);
    
    
            const loader = new THREE.TextureLoader();
    
            loader.load(`${process.env.PUBLIC_URL}/wood_texture.jpg`, (texture) => {
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.repeat.set(0.05, 0.05);
                texture.offset.set(0.8, 0.8);
                const material = new THREE.MeshPhongMaterial({map: texture});
                floor.material = material;
                scene.add(floor);
                console.log("changing material");
                renderer.render(scene, camera);
            });
    
            walls.forEach((wall) => scene.add(wall));

            //adding bed
            const modelsLoader = new GLTFLoader();

            let bedMesh;

            modelsLoader.load(`${process.env.PUBLIC_URL}/bed-all-together3.glb`, function ( gltf ) {
                bedMesh = gltf.scene;
                // scene.add(bedMesh);
                const bedJSON = bedMesh.toJSON();

                console.log(bedJSON);
                console.log(JSON.stringify(bedJSON, null, 2))

                const objectLoader = new THREE.ObjectLoader();
                const loadedBed = objectLoader.parse(bedJSON);

                scene.add(loadedBed);


            }, undefined, function (error) {

                console.error("model loading error: ", error);

            });

            

            console.log("LAYOUT REQUEST WORKS!");
        }).catch((e) => {
            console.log(e);
            console.log("LAYOUT FAIL")
            let vertices = [
                new THREE.Vector2(-3,-2.5),
                new THREE.Vector2(0,-2.5),
                // new THREE.Vector2(0,-1.5),
                // new THREE.Vector2(2,-1.5),
                // new THREE.Vector2(2,-2.5),
                // new THREE.Vector2(3,-2.5),
                // new THREE.Vector2(3,1.5),
                // new THREE.Vector2(2,1.5),
                // new THREE.Vector2(2,2.5),
                // new THREE.Vector2(-2,2.5),
                // new THREE.Vector2(-2,1.5),
                // new THREE.Vector2(-3,1.5),
                // new THREE.Vector2(-3,1),
                // new THREE.Vector2(-4,1),
                // new THREE.Vector2(-4,0),
                // new THREE.Vector2(-3,0),
                // new THREE.Vector2(-3,-1),
                // new THREE.Vector2(-4,-1),
                // new THREE.Vector2(-4,-2),
                // new THREE.Vector2(-3,-2),
                new THREE.Vector2(-3,-2.5)
            ];
            //vertices = await fetch("/")
            vertices = vertices.map(v => {
                return v.multiplyScalar(2)
            });
            const floor = getFloorMesh(group, vertices, 0xffffff);
            const walls = getWallMeshes(group, vertices, 0xddccbb, 2);
    
    
            const loader = new THREE.TextureLoader();
    
            loader.load(`${process.env.PUBLIC_URL}/wood_texture.jpg`, (texture) => {
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.repeat.set(0.05, 0.05);
                texture.offset.set(0.8, 0.8);
                const material = new THREE.MeshPhongMaterial({map: texture});
                floor.material = material;
                scene.add(floor);
                console.log("changing material");
                renderer.render(scene, camera);
            });
    
            walls.forEach((wall) => scene.add(wall));
        });

        // scene.add(group);
        
        // group.add(floor);
        // group.add(walls);

        // scene.add(group);

        const light = new THREE.AmbientLight(0xffffff, 1);
        scene.add(light);

        const lightD = new THREE.DirectionalLight(0xffddee);
        lightD.position.set(3, 3, 3);
        scene.add(lightD);

        lightD.target.position.set(0, 0, 0);
        scene.add(lightD.target);

        const lightB = new THREE.DirectionalLight(0xffddee);
        lightB.position.set(0, 0, 0);
        scene.add(lightB);

        lightB.target.position.set(10, 10, 10);
        scene.add(lightB.target);



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