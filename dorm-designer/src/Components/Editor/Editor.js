import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import axios from 'axios'; 
import {OrbitControls} from 'three/addons/controls/OrbitControls.js'
import {getFloorMesh, getWallMeshes} from './three-objects/floor';
import { Footprint, DormObject, FloorItem } from './DormObject';
import _ from 'lodash'

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
        
        let floor;
        let walls = [];

        //User interactions and events
        let hoverSelection = null; //current mouse hover selection
        let clickSelection = null; //currently selected object
        let movingObject = false; //is the user moving an object?
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
            console.log("CLICKED SELECTION: ", clickSelection);
        }

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
            floor = getFloorMesh(vertices, 0xffffff);
            walls = getWallMeshes(vertices, 0xddccbb, 2);
    
    
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
            floor = getFloorMesh(vertices, 0xffffff);
            walls = getWallMeshes(vertices, 0xddccbb, 2);
    
    
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
        //NOTE: These Objects are all for testing and demonstration purposes
        //When creating a new DormObject of any kind, please ensure that the geometry, material, and footprint are all CLONED to avoid pointer errors
        let objects = [];
        let testGeometry = new THREE.BoxGeometry(1,1.5,1);
        let testGeometry2 = new THREE.BoxGeometry(3,1,1);
        let testFootprint =  new Footprint([new THREE.Vector2(-0.5,-0.5), new THREE.Vector2(-0.5,0.5), new THREE.Vector2(0.5,0.5), new THREE.Vector2(0.5,-0.5)]);
        let testFootprint2 =  new Footprint([new THREE.Vector2(-1.5,-0.5), new THREE.Vector2(-1.5,0.5), new THREE.Vector2(1.5,0.5), new THREE.Vector2(1.5,-0.5)]);

        objects.push(new FloorItem("id", new THREE.Mesh(testGeometry, material2.clone()), [testFootprint.clone()], 1.5));
        objects.push(new FloorItem("id2", new THREE.Mesh(testGeometry2, material2.clone()), [testFootprint2.clone()], 1));
        
        for (let i = 0; i < objects.length; i++) {
            group.add(objects[i].footprints[0].mesh) // draw the footprint, comment this out once testing is done
            scene.add(objects[i].mesh); 
        }
        // objects[0].translate(new THREE.Vector3(2,0,2))

        
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

        objects[0].translate(new THREE.Vector3(-3,0,0.9))
        
        objects[1].rotate(Math.PI/4)
        
        // objects[0].translate(new THREE.Vector3(2,0,2))
        
        // objects[0].footprints[0].updateMesh()
        const animate = () => {
            requestAnimationFrame(animate);

            // test code for demonstrating colliding
            if (objects[0].checkCollision(objects[1])) {
                console.log("collision!")
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