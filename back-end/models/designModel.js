import mongoose from 'mongoose';

const designSchema = new mongoose.Schema({
    vertices: { type: [[Number]], required: true },
    userId: { type: Number, required: true },
    furnitureIds: { type: [String], required: true}
});

const Design = mongoose.model('Design', designSchema);
export default Design;