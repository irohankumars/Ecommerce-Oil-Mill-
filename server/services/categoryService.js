// Category business logic.
import Category from "../models/Category.js";
import { ApiError } from "../utils/ApiError.js";
import { slugify } from "../utils/slugify.js";

export function listCategories() {
  return Category.find().sort({ name: 1 });
}

export async function getCategory(idOrSlug) {
  const query = /^[0-9a-fA-F]{24}$/.test(idOrSlug) ? { _id: idOrSlug } : { slug: idOrSlug };
  const category = await Category.findOne(query);
  if (!category) throw new ApiError("Category not found.", 404);
  return category;
}

export function createCategory(payload) {
  return Category.create({ ...payload, slug: payload.slug || slugify(payload.name) });
}

export async function updateCategory(id, payload) {
  const updates = payload.name && !payload.slug ? { ...payload, slug: slugify(payload.name) } : payload;
  const category = await Category.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
  if (!category) throw new ApiError("Category not found.", 404);
  return category;
}

export async function deleteCategory(id) {
  const category = await Category.findByIdAndDelete(id);
  if (!category) throw new ApiError("Category not found.", 404);
  return category;
}
