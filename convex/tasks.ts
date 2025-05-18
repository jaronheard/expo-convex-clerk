import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("tasks").collect();
  },
});

export const createTask = mutation({
  args: { text: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.insert("tasks", { text: args.text, isCompleted: false });
  },
});

export const toggleTask = mutation({
  args: { id: v.id("tasks"), isCompleted: v.boolean() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { isCompleted: args.isCompleted });
  },
});

export const search = query({
  args: {
    searchQuery: v.string(),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, { searchQuery, paginationOpts }) => {
    let q = ctx.db.query("tasks");
    if (searchQuery.trim().length > 0) {
      return await q
        .withSearchIndex("search_text", (q2) => q2.search("text", searchQuery))
        .paginate(paginationOpts);
    }
    return await q.order("desc").paginate(paginationOpts);
  },
});
