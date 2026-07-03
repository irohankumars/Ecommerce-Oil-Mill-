// Upload service prepared for Cloudinary integration.
import cloudinary from "../config/cloudinary.js";
import { env } from "../config/env.js";

export async function uploadImage(file) {
  if (!env.cloudinary.cloudName || !env.cloudinary.apiKey || !env.cloudinary.apiSecret) {
    return {
      url: `/uploads/${file.originalname}`,
      publicId: null,
      provider: "local-placeholder",
      message: "Cloudinary credentials not configured; upload pipeline is ready for integration.",
    };
  }

  const dataUri = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
  const result = await cloudinary.uploader.upload(dataUri, { folder: "velora/products", resource_type: "image" });
  return { url: result.secure_url, publicId: result.public_id, provider: "cloudinary" };
}
