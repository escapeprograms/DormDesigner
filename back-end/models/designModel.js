import mongoose from 'mongoose';

const designSchema = new mongoose.Schema({
    vertices: { type: [[Number]], required: true },
    userId: { type: String, required: true },
    furnitureIds: { type: [String], required: true},
    name: {type: String, required: false}
});

const Design = mongoose.model('Design', designSchema);
export default Design;