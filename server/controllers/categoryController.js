// Category controller handles storefront and admin category operations.
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { createCategory, deleteCategory, getCategory, listCategories, updateCategory } from "../services/categoryService.js";

export const getCategories = asyncHandler(async (_req, res) => {
  const categories = await listCategories();
  sendSuccess(res, 200, "Categories fetched successfully", { categories });
});

export const getCategoryByIdOrSlug = asyncHandler(async (req, res) => {
  const category = await getCategory(req.params.idOrSlug);
  sendSuccess(res, 200, "Category fetched successfully", { category });
});

export const createCategoryHandler = asyncHandler(async (req, res) => {
  const category = await createCategory(req.body);
  sendSuccess(res, 201, "Category created successfully", { category });
});

export const updateCategoryHandler = asyncHandler(async (req, res) => {
  const category = await updateCategory(req.params.id, req.body);
  sendSuccess(res, 200, "Category updated successfully", { category });
});

export const deleteCategoryHandler = asyncHandler(async (req, res) => {
  const category = await deleteCategory(req.params.id);
  sendSuccess(res, 200, "Category deleted successfully", { category });
});
