import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

import getFloorMesh from '../three-objects/floor';

const Editor = () => {
    const mountRef = useRef(null);
    //rotation settings
    let targetRotation = 0;
    let targetRotationOnPointerDown = 0;

    let pointerX = 0;
    let pointerXOnPointerDown = 0;

    useEffect(() => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set( 0, 5, 15 );
        const renderer = new THREE.WebGLRenderer();

        renderer.setSize(window.innerWidth, window.innerHeight);
        mountRef.current.appendChild(renderer.domElement);
        renderer.domElement.addEventListener( 'pointerdown', onPointerDown );


        //floor
        const vertices = [
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
            new THREE.Vector2(-3,-3)
        ];
        
        const material2 = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        const floor = getFloorMesh(scene, vertices, 0xffff00);

        
        const group = new THREE.Group();
        group.add(floor);
        scene.add(group);
        const animate = () => {
            requestAnimationFrame(animate);
        
            group.rotation.y = targetRotation;
            renderer.render(scene, camera);
        };

        animate();

        //rotate via mouse controls
        
        function onPointerDown( event ) {

            if ( event.isPrimary === false ) return;

            pointerXOnPointerDown = event.clientX - window.innerWidth/2;
            targetRotationOnPointerDown = targetRotation;

            document.addEventListener( 'pointermove', onPointerMove );
            document.addEventListener( 'pointerup', onPointerUp );

        }

        function onPointerMove( event ) {

        if ( event.isPrimary === false ) return;

        pointerX = event.clientX - window.innerWidth/2;

        targetRotation = targetRotationOnPointerDown + ( pointerX - pointerXOnPointerDown ) * 0.02;

        }

        function onPointerUp() {

        //if ( event.isPrimary === false ) return;

        document.removeEventListener( 'pointermove', onPointerMove );
        document.removeEventListener( 'pointerup', onPointerUp );

        }

        return () => {
        mountRef.current.removeChild(renderer.domElement);
        };
    }, []);

    return <div ref={mountRef} />;
};

export default Editor;