import * as THREE from 'three';
import _ from 'lodash';

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
        this.mesh.translateZ(3);
        //rendering footprint
        this.updateMesh();
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
    constructor (id, mesh) {
        this.id = id;
        this.mesh = mesh;
        this.mesh.item = this;
    }
}

class FloorItem extends DormObject {
    constructor (id, mesh, footprints, height) {
        super(id, mesh);
        this.position = new THREE.Vector3();
        this.rotation = 0; //y axis rotation
        this.footprints = footprints; //an array of Footprint that could collide with other footprints
        this.height = height; //max height of the object
    }
    select() {
        this.mesh.material.color.set("green")
    }
    deselect() {
        this.mesh.material.color.set("white")
    }

    translate(position) { //set the absolute position
        this.position = position;
        this.mesh.position.x = position.x;
        this.mesh.position.y = position.y + this.height/2;
        this.mesh.position.z = position.z;

        //translate footprints
        this.updateFootprints();
    }
    
    rotate(angle) { //set the absolute angle
        this.rotation = angle;
        this.mesh.rotation.y = angle;
        //rotate footprints
        this.updateFootprints();
    }

    updateFootprints() {
        for (let i = 0; i < this.footprints.length; i++) {
            let v = this.footprints[i].vertices;
            let anchors = this.footprints[i].anchors;
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
    constructor (id, mesh, footprints, elevatedFootprint, height, legHeight) {
        super(id, mesh, footprints, height);
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

export {Footprint, DormObject, FloorItem, LeggedItem, WallItem} 