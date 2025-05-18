import { paginationOptsValidator } from "convex/server";
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
