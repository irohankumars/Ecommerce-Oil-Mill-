// Wishlist controller keeps favorite products synchronized through API calls.
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { addToWishlist, getWishlist, removeFromWishlist } from "../services/wishlistService.js";

export const getWishlistHandler = asyncHandler(async (req, res) => {
  const wishlist = await getWishlist(req.user._id);
  sendSuccess(res, 200, "Wishlist fetched successfully", { wishlist });
});

export const addWishlistHandler = asyncHandler(async (req, res) => {
  const wishlist = await addToWishlist(req.user._id, req.body.productId);
  sendSuccess(res, 200, "Product added to wishlist", { wishlist });
});

export const removeWishlistHandler = asyncHandler(async (req, res) => {
  const wishlist = await removeFromWishlist(req.user._id, req.params.productId);
  sendSuccess(res, 200, "Product removed from wishlist", { wishlist });
});
