import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Get all reviews
export const getAllReviews = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("reviews").collect();
  },
});

// Get review by ID
export const getReviewById = query({
  args: { reviewId: v.id("reviews") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.reviewId);
  },
});

// Create a new review
export const createReview = mutation({
  args: {
    reviewerName: v.string(),
    reviewContent: v.string(),
    rating: v.number(),
    reviewDate: v.string(),
    reviewSource: v.string(),
    reviewRelationship: v.optional(v.string()),
    isCustomer: v.boolean(),
    isFormerEmployee: v.optional(v.boolean()),
    knowsReviewerIdentity: v.boolean(),
    reviewerDetails: v.optional(v.any()),
    associatedMediaIds: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("reviews", args);
  },
});

// Update a review
export const updateReview = mutation({
  args: {
    reviewId: v.id("reviews"),
    reviewerName: v.optional(v.string()),
    reviewContent: v.optional(v.string()),
    rating: v.optional(v.number()),
    reviewDate: v.optional(v.string()),
    reviewSource: v.optional(v.string()),
    reviewRelationship: v.optional(v.string()),
    isCustomer: v.optional(v.boolean()),
    isFormerEmployee: v.optional(v.boolean()),
    knowsReviewerIdentity: v.optional(v.boolean()),
    reviewerDetails: v.optional(v.any()),
    associatedMediaIds: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const { reviewId, ...updates } = args;
    // Remove undefined values
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, value]) => value !== undefined)
    );
    return await ctx.db.patch(reviewId, cleanUpdates);
  },
});

// Delete a review
export const deleteReview = mutation({
  args: { reviewId: v.id("reviews") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.reviewId);
  },
}); 