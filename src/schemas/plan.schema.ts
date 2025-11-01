import { z } from "zod";

export const TaskZ = z.object({
  name: z.string().min(1),
  goal: z.string().min(1),
  deliverable: z.string().min(1),
  deps: z.array(z.string()).default([]),
  estimate: z.enum(["XS", "S", "M", "L", "XL"]),
});

export const StoryZ = z.object({
  name: z.string(),
  tasks: z.array(TaskZ),
});

export const EpicZ = z.object({
  name: z.string(),
  stories: z.array(StoryZ),
});

export const PlanZ = z.object({
  epics: z.array(EpicZ),
  criticalPath: z.array(z.string()).default([]),
  risks: z.array(z.string()).default([]),
});

export type Plan = z.infer<typeof PlanZ>;
