import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  tasks: defineTable({
    text: v.string(),
    isCompleted: v.boolean(),
    ownerToken: v.optional(v.string()),
    isGuest: v.optional(v.boolean()),
  })
    .searchIndex("search_text", {
      searchField: "text",
    })
    .index("by_owner", ["ownerToken"]),

  users: defineTable({
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    location: v.optional(v.string()),
    bio: v.optional(v.string()),
    tokenIdentifier: v.string(),
    avatarUrlId: v.optional(v.id("_storage")),
    onboarded: v.optional(v.boolean()),
  }).index("by_token", ["tokenIdentifier"]),

  images: defineTable({
    author: v.id("users"),
    body: v.id("_storage"),
    format: v.string(),
  }),

  events: defineTable({
    created_at: v.string(),
    description: v.string(),
    endDate: v.string(),
    endDateTime: v.string(),
    endTime: v.string(),
    id: v.string(),
    image: v.union(v.null(), v.string()),
    location: v.string(),
    name: v.string(),
    startDate: v.string(),
    startDateTime: v.string(),
    startTime: v.string(),
    timeZone: v.string(),
    updatedAt: v.union(v.null(), v.string()),
    userId: v.string(),
    userName: v.string(),
    visibility: v.string(),
  }),
});
