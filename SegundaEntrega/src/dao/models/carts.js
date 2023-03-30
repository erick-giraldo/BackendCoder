import mongoose, { Schema, SchemaType } from "mongoose"

const cart = new mongoose.Schema({
    id: { type: Number, index: true },
    products: {
        type: [{
            product: { type: Schema.Types.ObjectId, require: true },
            quantity: { type: Number, require: true }
        }],
        default: []
    }
}, { timestamps: true })

export default mongoose.model('cart', cart);