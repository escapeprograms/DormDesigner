import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import axios from 'axios'; 
import {OrbitControls} from 'three/addons/controls/OrbitControls.js'
import {getFloorMesh, getWallMeshes} from './three-objects/floor';
import { Footprint, DormObject, FloorItem } from './DormObject';
import _ from 'lodash'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import testDesign from './three-objects/testDesign.js';

const Editor = () => {
    const mountRef = useRef(null);

    useEffect(() => {
        const renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.shadowMap.enabled = true;
        renderer.setSize(window.innerWidth, window.innerHeight);
        mountRef.current.appendChild(renderer.domElement);

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xaaaaaa);

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enabled = false;
        camera.position.set(84, 300, 50);
        controls.target.set(84, 0, -84);
        controls.update();

        const group = new THREE.Group();
        group.rotateX(-Math.PI/2);

        const axesHelper = new THREE.AxesHelper( 100 );
        scene.add(axesHelper);
        
        camera.position.set(84, 84, 84);
        const target = new THREE.Vector3(40, 0, -40);
        camera.lookAt(target);

        let floor;

        // const material3 = new THREE.MeshPhongMaterial({ color: 0xffffaa });
        // const plane = new THREE.PlaneGeometry(100, 100);
        // floor = new THREE.Mesh(plane, material3);
        // group.add(floor);

        // ----------------------------------------------------------
        
        let objects = [];
        console.log(testDesign.currentFurniture);
        floor = testDesign.layout.floor;
        group.add(floor);
        group.add(...testDesign.layout.walls);
        const furniture = testDesign.currentFurniture;
        console.log(furniture[0]);
        for(let i=0; i<furniture.length; i++) {
            objects.push(furniture[i]);
            console.log("this furniture", furniture[i]);
            scene.add(furniture[i].mesh);
        }
        


        //User interactions and events
        let hoverSelection = null; //current mouse hover selection
        let clickSelection = null; //currently selected object
        let mouseDown = false;
        
        function setMouseDown(event) {
            mouseDown = true;
        }
        function setMouseUp(event) {
            mouseDown = false;
        }

        const raycaster = new THREE.Raycaster();
        function getHoverSelection(event) {
            const mouse = new THREE.Vector2();
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
          
            // Update the raycaster's origin and direction
            raycaster.setFromCamera(mouse, camera);
          
            // Intersect the ray with the scene
            const intersects = raycaster.intersectObjects(objects.map(o => o.mesh));
          
            // Check if the first intersected object is your cube
            if (intersects.length > 0) {
                hoverSelection = intersects[0].object.item; //the .item is a special property to give back the related DormObject
            }
            else {
                hoverSelection = null;
            }
        }

        function getClickSelection(event) {
            if (clickSelection) clickSelection.deselect();
            clickSelection = hoverSelection;
            if (clickSelection) clickSelection.select();
            // console.log("CLICKED SELECTION: ", clickSelection);
        }

        controls.enabled = false;

        function dragSelection(event) {
            controls.enabled = true;

            if (clickSelection && mouseDown) {
                controls.enabled = false; //disable camera controls while dragging

                const mouse = new THREE.Vector2();
                mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
                mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            
                // Update the raycaster's origin and direction
                raycaster.setFromCamera(mouse, camera);
                
                //intersect ray with the floor
                const intersects = raycaster.intersectObjects([floor]);

                if (intersects.length > 0) {
                    let intersection = intersects[0].point;
                    clickSelection.translate(intersection);
                }
            }
        }

        //event listeners
        window.addEventListener('mousemove', getHoverSelection);
        window.addEventListener('mousedown', getClickSelection);
        window.addEventListener('mousemove', dragSelection);
        
        window.addEventListener('mousedown', setMouseDown);
        window.addEventListener('mouseup', setMouseUp);

        /////////

        for (let i = 0; i < objects.length; i++) {
            group.add(objects[i].footprints[0].mesh) // draw the red footprint, comment this out once testing is done
            // console.log("footprint", objects[i].footprints);
            scene.add(objects[i].mesh); 
        }
        
        //rotate everything by 90 deg
        scene.add(group);
        
        //lighting
        const light = new THREE.AmbientLight(0xffffff, 0.7);
        scene.add(light);

        const lightD = new THREE.DirectionalLight(0xffddee, 1);
        lightD.castShadow = true;
        const lightHelper = new THREE.DirectionalLightHelper(lightD, 10, 0xff0000);
        scene.add(lightHelper);

        lightD.position.set(50, 100, -50);
        scene.add(lightD);

        lightD.target.position.set(20, 0, -20);
        scene.add(lightD.target);

        const arrowDirection = new THREE.Vector3();
        arrowDirection.subVectors(lightD.target.position, lightD.position).normalize();
        const arrowHelper = new THREE.ArrowHelper(arrowDirection, lightD.position, 20, 0x00ff00); // Length 20, color green
        scene.add(arrowHelper);


        const animate = () => {
            requestAnimationFrame(animate);

            for (let i = 0; i < objects.length; i ++) {
                if (objects[i].checkWallCollisions(testDesign.floorVertices)) {
                    console.log("WALL collision")
                }
                for(let j=0; j<objects.length; j++) {
                    if(j !== i && objects[i].checkCollision(objects[j])) {
                        console.log("collision!")
                    }
                }
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