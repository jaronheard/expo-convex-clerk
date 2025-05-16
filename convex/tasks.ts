import { v } from "convex/values";
import { query } from "./_generated/server";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("tasks").collect();
  },
});

export const search = query({
  args: {
    searchQuery: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("tasks")
      .withSearchIndex("search_text", (q) => q.search("text", args.searchQuery))
      .collect();
  },
});
