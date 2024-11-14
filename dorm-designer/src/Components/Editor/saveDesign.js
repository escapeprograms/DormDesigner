import { updateDesignById, getDesignById } from '../../services/designServices';
import { updateItemById, createItem, getItemById } from '../../services/itemServices';
import { DormDesign, FloorItem } from './DormObject.js';
import * as THREE from 'three';

function saveDesign(designId, floorVertices, objects) {
    //update existing items
    let objectIds = [];
    for (let i = 0; i < objects.length; i++) {
        updateItemById(objects[i].id, objects[i].toJSON());
        objectIds.push(objects[i].id);
    }

    //create new Items if new items are ADDED
    //update design if new items are ADDED
    // 
    // updateDesignById(designId, {
    //     vertices: floorVertices,
    //     furnitureIds: objectIds
    // });
}

async function loadDesign(designId) {
    let design = await getDesignById(designId);
    console.log(design, "design!!!!!!!!!!!!!!!!!!")
    //load objects
    let furnitureIds = design.furnitureIds;
    console.log(furnitureIds, "furnitureIds")

    let furnitureJSON = await Promise.all(furnitureIds.map(id => getItemById(id)));
    console.log(furnitureJSON, "furniture JSON")

    let furniture = furnitureJSON.map(json => {
        if (json.type == "floor") {
            //return a flooritem object
            // return FloorItem.fromJSON(json);
            
        }
        //TODO: generalize
    });
    
    //load floor and walls
    const floorVertices = design.vertices.map((v) => {
        return new THREE.Vector2(v[0], v[1]);
    });

    let dormDesign = new DormDesign(floorVertices, furniture);
    return dormDesign;
}



export {saveDesign, loadDesign};