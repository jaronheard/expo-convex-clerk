import { vWorkflowId, WorkflowId } from "@convex-dev/workflow";
import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { mutation, query } from "./_generated/server";
import { workflow } from "./workflow";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("tasks").collect();
  },
});

export const createTask = mutation({
  args: { text: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    await ctx.db.insert("tasks", {
      text: args.text,
      isCompleted: false,
      ownerToken: identity ? identity.tokenIdentifier : undefined,
    });
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
    let q: any = ctx.db.query("tasks");
    if (searchQuery.trim().length > 0) {
      return await q
        .withSearchIndex("search_text", (q2: any) => q2.search("text", searchQuery))
        .paginate(paginationOpts);
    }
    return await q.order("desc").paginate(paginationOpts);
  },
});

export const searchMine = query({
  args: {
    searchQuery: v.string(),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, { searchQuery, paginationOpts }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return { page: [], isDone: true, continueCursor: null as unknown as string };
    }

    let q: any = ctx.db.query("tasks");
    if (searchQuery.trim().length > 0) {
      q = q.withSearchIndex("search_text", (q2: any) => q2.search("text", searchQuery));
    }

    q = q.filter((q2: any) => q2.eq(q2.field("ownerToken"), identity.tokenIdentifier));

    return await q.order("desc").paginate(paginationOpts);
  },
});

export const searchOthers = query({
  args: {
    searchQuery: v.string(),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, { searchQuery, paginationOpts }) => {
    const identity = await ctx.auth.getUserIdentity();
    let q: any = ctx.db.query("tasks");

    if (searchQuery.trim().length > 0) {
      q = q.withSearchIndex("search_text", (q2: any) => q2.search("text", searchQuery));
    }

    if (identity) {
      q = q.filter((q2: any) => q2.neq(q2.field("ownerToken"), identity.tokenIdentifier));
    }

    return await q.order("desc").paginate(paginationOpts);
  },
});

export const splitTask = mutation({
  args: { text: v.string() },
  handler: async (ctx, args): Promise<WorkflowId> => {
    return await workflow.start(
      ctx,
      internal.splitTaskWorkflow.splitTaskWorkflow,
      {
        text: args.text,
      }
    );
  },
});

export const getTaskSplitWorkflowStatus = query({
  args: { workflowId: vWorkflowId },
  handler: async (ctx, args) => {
    return await workflow.status(ctx, args.workflowId);
  },
});
