import { v } from "convex/values";
import { api } from "./_generated/api";
import { workflow } from "./workflow";

export const splitTaskWorkflow = workflow.define({
  args: { text: v.string() },
  handler: async (step, args): Promise<void> => {
    const steps = await step.runAction(api.ai.generateSteps, {
      text: args.text,
    });

    for (const stepText of steps) {
      await step.runMutation(api.tasks.createTask, { text: stepText });
    }
  },
});
