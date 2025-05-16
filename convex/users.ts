import { v } from "convex/values";
import { mutation, query, QueryCtx } from "./_generated/server";

export async function userByExternalId(ctx: QueryCtx, externalId: string) {
  return await ctx.db
    .query("users")
    .filter((q) => q.eq(q.field("tokenIdentifier"), externalId))
    .unique();
}
// Update or create user profile
export const updateProfile = mutation({
  args: {
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    location: v.optional(v.string()),
    bio: v.optional(v.string()),
    avatarUrlId: v.optional(v.id("_storage")),
    onboarded: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await userByExternalId(ctx, identity.tokenIdentifier);

    if (user) {
      // Update existing user
      await ctx.db.patch(user._id, { ...args, onboarded: true });
      return user._id;
    } else {
      // Create new user
      return await ctx.db.insert("users", {
        ...args,
        tokenIdentifier: identity.tokenIdentifier,
        onboarded: true,
      });
    }
  },
});

// Get current user profile
export const getCurrentUser = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      console.log("Convex client not authenticated");
      return null;
    }

    const user = await userByExternalId(ctx, identity.tokenIdentifier);
    if (!user) {
      return null;
    }

    let avatarUrl = null;
    if (user.avatarUrlId) {
      avatarUrl = await ctx.storage.getUrl(user.avatarUrlId);
    }

    return {
      ...user,
      avatarUrl,
    };
  },
});
