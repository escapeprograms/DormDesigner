import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { getFloorMesh, getWallMeshes } from './three-objects/floor';

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
    const mountRef = useRef(null);
    const [showPopup, setShowPopup] = useState(true);

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