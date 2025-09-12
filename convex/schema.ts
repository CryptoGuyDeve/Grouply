import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    // Users synced from Clerk
    users: defineTable({
        userId: v.string(),
        name: v.string(),
        email: v.string(),
        imageUrl: v.string(),
    })
        .index("by_userId", ["userId"])
        .index("by_email", ["email"]),

    // User blocks (blocker blocks blocked)
    blocks: defineTable({
        blockerId: v.string(), // Clerk user id of blocker
        blockedId: v.string(), // Clerk user id of blocked user
        createdAt: v.number(),
    })
        .index("by_blocker", ["blockerId"])
        .index("by_blocked", ["blockedId"])
        .index("by_pair", ["blockerId", "blockedId"]),

    // Group roles and permissions
    groupRoles: defineTable({
        channelId: v.string(), // Stream channel ID
        roleName: v.string(), // Role name (e.g., "CEO", "Admin", "Member")
        permissions: v.array(v.string()), // Array of permission strings
        createdAt: v.number(),
        createdBy: v.string(), // Clerk user ID who created the role
    })
        .index("by_channel", ["channelId"])
        .index("by_channel_role", ["channelId", "roleName"]),

    // User role assignments in groups
    groupMembers: defineTable({
        channelId: v.string(), // Stream channel ID
        userId: v.string(), // Clerk user ID
        roleName: v.string(), // Role name
        assignedBy: v.string(), // Clerk user ID who assigned the role
        assignedAt: v.number(),
    })
        .index("by_channel", ["channelId"])
        .index("by_user", ["userId"])
        .index("by_channel_user", ["channelId", "userId"]),
})