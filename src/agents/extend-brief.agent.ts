import { RunnableConfig } from "@langchain/core/runnables";
import { BaseAgent } from "../core/base.agent";
import { AppState, StateDiff } from "../core/types";

export class ExtendBriefAgent extends BaseAgent {
  name() {
    return "extendBrief";
  }

  async run(state: AppState, config?: RunnableConfig): Promise<StateDiff> {
    const threadId = config?.configurable?.thread_id as string | undefined;
    this.log("start", threadId);

    const prompt = `You are a senior product analyst.
Initial brief:
"${state.brief}"

Objective:
- Expand the context (targets, value, constraints, data, risks, dependencies)
- List assumptions and success metrics
- Propose missing sections if needed
Answer with 8-15 concise bullet points.`;

    const expanded = await this.ask(prompt);

    this.log("done", threadId);
    return {
      expandedBrief: expanded,
      messages: this.aiNote("Extended brief ready."),
    };
  }
}
