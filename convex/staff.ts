import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

// Get all staff members
export const getAllStaffMembers = query({
  args: {},
  handler: async (ctx) => {
    const staffMembers = await ctx.db.query("staffMembers")
      .collect();
    return staffMembers;
  },
});

// Get a single staff member
export const getStaffMember = query({
  args: { staffId: v.id("staffMembers") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.staffId);
  },
});

// Create a new staff member
export const createStaffMember = mutation({
  args: {
    userId: v.id("users"),
    name: v.string(),
    email: v.string(),
    internalRole: v.string(),
    team: v.string(),
    isOwner: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    // Create staff record
    const staffId = await ctx.db.insert("staffMembers", {
      userId: args.userId,
      name: args.name,
      email: args.email,
      internalRole: args.internalRole,
      team: args.team,
      isOwner: args.isOwner ?? false,
      status: "active"
    });

    return staffId;
  },
});

// Update a staff member
export const updateStaffMember = mutation({
  args: {
    staffId: v.id("staffMembers"),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    internalRole: v.optional(v.string()),
    team: v.optional(v.string()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { staffId, ...updates } = args;
    const staff = await ctx.db.get(staffId);
    if (!staff) {
      throw new Error('Staff member not found');
    }

    await ctx.db.patch(staffId, updates);
  },
}); 