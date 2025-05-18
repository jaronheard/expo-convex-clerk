import { v } from "convex/values";
import { workflow } from "./workflow";
import { internal } from "./_generated/server";

export const splitTaskWorkflow = workflow.define({
  args: { text: v.string() },
  handler: async (step, args): Promise<void> => {
    const steps = await step.runAction(internal.ai.generateSteps, {
      text: args.text,
    });

    for (const stepText of steps) {
      await step.runMutation(internal.tasks.createTask, { text: stepText });
    }
  },
});
