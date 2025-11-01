import "dotenv/config";
import { randomUUID } from "node:crypto";
import { BriefToPlanGraph } from "./workflow/brief-to-plan.workflow";

async function main() {
  const userBrief =
    process.argv.slice(2).join(" ") ||
    "Je veux une appli web pour suivre des séances de sport à domicile, avec création de programme, minuteur d'exos, et partage avec des amis.";

  const app = new BriefToPlanGraph().compile();

  // IMPORTANT: provide a thread_id when a checkpointer is active
  const threadId = process.env.THREAD_ID || randomUUID();

  const result = await app.invoke(
    { brief: userBrief },
    { configurable: { thread_id: threadId } }
  );

  console.log("\n=== EXTENDED BRIEF ===\n", result.expandedBrief);
  console.log("\n=== ARCHITECTURE TECHNIQUE ===\n", result.architectureDesign);
  console.log("\n=== BACKEND TASKS ===\n", result.backendTasks ?? []);
  console.log("\n=== FRONTEND TASKS ===\n", result.frontendTasks ?? []);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
