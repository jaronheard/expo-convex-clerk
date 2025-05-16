import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  tasks: defineTable({
    text: v.string(),
    isCompleted: v.boolean(),
  }).searchIndex("search_text", {
    searchField: "text",
  }),

  users: defineTable({
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    location: v.optional(v.string()),
    bio: v.optional(v.string()),
    tokenIdentifier: v.string(),
    avatarUrlId: v.optional(v.id("_storage")),
  }).index("by_token", ["tokenIdentifier"]),

  images: defineTable({
    author: v.id("users"),
    body: v.id("_storage"),
    format: v.string(),
  }),
});
