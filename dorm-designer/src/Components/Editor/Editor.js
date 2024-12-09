import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// import testDesign from './three-objects/testDesign.js';

import { useParams } from 'react-router-dom';

import { ControlsPopup, NamePopup } from './Popups.js';
import { loadDesign, saveDesign } from './saveDesign.js';

 


const Editor = () => {
    const { userId, designId } = useParams();
    const mountRef = useRef(null);
    const [showPopup, setShowPopup] = useState(true);
    const [showNamePopup, setShowNamePopup] = useState(false);
    const [designName, setDesignName] = useState("");
    const [saveMessageVisible, setSaveMessageVisible] = useState(false);
    const floorVertices = useRef([])
    const objects = useRef([])
    const navigate = useNavigate();
    

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

        // important properties
        let floor;
        // ----------------------------------------------------------
        const modelLoader = new GLTFLoader();

        loadDesign(designId, scene).then(design => {
            console.log("Furniture List:", design.currentFurniture);

            floor = design.floor;
            floorVertices.current = design.floorVertices;

            group.add(floor);
            group.add(...design.walls);
            const furniture = design.currentFurniture;
            
            for(let i=0; i<furniture.length; i++) {
                objects.current.push(furniture[i]);
            }
            console.log("design name in loading in editor: ", design.name);
            if(design.name) {
                setDesignName(design.name);
            }

        })
        

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
            const intersects = raycaster.intersectObjects(objects.current.map(o => o.mesh));
          
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

        /////////FOOTPRINT
        // setTimeout(() => {
        //     for (let i = 0; i < objects.length; i++) {
        //         console.log(objects[i].footprints[0].mesh)
        //         objects[i].footprints[0].mesh.position.z = 50;
        //         group.add(objects[i].footprints[0].mesh) // draw the red footprint, comment this out once testing is done
        //     }
        //     console.log("group", group)
        // }, 3000)
        
        
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

            //check collisions
            for (let i = 0; i < objects.current.length; i ++) {
                objects.current[i].setValid();

                //check wall collision
                if (objects.current[i].checkWallCollisions(floor)) {
                    objects.current[i].setInvalid();
                }

                //check object collision with all other objects
                for(let j=0; j<objects.current.length; j++) {
                    if(j !== i && objects.current[i].checkCollision(objects.current[j])) {
                        objects.current[i].setInvalid();
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

    function handleSave() {
        console.log("design name: ", designName);
        if(designName === "" || designName === undefined) {
            setShowNamePopup(true);
        } else {
            saveMessageAppear();
            saveDesign(designId, userId, floorVertices.current, objects.current, designName);
        }
    }

    function handleNameChange(event) {
        console.log("changing name in handlenamechange: ", event.target.value);
        setDesignName(event.target.value);
    }

    function saveMessageAppear() {
        setSaveMessageVisible(true);
        setTimeout(() => {
            setSaveMessageVisible(false);
        }, 1000);
    }

    return (
        <div ref={mountRef}>
            {showPopup && <ControlsPopup onClose={() => setShowPopup(false)} />}
            {showNamePopup && <NamePopup 
                designName={designName}
                saveMessageAppear={saveMessageAppear}
                setShowNamePopup={setShowNamePopup}
                handleNameChange={handleNameChange} 
                onClose={() => setShowNamePopup(false)} 
                saveDesign={() => saveDesign(designId, userId, floorVertices.current, objects.current, designName)}/>}
            <input 
                type="text"
                value={designName}
                onChange={handleNameChange}
                style={{
                        position: 'fixed',
                        top: '20px',
                        left: '130px',
                        height: '40px',
                        boxSizing: 'border-box',

                        background: "rgba(0, 0, 0, 0)",
                        color: "white",
                        border: '0px',
                        outline: 'none',

                        fontSize: '2rem'
                }}
                placeholder='Untitled Design'
            >
            </input>
            <button 
                // onClick={()=>saveDesign(designId, userId, floorVertices.current, objects.current)}
                onClick={()=>handleSave()} 
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '80px', // Positioned to the left of the help button
                    height: '40px',
                    padding: '10px 20px',

                    backgroundColor: '#800000',
                    color: 'white',

                    border: 'none',
                    borderRadius: '8px',
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
                    backgroundColor: '#3395ff',
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

            {saveMessageVisible && 
                <p
                    style={{
                        position: 'fixed',
                        bottom: '12px',
                        right: '180px',
                    }}
                >
                    Changes Saved ✓
                </p>
            }
            <Link 
                to={`/dashboard/${userId}`} // Replace ':userId' dynamically

                style={{
                    position: 'fixed',
                    top: '80px',
                    left: '20px',

                    height: '20px',
                    padding: '10px 20px',
                    backgroundColor: '#800000',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',

                    cursor: 'pointer',
                    zIndex: 1000,
                    textDecoration: 'none', // Remove default link underline
                    display: 'inline-block', // Make it look like a button
                    textAlign: 'center',
                    lineHeight: '20px', // Center text vertically
                }}
            >

                Back
            </Link>

        </div>
    );
};

export default Editor;