import * as THREE from 'three';


//cursed legacy code sent by the devil himself :)
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
    }
    checkCollision(footprint) { //collision detection with another footprint
        for (let c = 0; c < footprint.vertices.length; c++){
            for (let d = 0; d < this.vertices.length; d++){
                let a = footprint.vertices[c];
                let b = footprint.vertices[(c+1)%footprint.vertices.length];
                let c = this.vertices[d];
                let d = this.vertices[(d+1)%this.vertices.length];
                let intersect = lineLineCross([a.x, a.y], [b.x, b.y], [c.x, c.y], [d.x, d.y]);
                if (intersect){
                    return true;
                }
            }
        }
        return false;
    }
}


class DormObject {
    constructor (id, mesh) {
        this.id = id;
        this.mesh = mesh;
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
        this.mesh.material.color.set("red")
    }
    deselect() {
        this.mesh.material.color.set("white")
    }

    translate(delta) {
        this.position.add(delta);
        this.mesh.translateX(delta.x);
        this.mesh.translateZ(delta.z);

        //TODO: move all footprints
        this.updateFootprints();
    }
    updateFootprints() {
        // Player.prototype.calcCorners = function(){
        //     var verts = tankTypes[this.type].vertices;
        //     for (var i = 0; i < verts.length; i++){
        //       var len = Math.sqrt((verts[i][0])**2+(verts[i][1])**2);
        //       var angle2 = Math.atan2(verts[i][1],verts[i][0]);
        //       this.corners[i] = [this.pos[0]+(Math.cos(this.angle+angle2) * len), this.pos[1]+(Math.sin(this.angle+angle2) * len)];
        //     }
        //     //OLD corner positions
        //     /*var len = Math.sqrt((playerDimensions[0]/2)**2+(playerDimensions[1]/2)**2);
        //     var angle2 = Math.atan(playerDimensions[1]/playerDimensions[0]);
            
        //     this.corners[0] = [this.pos[0]+(Math.cos(this.angle-angle2) * len), this.pos[1]+(Math.sin(this.angle-angle2) * len)];
        //     this.corners[1] = [this.pos[0]+(Math.cos(this.angle+angle2) * len), this.pos[1]+(Math.sin(this.angle+angle2) * len)];
        //     this.corners[2] = [this.pos[0]+(Math.cos(Math.PI+this.angle-angle2) * len), this.pos[1]+(Math.sin(Math.PI+this.angle-angle2) * len)];
        //     this.corners[3] = [this.pos[0]+(Math.cos(Math.PI+this.angle+angle2) * len), this.pos[1]+(Math.sin(Math.PI+this.angle+angle2) * len)];*/
        //   }
    }
    rotate(angle) {
        this.rotation += angle;

        //TODO: rotate all footprints around the centerx
    }
    
    checkCollision(floorItem) {
        //quick, dirty check first
        let box1 = new THREE.Box3().setFromObject(this.mesh);
        let box2 = new THREE.Box3().setFromObject(floorItem.mesh);
        if (!box1.intersectsBox(box2)) return false;

        //check the collisions 2D footprints with all footprints of floorItem
        for (let i = 0; i < this.footprints.length; i++) {
            for (let j = 0; j < floorItem.footprints.length; j++) {
                if (this.footprints[i].checkCollision(floorItem.footprints[j])) {
                    return true;
                }
            }
        }
        return false;

        //NOTE: When you move an object X, you must check ALL OTHER OBJECTS' checkCollision(), not X's
    }
    checkWallCollisions(walls) {
        //check if the footprint collides with the walls
    }
}

class LeggedItem extends FloorItem {
    constructor (id, mesh, footprints, elevatedFootprint, height, legHeight) {
        super(id, mesh, footprints, height);
        this.elevatedFootprint = elevatedFootprint; // a single elevated footprint
        this.legHeight = legHeight; //the maximum height of an object to be stored beneath here
    }

    checkCollision(floorItem) {
        super.checkCollision();
        //check y-height underneath a y-footprint
    }
}

class WallItem extends DormObject {
    constructor () {
        super();
        
        this.position = new THREE.Vector2(); //position on the wall
        this.rotation = 0; //rotation normal to the wall
    }
}

export {DormObject, FloorItem, WallItem} 