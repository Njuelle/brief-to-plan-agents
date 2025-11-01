import { RunnableConfig } from "@langchain/core/runnables";
import { BaseAgent } from "../core/base.agent";
import { AppState, StateDiff } from "../core/types";
import { PlanZ } from "../schemas/plan.schema";

export class PlanBackendTasksAgent extends BaseAgent {
  name() {
    return "planBackendTasks";
  }

  private buildPrompt(architecture: string) {
    return `You are a senior backend developer.
Create an execution plan for backend tasks only based on the software architecture below.
Architecture:
${architecture}

Requirements:
- Break down into EPIC -> STORIES -> TASKS (max 3 levels)
- For each task: goal, deliverable, dependencies, estimate (t-shirt size XS|S|M|L|XL)
- Add a "critical path" and "technical risks"
Answer in STRICT JSON matching this schema:
{
  "epics": [
    {
      "name": "string",
      "stories": [
        {
          "name": "string",
          "tasks": [
            { "name": "string", "goal": "string", "deliverable": "string", "deps": ["string"], "estimate": "XS|S|M|L|XL" }
          ]
        }
      ]
    }
  ],
  "criticalPath": ["string"],
  "risks": ["string"]
}`;
  }

  async run(state: AppState, config?: RunnableConfig): Promise<StateDiff> {
    const threadId = config?.configurable?.thread_id as string | undefined;
    this.log("start", threadId);

    const raw = await this.ask(this.buildPrompt(state.expandedBrief ?? ""));

    // Minimal validation/repair
    let tasks: string[] = [];
    try {
      const jsonStart = raw.indexOf("{");
      const jsonEnd = raw.lastIndexOf("}");
      const candidate =
        jsonStart >= 0 ? raw.slice(jsonStart, jsonEnd + 1) : raw;
      const parsed = PlanZ.parse(JSON.parse(candidate));
      tasks = parsed.epics.flatMap((e) =>
        e.stories.flatMap((s) => s.tasks.map((t) => t.name))
      );
    } catch {
      // Robust fallback (flat list)
      tasks = raw
        .split("\n")
        .map((l) => l.replace(/^-+\s*/, "").trim())
        .filter(Boolean)
        .slice(0, 60);
    }

    this.log(`produced ${tasks.length} tasks`, threadId);

    return {
      backendTasks: tasks,
      messages: this.aiNote("task plan ready."),
    };
  }
}
