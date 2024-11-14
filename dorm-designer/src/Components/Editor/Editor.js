import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import axios from 'axios'; 
import {OrbitControls} from 'three/addons/controls/OrbitControls.js'
import {getFloorMesh, getWallMeshes} from './three-objects/floor';
import { Footprint, DormObject, FloorItem } from './DormObject';
import _ from 'lodash'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// import testDesign from './three-objects/testDesign.js';
import print from './printJSON.js';

import { useParams } from 'react-router-dom';
import {saveDesign, loadDesign} from './saveDesign.js';
import { getDesignById } from '../../services/designServices.js';
import { updateItemById, createItem, getItemById } from '../../services/itemServices';
import bedJSON from './three-objects/bedModel.json';
import deskJSON from './three-objects/deskModel.json'
import dresserJSON from './three-objects/dresserModel.json';

 

const handleSave = () => {
    console.log("save button clicked");
};
const ControlsPopup = ({ onClose }) => {
    return (
        <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            color: 'black',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)',
            zIndex: 1000
        }}>
            <h2 style={{color: 'black'}}>Editor Controls</h2>
            <ul>
                <li>Left Click Drag - rotate camera</li>
                <li>Right Click Drag - pan camera</li>
                <li>Click Dorm Item - select</li>
                <li>Click + Drag Dorm Item - move item</li>
                <li>Select Item, then left/right arrow keys - rotate item</li>
            </ul>
            <button onClick={onClose}>Close</button>
        </div>
    );
};


const Editor = () => {
    const { userId, designId } = useParams();
    const mountRef = useRef(null);
    const [showPopup, setShowPopup] = useState(true);

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

        let floorVertices;
        let floor;
        let objects = [];

        // ----------------------------------------------------------
        const modelLoader = new GLTFLoader();
        const JSONLoader = new THREE.ObjectLoader();
        const gettingJSONs = {
            "bed-centered.glb": bedJSON,
            "desk-centered.glb": deskJSON,
            "dresser-centered2.glb": dresserJSON
        }

        async function asyncStuff() {
            const databaseDesign = await getDesignById(designId);
            console.log("database design", databaseDesign);

            const databaseFurniture = await Promise.all(databaseDesign.furnitureIds.map(id => getItemById(id)));
            console.log("database furniture", databaseFurniture);

            const floorItems = [];
            for(let i=0; i<databaseFurniture.length; i++) {
                const jsonModel =  gettingJSONs[databaseFurniture[i].meshPath];
                const mesh = JSONLoader.parse(jsonModel);
                const footprintVectors = databaseFurniture[i].footprints.map((v) => {
                    return new THREE.Vector2(v[0], v[1]);
                });
                console.log("footprint vectors", footprintVectors);
                const footprint = new Footprint(footprintVectors);
                const thisFloorItem = new FloorItem("askjdfn", mesh, [footprint.clone()], 15);
                console.log("floor item before", thisFloorItem);

                const p = databaseFurniture[i].position;
                // thisFloorItem.translate(new THREE.Vector3(p[0], p[1], p[2]));

                console.log("floor item after", thisFloorItem);

                floorItems.push(thisFloorItem);
            }
        }

        asyncStuff();

        // loadDesign(designId).then(design => {
        //     console.log("done loading design");
            // const furniture = design.currentFurniture;

            // console.log("furniture from database, ", furniture);
            // console.log(design.currentFurniture);
            // floor = design.floor;
            // floorVertices = design.floorVertices
            // group.add(floor);
            // group.add(...design.walls);
            // const furniture = design.currentFurniture;

            // for(let i=0; i<furniture.length; i++) {
            //     objects.push(furniture[i]);
            //     console.log("added furniture", furniture[i]);
            //     //TODO: move this back into DormObject
            //     modelLoader.load(`${process.env.PUBLIC_URL}/${furniture[i].meshPath}`, (gltf) => {
            //         console.log("furniture", furniture[i])
            //         furniture[i].mesh = gltf.scene;
            //         //link meshes back to the DormObject
            //         furniture[i].mesh.traverse((node) => {
            //             node.item = this;
            //             console.log("node",node)
            //         });
            //         scene.add(furniture[i].mesh)

            //         console.log(scene)
            //     });
                
            // }
            // console.log(scene);
        // })
        
        


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

        function rotateSelection(event) {
            controls.enabled = true;
            console.log("rotate this object", clickSelection);
            if(clickSelection !== null) {
                if(clickSelection && event.key === "ArrowLeft") {
                    clickSelection.rotate(clickSelection.rotation + 15*Math.PI/180);
                } else if(clickSelection && event.key === "ArrowRight") {
                    clickSelection.rotate(clickSelection.rotation - 15*Math.PI/180);
                }
            }
            
        }

        //event listeners
        window.addEventListener('mousemove', getHoverSelection);
        window.addEventListener('mousedown', getClickSelection);
        window.addEventListener('mousemove', dragSelection);
        
        window.addEventListener('mousedown', setMouseDown);
        window.addEventListener('mouseup', setMouseUp);

        window.addEventListener('keydown', rotateSelection);

        /////////

        for (let i = 0; i < objects.length; i++) {
            // group.add(objects[i].footprints[0].mesh) // draw the red footprint, comment this out once testing is done
            scene.add(objects[i].selectionMesh)
            scene.add(objects[i].mesh); 
        }
        
        //rotate everything by 90 deg
        scene.add(group);
        
        //lighting
        const light = new THREE.AmbientLight(0xffffff, 0.7);
        scene.add(light);

        const lightD = new THREE.DirectionalLight(0xffddee, 1);
        lightD.castShadow = true;
        // const lightHelper = new THREE.DirectionalLightHelper(lightD, 10, 0xff0000);
        // scene.add(lightHelper);

        lightD.position.set(50, 100, -50);
        scene.add(lightD);

        lightD.target.position.set(20, 0, -20);
        scene.add(lightD.target);

        // const arrowDirection = new THREE.Vector3();
        // arrowDirection.subVectors(lightD.target.position, lightD.position).normalize();
        // const arrowHelper = new THREE.ArrowHelper(arrowDirection, lightD.position, 20, 0x00ff00); // Length 20, color green
        // scene.add(arrowHelper);


        const animate = () => {
            requestAnimationFrame(animate);

            for (let i = 0; i < objects.length; i ++) {
                objects[i].setValid();
                if (objects[i].checkWallCollisions(floor)) {
                    objects[i].setInvalid();
                }
                for(let j=0; j<objects.length; j++) {
                    if(j !== i && objects[i].checkCollision(objects[j])) {
                        objects[i].setInvalid();
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

    return (
        <div ref={mountRef}>
            {showPopup && <ControlsPopup onClose={() => setShowPopup(false)} />}
            
            <button 
                onClick={handleSave} 
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '80px', // Positioned to the left of the help button
                    backgroundColor: '#800000',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px 20px',
                    cursor: 'pointer',
                    zIndex: 1000,
                }}
            >
                Save
            </button>
            
            <button 
                onClick={() => setShowPopup(true)} 
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    fontSize: '20px',
                    cursor: 'pointer',
                    zIndex: 1000,
                }}
            >
                ?
            </button>
        </div>
    );
};

export default Editor;