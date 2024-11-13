import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  id: { type: String, required: true },  // UUID
  type: { type: String, required: true, enum: ['floor', 'legged', 'wall'] }, 
  mesh: { type: Object, required: true }, 
  position: {
    type: [Number], 
    validate: {
      validator: function (value) {
        // Wall items should have 2 coordinates (x, y), others can have 3 (x, y, z)
        if (this.type === 'wall') return value.length === 2;
        return value.length === 3;
      },
      message: props => `${props.path} length is invalid for item type ${props.instance.type}`
    }
  },
  rotation: Number,
  footprints: [{ vertices: [{ x: Number, y: Number }] }],
  height: Number,

  // Optional fields specific to legged items
  elevatedFootprint: {
    type: [{ x: Number, y: Number }],
    required: function () { return this.type === 'legged'; } 
  },
  legHeight: {
    type: Number,
    required: function () { return this.type === 'legged'; } 
  }
});

const Item = mongoose.model('Item', itemSchema);
export default Item;
