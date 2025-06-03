import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { generatePasswordHash, generateRandomPassword, verifyPassword as verifyPasswordUtil } from '../utils/auth';
import { sendInvitationEmail } from '../utils/email';

// Get user by email
export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
  },
});

// Get user by ID
export const getUserById = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
  },
});

// Create a new user with invitation
export const createUser = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    role: v.string(),
    sendInvite: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
    
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // Generate a random initial password if sending invite
    const initialPassword = args.sendInvite ? generateRandomPassword() : undefined;
    const passwordHash = initialPassword ? await generatePasswordHash(initialPassword) : undefined;

    // Create the user
    const userId = await ctx.db.insert("users", {
      email: args.email,
      name: args.name,
      role: args.role,
      passwordHash,
      status: 'active',
      createdAt: new Date().toISOString(),
      lastLogin: undefined,
      resetToken: undefined,
      resetTokenExpiresAt: undefined,
    });

    // Create basic user profile
    await ctx.db.insert("userProfiles", {
      userId,
      name: args.name,
      email: args.email,
      address: "",
      phone: "",
      zipCode: "",
    });

    // Create role-specific records
    if (args.role === "staff" || args.role === "owner" || args.role === "admin") {
      const staffId = await ctx.db.insert("staffMembers", {
        userId,
        name: args.name,
        email: args.email,
        internalRole: args.role === "owner" ? "Owner" : args.role === "admin" ? "Admin" : "Support",
        team: args.role === "owner" ? "Management" : args.role === "admin" ? "Administration" : "Customer Support",
        isOwner: args.role === "owner",
        status: "active",
      });

      // Update user with staffId
      await ctx.db.patch(userId, { staffId });
    }

    // Send invitation email if requested
    if (args.sendInvite && initialPassword) {
      await sendInvitationEmail({
        name: args.name,
        email: args.email,
        password: initialPassword,
        role: args.role,
      });
    }

    return userId;
  },
});

// Update user password
export const updatePassword = mutation({
  args: {
    userId: v.id("users"),
    newPassword: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error("User not found");
    }

    const passwordHash = await generatePasswordHash(args.newPassword);
    await ctx.db.patch(args.userId, { passwordHash });
  },
});

// Verify password
export const verifyPassword = query({
  args: {
    userId: v.id("users"),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user || !user.passwordHash) {
      return false;
    }
    return await verifyPasswordUtil(args.password, user.passwordHash);
  },
});

// Store password reset token
export const storeResetToken = mutation({
  args: {
    userId: v.id("users"),
    token: v.string(),
    expiresAt: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, {
      resetToken: undefined,
      resetTokenExpiresAt: undefined,
    });
  },
});

// Verify reset token
export const verifyResetToken = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("resetToken"), args.token))
      .first();

    if (!user || !user.resetTokenExpiresAt) {
      return null;
    }

    const expiresAt = new Date(user.resetTokenExpiresAt);
    if (expiresAt < new Date()) {
      return null;
    }

    return { userId: user._id };
  },
});

// Invalidate reset token
export const invalidateResetToken = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("resetToken"), args.token))
      .first();

    if (user) {
      await ctx.db.patch(user._id, {
        resetToken: undefined,
        resetTokenExpiresAt: undefined,
      });
    }
  },
});

// Reset password token
export const clearResetToken = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, {
      resetToken: undefined,
      resetTokenExpiresAt: undefined,
    });
  },
});

// Seed database with test users
export const seedTestUsers = mutation({
  args: {},
  handler: async (ctx) => {
    const testUsers = [
      {
        email: "admin@reviewfighters.com",
        name: "Admin User",
        role: "admin",
      },
      {
        email: "owner@reviewfighters.com", 
        name: "Owner User",
        role: "owner",
      },
      {
        email: "staff@reviewfighters.com",
        name: "Staff Member",
        role: "staff",
      },
      {
        email: "affiliate@reviewfighters.com",
        name: "Test Affiliate",
        role: "affiliate",
      },
      {
        email: "sales@reviewfighters.com",
        name: "Sales Member",
        role: "sales",
      },
      {
        email: "user@reviewfighters.com",
        name: "Regular User", 
        role: "user",
      },
    ];

    const createdUsers = [];

    for (const userData of testUsers) {
      // Check if user already exists
      const existingUser = await ctx.db
        .query("users")
        .withIndex("by_email", (q) => q.eq("email", userData.email))
        .first();
      
      if (!existingUser) {
        // Create the user first
        const userId = await ctx.db.insert("users", {
          email: userData.email,
          name: userData.name,
          role: userData.role,
          status: "active",
          createdAt: new Date().toISOString(),
          lastLogin: undefined,
          resetToken: undefined,
          resetTokenExpiresAt: undefined,
          passwordHash: undefined,
          staffId: undefined,
          affiliateId: undefined,
          salesId: undefined
        });

        // Create basic user profile
        await ctx.db.insert("userProfiles", {
          userId,
          name: userData.name,
          email: userData.email,
          address: "",
          phone: "",
          zipCode: "",
        });

        // Create additional data for specific roles
        if (userData.role === "affiliate") {
          const affiliateId = await ctx.db.insert("affiliates", {
            name: userData.name,
            email: userData.email,
            signupDate: new Date().toISOString(),
            status: "Active",
            payoutDetails: "PayPal: affiliate@reviewfighters.com",
            currentBalance: 150.50,
            totalClicks: 245,
            totalSales: 12,
            affiliateLink: `https://reviewfighters.com?ref=${userId}`,
            qrCodeLink: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://reviewfighters.com?ref=${userId}`,
            userId: userId,
          });

          // Update user with affiliateId
          await ctx.db.patch(userId, {
            affiliateId: affiliateId,
          });
        }

        if (userData.role === "sales") {
          const salesId = await ctx.db.insert("salesMembers", {
            userId: userId,
            name: userData.name,
            email: userData.email,
            signupDate: new Date().toISOString(),
            status: "Active",
            currentBalance: 275.00,
            totalEarnings: 1450.00,
            totalTasksCompleted: 8,
            averageRating: 4.7,
            payoutDetails: "PayPal: sales@reviewfighters.com",
            specializations: ["Lead Generation", "Research"],
          });

          // Update user with salesId
          await ctx.db.patch(userId, {
            salesId: salesId,
          });
        }

        if (userData.role === "staff" || userData.role === "owner" || userData.role === "admin") {
          const staffId = await ctx.db.insert("staffMembers", {
            userId: userId,
            name: userData.name,
            email: userData.email,
            internalRole: userData.role === "owner" ? "Owner" : userData.role === "admin" ? "Admin" : "Support",
            team: userData.role === "owner" ? "Management" : userData.role === "admin" ? "Administration" : "Customer Support",
            isOwner: userData.role === "owner",
            status: "active"
          });

          // Update user with staffId
          await ctx.db.patch(userId, {
            staffId: staffId,
          });
        }

        createdUsers.push({
          userId,
          email: userData.email,
          name: userData.name,
          role: userData.role,
        });
      } else {
        createdUsers.push({
          userId: existingUser._id,
          email: existingUser.email,
          name: existingUser.name,
          role: existingUser.role,
          status: "already_exists"
        });
      }
    }

    return createdUsers;
  },
});

// Get all users
export const getAllUsers = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});

// Fix existing user relationships (one-time fix for existing users)
export const fixUserRelationships = mutation({
  args: {},
  handler: async (ctx) => {
    const results = [];

    // Get all users
    const users = await ctx.db.query("users").collect();
    
    for (const user of users) {
      if (user.role === "staff" || user.role === "admin" || user.role === "owner") {
        // Find or create staff member record
        let staffMember = await ctx.db
          .query("staffMembers")
          .withIndex("by_user", (q) => q.eq("userId", user._id))
          .first();

        let staffId;
        if (!staffMember) {
          // Create staff member if it doesn't exist
          staffId = await ctx.db.insert("staffMembers", {
            userId: user._id,
            name: user.name,
            email: user.email,
            internalRole: user.role === "owner" ? "Owner" : user.role === "admin" ? "Admin" : "Support",
            team: user.role === "owner" ? "Management" : user.role === "admin" ? "Administration" : "Customer Support",
            isOwner: user.role === "owner",
            status: "active",
          });
        } else {
          staffId = staffMember._id;
        }

        // Update user with staffId if not set
        if (!user.staffId) {
          await ctx.db.patch(user._id, {
            staffId: staffId,
          });
          results.push({
            userId: user._id,
            email: user.email,
            action: "linked to staff record",
            staffId: staffId,
          });
        }
      }

      if (user.role === "affiliate") {
        // Find or create affiliate record
        let affiliate = await ctx.db
          .query("affiliates")
          .withIndex("by_user", (q) => q.eq("userId", user._id))
          .first();

        let affiliateId;
        if (!affiliate) {
          // Create affiliate if it doesn't exist
          affiliateId = await ctx.db.insert("affiliates", {
            name: user.name,
            email: user.email,
            signupDate: new Date().toISOString(),
            status: "Active",
            payoutDetails: `PayPal: ${user.email}`,
            currentBalance: 150.50,
            totalClicks: 245,
            totalSales: 12,
            affiliateLink: `https://reviewfighters.com?ref=${user._id}`,
            qrCodeLink: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://reviewfighters.com?ref=${user._id}`,
            userId: user._id,
          });
        } else {
          affiliateId = affiliate._id;
        }

        // Update user with affiliateId if not set
        if (!user.affiliateId) {
          await ctx.db.patch(user._id, {
            affiliateId: affiliateId,
          });
          results.push({
            userId: user._id,
            email: user.email,
            action: "linked to affiliate record",
            affiliateId: affiliateId,
          });
        }
      }

      if (user.role === "sales") {
        // Find or create sales member record
        let salesMember = await ctx.db
          .query("salesMembers")
          .withIndex("by_user", (q) => q.eq("userId", user._id))
          .first();

        let salesId;
        if (!salesMember) {
          // Create sales member if it doesn't exist
          salesId = await ctx.db.insert("salesMembers", {
            userId: user._id,
            name: user.name,
            email: user.email,
            signupDate: new Date().toISOString(),
            status: "Active",
            currentBalance: 275.00,
            totalEarnings: 1450.00,
            totalTasksCompleted: 8,
            averageRating: 4.7,
            payoutDetails: `PayPal: ${user.email}`,
            specializations: ["Lead Generation", "Research"],
          });
        } else {
          salesId = salesMember._id;
        }

        // Update user with salesId if not set
        if (!user.salesId) {
          await ctx.db.patch(user._id, {
            salesId: salesId,
          });
          results.push({
            userId: user._id,
            email: user.email,
            action: "linked to sales record",
            salesId: salesId,
          });
        }
      }
    }

    return results;
  },
});

// Seed sample sales tasks
export const seedSampleSalesTasks = mutation({
  args: {},
  handler: async (ctx) => {
    const sampleTasks = [
      {
        title: "Find LinkedIn Profile - Tech CEO",
        description: "Search for and verify the LinkedIn profile of a tech startup CEO. Must provide profile URL, verification that person matches the company, and screenshot evidence.",
        category: "Research",
        reward: 100.00,
        requirements: [
          "Valid LinkedIn profile URL",
          "Screenshot of profile",
          "Verification that person is CEO of specified company",
          "Contact information if publicly available"
        ],
        estimatedTime: "1-2 hours",
        difficulty: "Medium",
        status: "Available",
        postedDate: new Date().toISOString(),
        deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
        maxClaims: 1,
        currentClaims: 0,
        createdByStaffId: "STAFF_001",
        tags: ["linkedin", "research", "verification"]
      },
      {
        title: "Lead Generation - SaaS Companies",
        description: "Generate 20 qualified leads for B2B SaaS companies in the healthcare sector. Each lead must include company name, contact person, email, and brief reason why they might need our services.",
        category: "Lead Generation",
        reward: 250.00,
        requirements: [
          "20 qualified leads",
          "Company name and website",
          "Decision maker contact info",
          "Brief qualification notes",
          "Excel/CSV format submission"
        ],
        estimatedTime: "4-6 hours",
        difficulty: "Hard",
        status: "Available",
        postedDate: new Date().toISOString(),
        maxClaims: 2,
        currentClaims: 0,
        createdByStaffId: "STAFF_001",
        tags: ["leads", "saas", "healthcare", "b2b"]
      },
      {
        title: "Verify Business Information",
        description: "Call a list of 10 businesses and verify their current contact information, business hours, and whether they are still operating.",
        category: "Verification",
        reward: 75.00,
        requirements: [
          "Call each business during business hours",
          "Verify phone number accuracy",
          "Confirm business hours",
          "Note if business is closed/moved",
          "Professional phone manner required"
        ],
        estimatedTime: "2-3 hours",
        difficulty: "Easy",
        status: "Available",
        postedDate: new Date().toISOString(),
        maxClaims: 3,
        currentClaims: 0,
        createdByStaffId: "STAFF_001",
        tags: ["verification", "phone", "business-info"]
      },
      {
        title: "Social Media Account Research",
        description: "Find and verify social media accounts for a list of 15 companies. Provide Facebook, Twitter, LinkedIn, and Instagram handles where available.",
        category: "Research",
        reward: 120.00,
        requirements: [
          "Social media handles for 15 companies",
          "Verify accounts are official/verified",
          "Note follower counts",
          "Include screenshots as proof",
          "Mark any inactive accounts"
        ],
        estimatedTime: "3-4 hours",
        difficulty: "Medium",
        status: "Available",
        postedDate: new Date().toISOString(),
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
        maxClaims: 2,
        currentClaims: 0,
        createdByStaffId: "STAFF_001",
        tags: ["social-media", "research", "verification"]
      },
      {
        title: "Email Outreach Campaign",
        description: "Send personalized emails to 50 potential clients using provided templates. Track open rates and responses.",
        category: "Outreach",
        reward: 180.00,
        requirements: [
          "Send 50 personalized emails",
          "Use provided email templates",
          "Personalize each email appropriately",
          "Track and report response rates",
          "Follow up on any responses"
        ],
        estimatedTime: "5-6 hours",
        difficulty: "Hard",
        status: "Available",
        postedDate: new Date().toISOString(),
        maxClaims: 1,
        currentClaims: 0,
        createdByStaffId: "STAFF_001",
        tags: ["outreach", "email", "sales"]
      }
    ];

    const createdTasks = [];
    for (const taskData of sampleTasks) {
      const taskId = await ctx.db.insert("salesTasks", taskData);
      createdTasks.push({
        taskId,
        title: taskData.title,
        reward: taskData.reward
      });
    }

    return createdTasks;
  },
});

// Create staff member
export const createStaffMember = mutation({
  args: {
    userId: v.id("users"),
    name: v.string(),
    email: v.string(),
    internalRole: v.string(),
    team: v.string(),
    isOwner: v.boolean(),
  },
  handler: async (ctx, args) => {
    const staffId = await ctx.db.insert("staffMembers", {
      userId: args.userId,
      name: args.name,
      email: args.email,
      internalRole: args.internalRole,
      team: args.team,
      isOwner: args.isOwner,
      status: 'active',
    });
    return staffId;
  },
});