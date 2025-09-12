import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get user by Clerk userId
export const getUserByClerkId = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    if (!userId) return null;

    return await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();
  },
});

// Create or update user (sync from Clerk)
export const upsertUser = mutation({
  args: {
    userId: v.string(),
    name: v.string(),
    email: v.string(),
    imageUrl: v.string(),
  },
  handler: async (ctx, { userId, name, email, imageUrl }) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (existingUser) {
      await ctx.db.patch(existingUser._id, { name, imageUrl });
      return existingUser._id;
    }

    return await ctx.db.insert("users", { userId, name, email, imageUrl });
  },
});

// Search Users by name or email
export const searchUsers = query({
  args: {
    searchTerm: v.string(),
  },
  handler: async (ctx, { searchTerm }) => {
    if (!searchTerm.trim()) return [];

    const normalizedSearch = searchTerm.toLowerCase().trim();

    // Get all users and filter them by name or email containing the search term
    const allUsers = await ctx.db.query("users").collect();

    return allUsers
      .filter(
        (user) =>
          user.name.toLowerCase().includes(normalizedSearch) ||
          user.email.toLowerCase().includes(normalizedSearch)
      )
      .slice(0, 20); // Limit to 20 results for performance
  },
});

// Create a block record (blocker blocks blocked)
export const blockUser = mutation({
  args: { blockerId: v.string(), blockedId: v.string() },
  handler: async (ctx, { blockerId, blockedId }) => {
    if (blockerId === blockedId) return null;

    const existing = await ctx.db
      .query("blocks")
      .withIndex("by_pair", (q) => q.eq("blockerId", blockerId).eq("blockedId", blockedId))
      .first();

    if (existing) return existing._id;

    return await ctx.db.insert("blocks", {
      blockerId,
      blockedId,
      createdAt: Date.now(),
    });
  },
});

// Remove a block record
export const unblockUser = mutation({
  args: { blockerId: v.string(), blockedId: v.string() },
  handler: async (ctx, { blockerId, blockedId }) => {
    const existing = await ctx.db
      .query("blocks")
      .withIndex("by_pair", (q) => q.eq("blockerId", blockerId).eq("blockedId", blockedId))
      .first();
    if (existing) {
      await ctx.db.delete(existing._id);
      return true;
    }
    return false;
  },
});

// List users I have blocked
export const listBlockedByMe = query({
  args: { blockerId: v.string() },
  handler: async (ctx, { blockerId }) => {
    const blocks = await ctx.db
      .query("blocks")
      .withIndex("by_blocker", (q) => q.eq("blockerId", blockerId))
      .collect();

    if (blocks.length === 0) return [];

    const blockedIds = blocks.map((b) => b.blockedId);
    const users = await ctx.db.query("users").collect();
    return users.filter((u) => blockedIds.includes(u.userId));
  },
});

// Check if a user is blocked by another user
export const isUserBlocked = query({
  args: { blockerId: v.string(), blockedId: v.string() },
  handler: async (ctx, { blockerId, blockedId }) => {
    const block = await ctx.db
      .query("blocks")
      .withIndex("by_pair", (q) => q.eq("blockerId", blockerId).eq("blockedId", blockedId))
      .first();
    return !!block;
  },
});

// Get all blocked user IDs for a user
export const getBlockedUserIds = query({
  args: { blockerId: v.string() },
  handler: async (ctx, { blockerId }) => {
    const blocks = await ctx.db
      .query("blocks")
      .withIndex("by_blocker", (q) => q.eq("blockerId", blockerId))
      .collect();
    return blocks.map((b) => b.blockedId);
  },
});

// Role Management Functions

// Create a role for a group
export const createGroupRole = mutation({
  args: { 
    channelId: v.string(), 
    roleName: v.string(), 
    permissions: v.array(v.string()),
    createdBy: v.string()
  },
  handler: async (ctx, { channelId, roleName, permissions, createdBy }) => {
    // Check if role already exists
    const existing = await ctx.db
      .query("groupRoles")
      .withIndex("by_channel_role", (q) => q.eq("channelId", channelId).eq("roleName", roleName))
      .first();

    if (existing) {
      throw new Error(`Role "${roleName}" already exists in this group`);
    }

    return await ctx.db.insert("groupRoles", {
      channelId,
      roleName,
      permissions,
      createdAt: Date.now(),
      createdBy,
    });
  },
});

// Assign a role to a user in a group
export const assignGroupRole = mutation({
  args: { 
    channelId: v.string(), 
    userId: v.string(), 
    roleName: v.string(),
    assignedBy: v.string()
  },
  handler: async (ctx, { channelId, userId, roleName, assignedBy }) => {
    // Check if role exists
    const role = await ctx.db
      .query("groupRoles")
      .withIndex("by_channel_role", (q) => q.eq("channelId", channelId).eq("roleName", roleName))
      .first();

    if (!role) {
      throw new Error(`Role "${roleName}" does not exist in this group`);
    }

    // Remove existing role assignment
    const existing = await ctx.db
      .query("groupMembers")
      .withIndex("by_channel_user", (q) => q.eq("channelId", channelId).eq("userId", userId))
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
    }

    // Assign new role
    return await ctx.db.insert("groupMembers", {
      channelId,
      userId,
      roleName,
      assignedBy,
      assignedAt: Date.now(),
    });
  },
});

// Get user's role in a group
export const getUserGroupRole = query({
  args: { channelId: v.string(), userId: v.string() },
  handler: async (ctx, { channelId, userId }) => {
    const member = await ctx.db
      .query("groupMembers")
      .withIndex("by_channel_user", (q) => q.eq("channelId", channelId).eq("userId", userId))
      .first();

    return member?.roleName || "Member"; // Default role
  },
});

// Get all roles for a group
export const getGroupRoles = query({
  args: { channelId: v.string() },
  handler: async (ctx, { channelId }) => {
    return await ctx.db
      .query("groupRoles")
      .withIndex("by_channel", (q) => q.eq("channelId", channelId))
      .collect();
  },
});

// Get all members with their roles for a group
export const getGroupMembersWithRoles = query({
  args: { channelId: v.string() },
  handler: async (ctx, { channelId }) => {
    const members = await ctx.db
      .query("groupMembers")
      .withIndex("by_channel", (q) => q.eq("channelId", channelId))
      .collect();

    const users = await ctx.db
      .query("users")
      .collect();

    const userMap = new Map(users.map(u => [u.userId, u]));

    return members.map(member => ({
      ...member,
      user: userMap.get(member.userId),
    }));
  },
});

// Check if user has permission in a group
export const hasGroupPermission = query({
  args: { channelId: v.string(), userId: v.string(), permission: v.string() },
  handler: async (ctx, { channelId, userId, permission }) => {
    const member = await ctx.db
      .query("groupMembers")
      .withIndex("by_channel_user", (q) => q.eq("channelId", channelId).eq("userId", userId))
      .first();

    if (!member) return false;

    const role = await ctx.db
      .query("groupRoles")
      .withIndex("by_channel_role", (q) => q.eq("channelId", channelId).eq("roleName", member.roleName))
      .first();

    if (!role) return false;

    return role.permissions.includes(permission);
  },
});

// Delete a role from a group
export const deleteGroupRole = mutation({
  args: { channelId: v.string(), roleName: v.string() },
  handler: async (ctx, { channelId, roleName }) => {
    // Don't allow deleting CEO role
    if (roleName === "CEO") {
      throw new Error("Cannot delete the CEO role");
    }

    // Check if any members have this role
    const membersWithRole = await ctx.db
      .query("groupMembers")
      .withIndex("by_channel", (q) => q.eq("channelId", channelId))
      .filter((q) => q.eq(q.field("roleName"), roleName))
      .collect();

    if (membersWithRole.length > 0) {
      throw new Error(`Cannot delete role "${roleName}" because ${membersWithRole.length} member(s) still have this role. Please reassign them first.`);
    }

    // Find and delete the role
    const role = await ctx.db
      .query("groupRoles")
      .withIndex("by_channel_role", (q) => q.eq("channelId", channelId).eq("roleName", roleName))
      .first();

    if (role) {
      await ctx.db.delete(role._id);
    }
  },
});

// Initialize default roles for a group (CEO and Member)
export const initializeGroupRoles = mutation({
  args: { channelId: v.string(), createdBy: v.string() },
  handler: async (ctx, { channelId, createdBy }) => {
    // Create CEO role with all permissions
    await ctx.db.insert("groupRoles", {
      channelId,
      roleName: "CEO",
      permissions: [
        "manage_roles",
        "assign_roles", 
        "kick_members",
        "invite_members",
        "edit_group_settings",
        "delete_group"
      ],
      createdAt: Date.now(),
      createdBy,
    });

    // Create Member role with basic permissions
    await ctx.db.insert("groupRoles", {
      channelId,
      roleName: "Member",
      permissions: [
        "send_messages",
        "view_members"
      ],
      createdAt: Date.now(),
      createdBy,
    });

    // Assign CEO role to creator
    await ctx.db.insert("groupMembers", {
      channelId,
      userId: createdBy,
      roleName: "CEO",
      assignedBy: createdBy,
      assignedAt: Date.now(),
    });
  },
});