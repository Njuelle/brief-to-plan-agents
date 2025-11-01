import { RunnableConfig } from "@langchain/core/runnables";
import { BaseAgent } from "../core/base.agent";
import { AppState, StateDiff } from "../core/types";

export class ArchitecturerAgent extends BaseAgent {
  name() {
    return "architecture";
  }

  async run(state: AppState, config?: RunnableConfig): Promise<StateDiff> {
    const threadId = config?.configurable?.thread_id as string | undefined;
    this.log("start", threadId);

    const prompt = `You are a senior software architect.
Initial brief:
"${state.brief}"

Objective:
- Define the technical architecture suited for the project
- Identify main components and their interactions
- Propose appropriate technologies and frameworks
- Anticipate technical challenges and propose solutions

Answer with 8-15 concise bullet points.`;
    const architecture = await this.ask(prompt);

    this.log("done", threadId);
    return {
      architectureDesign: architecture,
      messages: this.aiNote("Technical architecture ready."),
    };
  }
}
