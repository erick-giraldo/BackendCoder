import mongoose from "mongoose"

const cart = new mongoose.Schema({
    id: { type: Number, index: true },
    products: {
        type: [{
            _id: { type: mongoose.Schema.Types.ObjectId, ref: 'product' },
            quantity: { type: Number, require: true }
        }],
        default: []
    }
}, { timestamps: true })

export default mongoose.model('cart', cart);