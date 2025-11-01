import { AppState } from "../core/types";
import { Plan } from "../schemas/plan.schema";

export class MarkdownFormatter {
  private formatPlan(plan: Plan, title: string): string {
    const sections: string[] = [];

    sections.push(`## ${title}`);
    sections.push("");

    let taskNumber = 1;

    // Iterate through epics
    plan.epics.forEach((epic, epicIndex) => {
      sections.push(`### Epic ${epicIndex + 1}: ${epic.name}`);
      sections.push("");

      // Iterate through stories
      epic.stories.forEach((story, storyIndex) => {
        sections.push(`#### Story ${epicIndex + 1}.${storyIndex + 1}: ${story.name}`);
        sections.push("");

        // Iterate through tasks
        story.tasks.forEach((task) => {
          sections.push(`**Task ${taskNumber}: ${task.name}**`);
          sections.push("");
          sections.push(`- **Goal:** ${task.goal}`);
          sections.push(`- **Deliverable:** ${task.deliverable}`);
          sections.push(`- **Estimate:** ${task.estimate}`);
          if (task.deps && task.deps.length > 0) {
            sections.push(`- **Dependencies:** ${task.deps.join(", ")}`);
          } else {
            sections.push(`- **Dependencies:** None`);
          }
          sections.push("");
          taskNumber++;
        });
      });
    });

    // Critical Path
    if (plan.criticalPath && plan.criticalPath.length > 0) {
      sections.push(`### Critical Path`);
      sections.push("");
      plan.criticalPath.forEach((task, index) => {
        sections.push(`${index + 1}. ${task}`);
      });
      sections.push("");
    }

    // Risks
    if (plan.risks && plan.risks.length > 0) {
      sections.push(`### Technical Risks`);
      sections.push("");
      plan.risks.forEach((risk, index) => {
        sections.push(`${index + 1}. ${risk}`);
      });
      sections.push("");
    }

    return sections.join("\n");
  }

  format(state: AppState): string {
    const sections: string[] = [];

    // Header
    sections.push("# Technical Implementation Plan");
    sections.push("");
    sections.push(`**Generated:** ${new Date().toLocaleString()}`);
    sections.push("");
    sections.push("---");
    sections.push("");

    // Table of Contents
    sections.push("## Table of Contents");
    sections.push("");
    sections.push("1. [Original Brief](#original-brief)");
    sections.push("2. [Technical Analysis](#technical-analysis)");
    sections.push("3. [System Architecture](#system-architecture)");
    sections.push("4. [Backend Implementation Plan](#backend-implementation-plan)");
    sections.push("5. [Frontend Implementation Plan](#frontend-implementation-plan)");
    sections.push("6. [Summary](#summary)");
    sections.push("");
    sections.push("---");
    sections.push("");

    // Original Brief
    if (state.brief) {
      sections.push("## Original Brief");
      sections.push("");
      sections.push(state.brief);
      sections.push("");
      sections.push("---");
      sections.push("");
    }

    // Extended Brief
    if (state.expandedBrief) {
      sections.push("## Technical Analysis");
      sections.push("");
      sections.push(state.expandedBrief);
      sections.push("");
      sections.push("---");
      sections.push("");
    }

    // Architecture
    if (state.architectureDesign) {
      sections.push("## System Architecture");
      sections.push("");
      sections.push(state.architectureDesign);
      sections.push("");
      sections.push("---");
      sections.push("");
    }

    // Backend Plan
    if (state.backendPlan) {
      sections.push(this.formatPlan(state.backendPlan, "Backend Implementation Plan"));
      sections.push("---");
      sections.push("");
    }

    // Frontend Plan
    if (state.frontendPlan) {
      sections.push(this.formatPlan(state.frontendPlan, "Frontend Implementation Plan"));
      sections.push("---");
      sections.push("");
    }

    // Summary
    const totalTasks =
      (state.backendTasks?.length || 0) + (state.frontendTasks?.length || 0);

    const backendEpics = state.backendPlan?.epics.length || 0;
    const frontendEpics = state.frontendPlan?.epics.length || 0;
    const backendStories = state.backendPlan?.epics.reduce((sum, e) => sum + e.stories.length, 0) || 0;
    const frontendStories = state.frontendPlan?.epics.reduce((sum, e) => sum + e.stories.length, 0) || 0;

    sections.push("## Summary");
    sections.push("");
    sections.push("### Backend");
    sections.push(`- **Epics:** ${backendEpics}`);
    sections.push(`- **Stories:** ${backendStories}`);
    sections.push(`- **Tasks:** ${state.backendTasks?.length || 0}`);
    sections.push("");
    sections.push("### Frontend");
    sections.push(`- **Epics:** ${frontendEpics}`);
    sections.push(`- **Stories:** ${frontendStories}`);
    sections.push(`- **Tasks:** ${state.frontendTasks?.length || 0}`);
    sections.push("");
    sections.push("### Total");
    sections.push(`- **Epics:** ${backendEpics + frontendEpics}`);
    sections.push(`- **Stories:** ${backendStories + frontendStories}`);
    sections.push(`- **Tasks:** ${totalTasks}`);
    sections.push("");

    return sections.join("\n");
  }

  formatCompact(state: AppState): string {
    const lines: string[] = [];

    lines.push("╔═══════════════════════════════════════════════════════════════╗");
    lines.push("║          TECHNICAL IMPLEMENTATION PLAN                        ║");
    lines.push("╚═══════════════════════════════════════════════════════════════╝");
    lines.push("");

    if (state.brief) {
      lines.push("📋 ORIGINAL BRIEF");
      lines.push("─".repeat(65));
      lines.push(state.brief);
      lines.push("");
    }

    const totalTasks =
      (state.backendTasks?.length || 0) + (state.frontendTasks?.length || 0);

    const backendEpics = state.backendPlan?.epics.length || 0;
    const frontendEpics = state.frontendPlan?.epics.length || 0;
    const totalEpics = backendEpics + frontendEpics;

    lines.push("📊 SUMMARY");
    lines.push("─".repeat(65));
    lines.push(`✓ Epics:          ${totalEpics} (Backend: ${backendEpics}, Frontend: ${frontendEpics})`);
    lines.push(`✓ Backend Tasks:  ${state.backendTasks?.length || 0}`);
    lines.push(`✓ Frontend Tasks: ${state.frontendTasks?.length || 0}`);
    lines.push(`✓ Total Tasks:    ${totalTasks}`);
    lines.push("");

    return lines.join("\n");
  }
}
