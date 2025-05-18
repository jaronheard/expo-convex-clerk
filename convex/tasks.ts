import { v } from "convex/values";
import { query, paginationOptsValidator } from "./_generated/server";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("tasks").collect();
  },
});

export const search = query({
  args: {
    searchQuery: v.string(),
    paginationOpts: v.optional(paginationOptsValidator),
  },
  handler: async (ctx, { searchQuery, paginationOpts }) => {
    let q = ctx.db.query("tasks");
    if (searchQuery.trim().length > 0) {
      q = q.withSearchIndex("search_text", (q2) =>
        q2.search("text", searchQuery)
      );
    }
    return await q.paginate(paginationOpts);
  },
});
