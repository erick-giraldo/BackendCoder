import mongoose from "mongoose"

const cart = new mongoose.Schema({
    id: { type: Number, index: true },
    products: {
        type: [{
            product: { type: Number, require: true },
            quantity: { type: Number, require: true }
        }],
        default: []
    }
}, { timestamps: true })

export default mongoose.model('cart', cart);