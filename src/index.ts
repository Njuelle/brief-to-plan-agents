import "dotenv/config";
import { randomUUID } from "node:crypto";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { BriefToPlanGraph } from "./workflow/brief-to-plan.workflow";
import { MarkdownFormatter } from "./utils/markdown-formatter";

async function main() {
  const userBrief =
    process.argv.slice(2).join(" ") ||
    "Je veux une appli web pour suivre des séances de sport à domicile, avec création de programme, minuteur d'exos, et partage avec des amis.";

  console.log("\n🚀 Starting technical plan generation...\n");

  const app = new BriefToPlanGraph().compile();

  // IMPORTANT: provide a thread_id when a checkpointer is active
  const threadId = process.env.THREAD_ID || randomUUID();

  const result = await app.invoke(
    { brief: userBrief },
    { configurable: { thread_id: threadId } }
  );

  // Format and save as markdown
  const formatter = new MarkdownFormatter();
  const markdown = formatter.format(result);
  const compact = formatter.formatCompact(result);

  // Create output directory if it doesn't exist
  const outputDir = join(process.cwd(), "output");
  mkdirSync(outputDir, { recursive: true });

  // Save markdown file with timestamp
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = `plan-${timestamp}.md`;
  const filepath = join(outputDir, filename);

  writeFileSync(filepath, markdown, "utf-8");

  // Display compact summary in console
  console.log(compact);
  console.log(`\n✅ Full plan saved to: ${filepath}\n`);
}

main().catch((e) => {
  console.error("\n❌ Error:", e.message);
  process.exit(1);
});
