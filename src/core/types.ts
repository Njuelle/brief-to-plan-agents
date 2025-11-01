import { BaseMessage } from "@langchain/core/messages";

export type AppState = {
  messages?: BaseMessage[];
  brief: string;
  expandedBrief?: string;
  architectureDesign?: string;
  backendTasks?: string[];
  frontendTasks?: string[];
  reformulated?: string;
};

export type StateDiff = Partial<AppState>;
