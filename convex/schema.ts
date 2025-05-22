import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  tasks: defineTable({
    text: v.string(),
    isCompleted: v.boolean(),
    ownerToken: v.optional(v.string()),
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
});
