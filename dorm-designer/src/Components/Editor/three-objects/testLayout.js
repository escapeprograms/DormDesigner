import * as THREE from 'three';
import bedJSON from './bedModel.json';
import deskJSON from './deskModel.json';
import dresserJSON from './dresserModel.json';
import {Footprint, DormObject, FloorItem, DormDesign, DormLayout} from "../DormObject.js";
import {getFloorMesh, getWallMeshes} from './floor';


const databaseLayoutObject = {
    vertices: [
        [168, 0],
        [168, 160],
        [0, 160],
        [0, 0],
        [168, 0]
    ],
    defaultFurniture: [
        {
            id: "id1",
            position: {x:1+84.8/2, y:0, z:-1-37.8/2},
            rotation: 0,
            footprints: [
                [-42.4, -18.9],
                [42.4, -18.9],
                [42.4, 18.9],
                [-42.4, 18.9],
                [-42.4, -18.9],
            ],
            mesh: bedJSON
        },
        {
            id: "id2",
            position: {x:2+85+12, y:0, z:-1-24},
            rotation: 0,
            footprints: [
                [-12, -24],
                [12, -24],
                [12, 24],
                [-12, 24],
                [-12, -24]
            ],
            mesh: deskJSON
        },
        {
            id: "id3",
            position: {x:150, y:0, z:-16},
            rotation: 90*Math.PI/180,
            footprints: [
                [-12, -15],
                [12, -15],
                [12, 15],
                [-12, 15],
                [-12, -15],
            ],
            mesh: dresserJSON
        }
    ],
}

//getting floor and walls
const floorVertices = databaseLayoutObject.vertices.map((v) => {
    return new THREE.Vector2(v[0], v[1]);
});
const walls = getWallMeshes(floorVertices, 0xffffff, 6*12);
const floor = getFloorMesh(floorVertices, 0xaaaaaa, 10);

//loading furniture
const JSONLoader = new THREE.ObjectLoader();

const defaultFurniture = databaseLayoutObject.defaultFurniture.map((o) => {
    const mesh = JSONLoader.parse(o.mesh);
    const footprintVectors = o.footprints.map((v) => {
        return new THREE.Vector2(v[0], v[1]);
    });
    const footprint = new Footprint(footprintVectors);
    const thisItem = new FloorItem(o.id, mesh, [footprint.clone()], 15);
    const p = o.position;
    thisItem.translate(new THREE.Vector3(p.x, p.y, p.z));
    thisItem.rotate(o.rotation);
    return thisItem;
});

const dormLayoutObject = new DormLayout(floorVertices, walls, floor, defaultFurniture);

export default dormLayoutObject;