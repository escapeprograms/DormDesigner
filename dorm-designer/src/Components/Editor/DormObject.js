import * as THREE from 'three';
import _ from 'lodash';
import { getWallMeshes, getFloorMesh } from './three-objects/floor';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

//cursed legacy code sent by the devil himself :)
//NOTE: if collisions seem bugged, try refreshing the page and see if the issue is resolved.
function lineLineCross(a,b,c,d){
    //line 1: endpoint1 [x,y], endpoint2 [x,y],line 2: endpoint1 [x,y], endpoint2 [x,y]
    var m1 = (b[1]-a[1])/(b[0]-a[0]);
    var m2 = (d[1]-c[1])/(d[0]-c[0]);
    //find intersect point (TRUST THE ALGEBRA)
    var x = (-m2*c[0]+m1*a[0]+c[1]-a[1])/(m1-m2);
    if (b[0]-a[0] === 0){x = a[0];}
    if (c[0]-d[0] === 0){x = c[0];}
    var y = m1*(x-a[0])+a[1];
    if (b[1]-a[1] === 0){y = a[1];}
    if (c[1]-d[1] === 0){y = c[1];}
    var o = [a,b,c,d];
    for (var i = 0; i < 4; i++){
        for (var j = 0; j < 4; j++){
            if (o[i][1]<o[j][1]){
                var temp = o[i];
                o[i] = o[j];
                o[j] = temp;
            }
        }
    }
    if (!y){y = (o[1][1]+o[2][1])/2;}//vertical lines
    if ((x>=a[0]&&x<=b[0]||x>=b[0]&&x<=a[0])&&(x>=c[0]&&x<=d[0]||x>=d[0]&&x<=c[0])&&
    (y>=a[1]&&y<=b[1]||y>=b[1]&&y<=a[1])&&(y>=c[1]&&y<=d[1]||y>=d[1]&&y<=c[1])){
        return true;
    }
    return false;
}

//an object representing a footprint
class Footprint {
    constructor(vertices) {
        this.vertices = vertices; //array of Vector2
        this.dists = this.vertices.map(v => Math.sqrt((v.x * v.x) + (v.y * v.y)))
        this.angleOffsets = this.vertices.map(v => Math.atan2(v.y, v.x))

        this.mesh = new THREE.Mesh(this.geometry, new THREE.MeshBasicMaterial({ color: 0xff0000 }));
        this.mesh.translateZ(50);
        //rendering footprint
        this.updateMesh();
    }

    toJSON() {
        //return an array of anchor vertices
        let anchors = []; //[[x,y], ...]
        for (let j = 0; j < this.vertices.length; j ++) {
            //find anchor information
            let dist = this.dists[j];
            let angle2 = this.angleOffsets[j];
            
            anchors.push([Math.cos(angle2) * dist, Math.sin(angle2) * dist])
        }
        return anchors;
    }
    fromJSON(vertices) { //[[x,y], ...]
        return new Footprint(vertices.map(v => new THREE.Vector2(v[0], v[1])));
    }

    checkCollision(footprint) { //collision detection with another footprint
        for (let i = 0; i < footprint.vertices.length; i++){
            for (let j = 0; j < this.vertices.length; j++){
                let a = footprint.vertices[i];
                let b = footprint.vertices[(i+1)%footprint.vertices.length];
                let c = this.vertices[j];
                let d = this.vertices[(j+1)%this.vertices.length];
                let intersect = lineLineCross([a.x, a.y], [b.x, b.y], [c.x, c.y], [d.x, d.y]);
                if (intersect){
                    return true;
                }
            }
        }
        return false;
    }

    updateMesh() {
        this.shape = new THREE.Shape();
        // this.vertices.forEach(v => this.shape.lineTo(v.x, v.z));

        this.shape.moveTo(this.vertices[0].x, this.vertices[0].y)
        for (let i = 1; i < this.vertices.length; i++) {
            this.shape.lineTo(this.vertices[i].x, this.vertices[i].y)
        }
        this.shape.lineTo(this.vertices[0].x, this.vertices[0].y)

        this.geometry = new THREE.ShapeGeometry(this.shape);
        this.mesh.geometry = this.geometry;
    }

    clone() {
        return new Footprint(this.vertices.map(v => new THREE.Vector2(v.x, v.y)))
    }
}


class DormObject {
    constructor (id, meshPath) {
        this.id = id;
        this.isNew = true;
        this.meshPath = meshPath;
        this.mesh = new THREE.Mesh();
        this.loadMesh(); //TODO: ADD ACTUAL MESH FROM PATH

        //selection outline
        this.isSelected = false;
        this.selectionMesh = this.mesh.clone();
        this.selectionMesh.traverse((node) => {
            node.material = new THREE.MeshLambertMaterial({color:"white", wireframe:true});
        });
        this.selectionMesh.visible = false;

        //save each geometry's original material
        this.valid = true;
        this.regularMaterials = [];
        this.mesh.traverse((node) => {
            this.regularMaterials.push(node.material);
        });
        this.invalidMaterial = new THREE.MeshBasicMaterial({color:"red", transparent:true, opacity:0.5})

        //link meshes back to the DormObject
        this.mesh.traverse((node) => {
            node.item = this;
        });
    }

    loadMesh() {
        const modelLoader = new GLTFLoader();
        modelLoader.load(`${process.env.PUBLIC_URL}/${this.meshPath}`, (gltf) => {
            this.mesh = gltf.scene;
        })
    }

    select() {
        this.isSelected = true;
        this.selectionMesh.visible = true;
    }
    deselect() {
        this.isSelected = false;
        this.selectionMesh.visible = false;
    }

    //give feedback on whether it is valid/invald
    setInvalid() {
        this.valid = false;
        this.mesh.traverse((node) => {
            node.material = this.invalidMaterial;
        });
    }
    setValid() {
        this.valid = true;
        let i = 0;
        this.mesh.traverse((node) => {
            node.material = this.regularMaterials[i];
            i++;
        });
    }
}


class FloorItem extends DormObject {
    constructor (id, meshPath, footprints, height) {
        super(id, meshPath);
        this.position = new THREE.Vector3();
        this.rotation = 0; //y axis rotation
        this.footprints = footprints; //an array of Footprint that could collide with other footprints
        this.height = height; //max height of the object
    }
    toJSON() {
        return {
            //id: this.id,
            meshPath: this.meshPath,
            position: [this.position.x, this.position.y, this.position.z],
            rotation: this.rotation,
            height: this.height,
            footprints: this.footprints.map(f => f.toJSON())
        }
    }
    fromJSON(json) {
        let floorItem = new FloorItem(json._id, json.meshPath, json.footprints.map(f => Footprint.fromJSON(f)), json.height);
        floorItem.updateFootprints();
        floorItem.isNew = false;
        return floorItem;
    }

    translate(position) { //set the absolute position
        this.position = position;
        this.mesh.position.x = position.x;
        this.mesh.position.y = position.y;
        this.mesh.position.z = position.z;

        this.selectionMesh.position.x = position.x;
        this.selectionMesh.position.y = position.y;
        this.selectionMesh.position.z = position.z;

        //translate footprints
        this.updateFootprints();
    }
    
    rotate(angle) { //set the absolute angle
        this.rotation = angle;
        this.mesh.rotation.y = angle;

        this.selectionMesh.rotation.y = angle;
        
        //rotate footprints
        this.updateFootprints();
    }

    updateFootprints() {
        for (let i = 0; i < this.footprints.length; i++) {
            let v = this.footprints[i].vertices;
            for (let j = 0; j < v.length; j ++) {
                //find anchor information
                let dist = this.footprints[i].dists[j];
                let angle2 = this.footprints[i].angleOffsets[j];

                v[j].x = this.position.x + (Math.cos(this.rotation + angle2) * dist);
                v[j].y = -this.position.z + (Math.sin(this.rotation + angle2) * dist);
            }

            //update mesh
            this.footprints[i].updateMesh();
        }
    }
    
    checkCollision(floorItem) {
        //quick, dirty check first
        // let box1 = new THREE.Box3().setFromObject(this.mesh);
        // let box2 = new THREE.Box3().setFromObject(floorItem.mesh);
        // if (!box1.intersectsBox(box2)) {
        //     return false;
        // }
        //check the collisions 2D footprints with all footprints of floorItem
        for (let i = 0; i < this.footprints.length; i++) {
            for (let j = 0; j < floorItem.footprints.length; j++) {
                if (this.footprints[i].checkCollision(floorItem.footprints[j])) {
                    return true;
                }
            }
        }
        return false;

        //NOTE: When you move an object X, you must check collisions BOTH WAYS ex: Y.checkCollision(X) and X.checkCollision(Y) to account for LeggedItems
    }
    checkWallCollisions(floorVertices) {
        //check if the footprint collides with the walls
        for (let i = 0; i < this.footprints.length; i++) {
            let f = this.footprints[i];
            for (let j = 0; j < f.vertices.length; j ++) {
                for (let k = 0; k < floorVertices.length; k++) {
                    let a = floorVertices[k];
                    let b = floorVertices[(k+1)%floorVertices.length];
                    let c = f.vertices[j];
                    let d = f.vertices[(j+1)%f.vertices.length];
                    if (lineLineCross([a.x, a.y], [b.x, b.y], [c.x, c.y], [d.x, d.y])) {
                        return true;
                    }
                }
            }
            
        }
        return false;
    }
}

class LeggedItem extends FloorItem {
    constructor (id, meshPath, footprints, elevatedFootprint, height, legHeight) {
        super(id, meshPath, footprints, height);
        this.elevatedFootprint = elevatedFootprint; // a single elevated footprint
        this.legHeight = legHeight; //the maximum height of an object to be stored beneath here
    }

    checkCollision(floorItem) {
        //check collision as normal
        if (super.checkCollision(floorItem)) {
            return true;
        }
        //check y-height underneath a y-footprint
        //WARMING: THIS CODE IS UNTESTED
        if (floorItem.position.y + floorItem.height >= this.position.y + this.legHeight) {
            //check with elevatedFootprint if floorItem is too tall
            for (let j = 0; j < floorItem.footprints.length; j++) {
                if (this.elevatedFootprint.checkCollision(floorItem.footprints[j])) {
                    return true;
                }
            }
        }

        return false;
    }
}

class WallItem extends DormObject {
    constructor () {
        super();
        
        this.position = new THREE.Vector2(); //position on the wall
        this.rotation = 0; //rotation normal to the wall
    }
}

class DormLayout {
    constructor (floorVertices, walls, floor, defaultFurniture) {
        this.floorVertices = floorVertices;
        this.walls = walls;
        this.floor = floor;
        this.defaultFurniture = defaultFurniture;   
    }

    static createFromPlain(plainLayout) {
        
    }
}

class DormDesign {
    constructor (floorVertices, currentFurniture) {
        this.floorVertices = floorVertices;
        this.walls = getWallMeshes(floorVertices, 0xffffff, 6*12);
        this.floor = getFloorMesh(floorVertices, 0xaaaaaa);
        // this.layout = layout; //DormLayout object
        this.currentFurniture = currentFurniture;
    }
}


export {Footprint, DormObject, FloorItem, LeggedItem, WallItem, DormDesign, DormLayout} 