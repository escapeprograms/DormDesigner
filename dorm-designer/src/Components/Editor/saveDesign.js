import { floor } from 'lodash';
import { updateDesignById, getDesignById } from '../../services/designServices.js';
import { updateItemById, createItem, getItemById } from '../../services/itemServices.js';
import { DormDesign, FloorItem } from './DormObject.js';
import * as THREE from 'three';

function saveDesign(designId, userId, floorVertices, objects) {
    console.log("Saving Design!");    

    //convert floorVertices to correct format
    let floorVerticesArr = floorVertices.map(v => [v.x, v.y]);


    //update existing items
    let objectIds = [];
    for (let i = 0; i < objects.length; i++) {
        console.log("item JSON:", objects[i].toJSON())
        updateItemById(objects[i].id, objects[i].toJSON());
        objectIds.push(objects[i].id);
    }

    //create new Items if new items are ADDED
    //update design if new items are ADDED
    // console.log("Updated Design Object:",{
    //     userId: userId,
    //     vertices: floorVerticesArr,
    //     furnitureIds: objectIds
    // });

    updateDesignById(designId, {
        userId: userId,
        vertices: floorVerticesArr,
        furnitureIds: objectIds
    });
}

async function loadDesign(designId, scene) {
    let design = await getDesignById(designId);
    //load objects
    let furnitureIds = design.furnitureIds;

    let furnitureJSON = await Promise.all(furnitureIds.map(id => getItemById(id)));

    let furniture = furnitureJSON.map(json => {
        if (json.type == "floor") {
            let floorItem = FloorItem.fromJSON(json, scene);
            return floorItem;
        }
        //TODO: generalize to other item types
    });
    
    //load floor and walls
    const floorVertices = design.vertices.map((v) => {
        return new THREE.Vector2(v[0], v[1]);
    });

    let dormDesign = new DormDesign(floorVertices, furniture);
    return dormDesign;
}



export {saveDesign, loadDesign};