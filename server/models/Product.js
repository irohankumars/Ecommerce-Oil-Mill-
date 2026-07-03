// Product catalog model.
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, min: 0 },
    stock: { type: Number, default: 0, min: 0 },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    images: [{ url: { type: String, required: true }, publicId: { type: String } }],
    featured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

productSchema.index({ title: "text", description: "text" });

export default mongoose.model("Product", productSchema);
