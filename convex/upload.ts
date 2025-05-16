import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { userByTokenIdentifier } from "./users";

// Generate a URL for uploading a file
export const generateUploadUrl = mutation(async (ctx) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Not authenticated");
  }

  return await ctx.storage.generateUploadUrl();
});

// Save the uploaded image to the database
export const sendImage = mutation({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await userByTokenIdentifier(ctx, identity.tokenIdentifier);
    if (!user) {
      throw new Error("User not found");
    }

    await ctx.db.insert("images", {
      body: args.storageId,
      author: user._id,
      format: "image",
    });

    return args.storageId;
  },
});
