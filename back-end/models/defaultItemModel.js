import mongoose from 'mongoose';

const defaultItemSchema = new mongoose.Schema({
  id: { type: String, required: true},
  type: { type: String, required: true, enum: ['floor', 'legged', 'wall'] }, 
  meshPath: { type: String, required: true }, 
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
  footprints: [[[Number, Number]]],
  height: Number,

  // Optional fields specific to legged items
  elevatedFootprint: {
    type: [Number, Number],
    required: function () { return this.type === 'legged'; } 
  },
  legHeight: {
    type: Number,
    required: function () { return this.type === 'legged'; } 
  }
});

const DefaultItem = mongoose.model('DefaultItem', defaultItemSchema);
export default DefaultItem;
