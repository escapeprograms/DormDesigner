import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import axios from 'axios'; 
import {OrbitControls} from 'three/addons/controls/OrbitControls.js'
import {getFloorMesh, getWallMeshes} from './three-objects/floor';
import { DormObject, FloorItem } from './DormObject';

const Editor = () => {
    const mountRef = useRef(null);

    useEffect(() => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set( 0, 5, 15 );
        const renderer = new THREE.WebGLRenderer();

        scene.background = new THREE.Color(0xdddddd);

        renderer.setSize(window.innerWidth, window.innerHeight);
        mountRef.current.appendChild(renderer.domElement);

        const controls = new OrbitControls(camera, renderer.domElement);

        const group = new THREE.Group();
        group.rotateX(-Math.PI/2);
        
        //ray casting
        const raycaster = new THREE.Raycaster();
        let hoverSelection = null; //current mouse hover selection
        function getSelection(event) {
            const mouse = new THREE.Vector2();
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
          
            // Update the raycaster's origin and direction
            raycaster.setFromCamera(mouse, camera);
          
            // Intersect the ray with the scene
            const intersects = raycaster.intersectObjects(objects.map(o => o.mesh));
          
            // Check if the first intersected object is your cube
            if (intersects.length > 0) {
                hoverSelection = intersects[0].object;
            }
            else {
                hoverSelection = null;
            }
          }

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
            const floor = getFloorMesh(vertices, 0xffffff);
            const walls = getWallMeshes(vertices, 0xddccbb, 2);
    
    
            const loader = new THREE.TextureLoader();
    
            loader.load(`${process.env.PUBLIC_URL}/wood_texture.jpg`, (texture) => {
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.repeat.set(0.05, 0.05);
                texture.offset.set(0.8, 0.8);
                const material = new THREE.MeshPhongMaterial({map: texture});
                floor.material = material;
                group.add(floor);
                console.log("changing material");
                renderer.render(scene, camera);
            });
    
            walls.forEach((wall) => group.add(wall));
            console.log("LAYOUT REQUEST WORKS!");
        }).catch((e) => {
            console.log(e);
            console.log("LAYOUT FAIL")
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
            });
            const floor = getFloorMesh(vertices, 0xffffff);
            const walls = getWallMeshes(vertices, 0xddccbb, 2);
    
    
            const loader = new THREE.TextureLoader();
    
            loader.load(`${process.env.PUBLIC_URL}/wood_texture.jpg`, (texture) => {
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.repeat.set(0.05, 0.05);
                texture.offset.set(0.8, 0.8);
                const material = new THREE.MeshPhongMaterial({map: texture});
                floor.material = material;
                group.add(floor);
                console.log("changing material");
                renderer.render(scene, camera);
            });
    
            walls.forEach((wall) => group.add(wall));
        });

        //load objects
        let objects = [];
        let testGeometry = new THREE.BoxGeometry(1,1,1);
        let testFootprint =  [new THREE.Vector2(0,0), new THREE.Vector2(1,0), new THREE.Vector2(1,1), new THREE.Vector2(0,1)];

        objects.push(new FloorItem("id", new THREE.Mesh(testGeometry, material2), [testFootprint]));

        scene.add(objects[0].mesh);
        window.addEventListener('mousemove', getSelection);

        
        //rotate everything
        scene.add(group);
        
        //lighting

        const light = new THREE.AmbientLight(0xffffff, 1);
        scene.add(light);

        const lightD = new THREE.DirectionalLight(0xffddee);
        lightD.position.set(3, 3, 3);
        scene.add(lightD);

        lightD.target.position.set(0, 0, 0);
        scene.add(lightD.target);



        const animate = () => {
            requestAnimationFrame(animate);
            //get selection
            if (hoverSelection) {
                console.log(hoverSelection);
                hoverSelection.material.color.set("red");
            }
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