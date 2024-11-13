import mongoose from 'mongoose';

const layoutSchema = new mongoose.Schema({
    vertices: { type: [[Number]], required: true },
    id: { type: Number, required: true },
    defaultFurnitureIds: { type: [String], required: true}
});

const Layout = mongoose.model('Layout', layoutSchema);
export default Layout;