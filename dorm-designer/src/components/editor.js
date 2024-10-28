import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const Editor = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#909090")

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({antialias: true} );

    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);
    renderer.shadowMap.enabled = true

    //CUBE -----------------------------------------------------------------
    const width = 0.5;
    const length = 12;
    const height = 6;

    const meshes = {};
    const objectsToLoad = 2;
    let objectsLoaded = 0;

    function onObjectLoaded(name, object) {
      meshes[name] = object;
      objectsLoaded++;
  
      // Check if all objects are loaded
      if (objectsLoaded === objectsToLoad) {
          createGroup();
      }
    }

    const geometry = new THREE.BoxGeometry(length, height, width);
    
    const material = new THREE.MeshLambertMaterial({ color: 0xddbaaa });
    const backWall = new THREE.Mesh(geometry, material);
    backWall.translateX(length/2)
    backWall.translateY(height/2)
    backWall.translateZ(width/2)
    scene.add(backWall);
    meshes['backWall'] = backWall;

    const leftWall = new THREE.Mesh(geometry, material);
    leftWall.rotateY(-Math.PI/2)
    
    leftWall.translateX(length/2)
    leftWall.translateY(height/2)
    leftWall.translateZ(-width/2)
    scene.add(leftWall)
    meshes['leftWall'] = leftWall;

    const rightWall = new THREE.Mesh(geometry, material);
    rightWall.rotateY(-Math.PI/2)
    scene.add(rightWall)

    rightWall.translateX(length/2)
    rightWall.translateY(height/2)
    rightWall.translateZ(-length+width/2)
    meshes['rightWall'] = rightWall;

    const frontWall = new THREE.Mesh(geometry, material);
    frontWall.translateX(length/2)
    frontWall.translateY(height/2)
    frontWall.translateZ(width/2+length)
    scene.add(frontWall)
    meshes['frontWall'] = frontWall;

    let floor;
    const loaderT = new THREE.TextureLoader();
    loaderT.load(`${process.env.PUBLIC_URL}/wood_pattern.jpg`, (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      const material = new THREE.MeshLambertMaterial({ map: texture });
      floor = new THREE.Mesh(new THREE.PlaneGeometry( length, length ), material)
      floor.rotateX(-Math.PI/2)
      floor.translateX(length/2)
      floor.translateY(-length/2)
      scene.add(floor);
      renderer.render(scene, camera);
      onObjectLoaded('floor', floor);
    });

    

    const loader = new GLTFLoader();
    loader.load(`${process.env.PUBLIC_URL}/window.glb`, (gltf) => {
        const model = gltf.scene;
        model.scale.set(0.02, 0.02, 0.08);
        // scene.add(model);  // Adds the loaded model to the scene
        rightWall.add(model);
        model.translateY(-1)
    });

    loader.load(`${process.env.PUBLIC_URL}/a_simple_bed.glb`, (gltf) => {
      const model = gltf.scene;
      model.scale.set(0.009, 0.009, 0.009);
      scene.add(model);
      model.rotateY(-Math.PI/2)
      model.translateZ(-3)
      model.translateX(4)
      onObjectLoaded('bed', model);
    });

    

    function createGroup() {
      const group = new THREE.Group();
      Object.values(meshes).forEach((mesh) => {
          group.add(mesh);
      });
      console.log("in create group");
      scene.add(group);

      const json = group.toJSON();
      const jsonString = JSON.stringify(json);
      console.log(jsonString);
    }

  


    //LIGHTS ----------------------------------------------------------
    const light = new THREE.DirectionalLight(0xffc8a6, 1)
    light.position.set(4, 4, 4)
    light.target.position.set(-5, 0, 0);
    scene.add(light.target);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)
    scene.add(light)

    camera.position.x = 4;
    camera.position.y = 15;
    camera.position.z = 20;
    camera.lookAt(4, 0, 0)

    const axesHelper = new THREE.AxesHelper(20);
    scene.add(axesHelper);

    // Set up OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(5, 5, 5);
    controls.update();

    // Animation loop
    function animate() {
      requestAnimationFrame(animate);

      // Update controls on each frame
      controls.update();

      renderer.render(scene, camera);
    }

    animate();


    // renderer.render(scene, camera);


    return () => {
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} />;
};

export default Editor;