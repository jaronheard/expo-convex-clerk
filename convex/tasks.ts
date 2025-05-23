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

    const taskId = await ctx.db.insert("tasks", {
      text: args.text,
      isCompleted: false,
      ownerToken: identity?.tokenIdentifier,
      isGuest: false,
    });

    return taskId;
  },
});

export const createGuestTask = mutation({
  args: { text: v.string(), guestUserId: v.string() },
  handler: async (ctx, args) => {
    // Create a task for a guest user using their guest ID
    const taskId = await ctx.db.insert("tasks", {
      text: args.text,
      isCompleted: false,
      ownerToken: args.guestUserId, // Use guest ID as owner token for now
      isGuest: true,
    });

    return taskId;
  },
});

export const transferGuestTasks = mutation({
  args: { guestUserId: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Find all tasks with the guest user ID
    const guestTasks = await ctx.db
      .query("tasks")
      .filter((q) => q.eq(q.field("ownerToken"), args.guestUserId))
      .collect();

    // Update each task to be owned by the authenticated user
    for (const task of guestTasks) {
      await ctx.db.patch(task._id, {
        ownerToken: identity.tokenIdentifier,
        isGuest: false,
      });
    }

    return guestTasks.length; // Return number of transferred tasks
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
        .withSearchIndex("search_text", (q2: any) =>
          q2.search("text", searchQuery),
        )
        .paginate(paginationOpts);
    }
    return await q.order("desc").paginate(paginationOpts);
  },
});

export const searchGuest = query({
  args: {
    searchQuery: v.string(),
    guestUserId: v.string(),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, { searchQuery, guestUserId, paginationOpts }) => {
    let q: any = ctx.db.query("tasks");

    if (searchQuery.trim().length > 0) {
      q = q.withSearchIndex("search_text", (q2: any) =>
        q2.search("text", searchQuery),
      );
      q = q.filter((q2: any) => q2.eq(q2.field("ownerToken"), guestUserId));
      return await q.paginate(paginationOpts);
    }

    q = q.filter((q2: any) => q2.eq(q2.field("ownerToken"), guestUserId));

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
      return {
        page: [],
        isDone: true,
        continueCursor: null as unknown as string,
      };
    }

    let q: any = ctx.db.query("tasks");
    if (searchQuery.trim().length > 0) {
      q = q.withSearchIndex("search_text", (q2: any) =>
        q2.search("text", searchQuery),
      );
      q = q.filter((q2: any) =>
        q2.eq(q2.field("ownerToken"), identity.tokenIdentifier),
      );
      return await q.paginate(paginationOpts);
    }

    q = q.filter((q2: any) =>
      q2.eq(q2.field("ownerToken"), identity.tokenIdentifier),
    );

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
      q = q.withSearchIndex("search_text", (q2: any) =>
        q2.search("text", searchQuery),
      );
      if (identity) {
        q = q.filter((q2: any) =>
          q2.neq(q2.field("ownerToken"), identity.tokenIdentifier),
        );
      }
      // Only show tasks from authenticated users (exclude guest tasks)
      q = q.filter((q2: any) => q2.neq(q2.field("isGuest"), true));
      return await q.paginate(paginationOpts);
    }

    if (identity) {
      q = q.filter((q2: any) =>
        q2.neq(q2.field("ownerToken"), identity.tokenIdentifier),
      );
    }
    // Only show tasks from authenticated users (exclude guest tasks)
    q = q.filter((q2: any) => q2.neq(q2.field("isGuest"), true));

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
      },
    );
  },
});

export const getTaskSplitWorkflowStatus = query({
  args: { workflowId: vWorkflowId },
  handler: async (ctx, args) => {
    return await workflow.status(ctx, args.workflowId);
  },
});
