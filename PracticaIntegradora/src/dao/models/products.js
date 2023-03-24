import mongoose from "mongoose";

const product = new mongoose.Schema({
  name: { type: String, require: true },
  description: { type: String, require: true },
  code: { type: String, require: true, unique: true },
  price: { type: Number, require: true },
  status: { type: Boolean, default: true },
  stock: { type: Number, require: true },
  category: { type: String, require: true },
  image: { type: String, require: true },
  id: { type: Number, index: true },
}, { timestamps: true })

export default mongoose.model("product", product);
