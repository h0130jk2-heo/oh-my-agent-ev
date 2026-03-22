#!/usr/bin/env bun
/**
 * oh-my-agent — Stop Hook (Persistent Mode)
 *
 * Prevents Claude from stopping while a long-running workflow
 * (ultrawork, orchestrate, coordinate) is active.
 *
 * stdin : JSON  — { sessionId, stopReason }
 * stdout: JSON  — { decision: "block", reason } | {}
 * exit 0 = allow stop
 * exit 2 = block stop
 */

import { readFileSync, writeFileSync, unlinkSync, existsSync } from "node:fs";
import { join } from "node:path";
import type { StopInput, ModeState } from "./types.ts";

const PERSISTENT_WORKFLOWS = ["ultrawork", "orchestrate", "coordinate"];
const MAX_REINFORCEMENTS = 20;
const STALE_HOURS = 2;

function getStateDir(): string {
  const projectDir = process.env.CLAUDE_PROJECT_DIR || process.cwd();
  return join(projectDir, ".agents", "state");
}

function readModeState(workflow: string): ModeState | null {
  const path = join(getStateDir(), `${workflow}-state.json`);
  if (!existsSync(path)) return null;
  try {
    return JSON.parse(readFileSync(path, "utf-8")) as ModeState;
  } catch {
    return null;
  }
}

function isStale(state: ModeState): boolean {
  const elapsed = Date.now() - new Date(state.activatedAt).getTime();
  return elapsed > STALE_HOURS * 60 * 60 * 1000;
}

function deactivate(workflow: string): void {
  const path = join(getStateDir(), `${workflow}-state.json`);
  if (existsSync(path)) unlinkSync(path);
}

function incrementReinforcement(workflow: string, state: ModeState): void {
  state.reinforcementCount += 1;
  writeFileSync(join(getStateDir(), `${workflow}-state.json`), JSON.stringify(state, null, 2));
}

async function main() {
  const raw = readFileSync("/dev/stdin", "utf-8");
  let input: StopInput;
  try {
    input = JSON.parse(raw);
  } catch {
    process.exit(0);
  }

  // Check each persistent workflow
  for (const workflow of PERSISTENT_WORKFLOWS) {
    const state = readModeState(workflow);
    if (!state) continue;

    // Allow stop if stale or max reinforcements reached
    if (isStale(state) || state.reinforcementCount >= MAX_REINFORCEMENTS) {
      deactivate(workflow);
      continue;
    }

    // Allow stop if different session
    if (state.sessionId !== input.sessionId) {
      deactivate(workflow);
      continue;
    }

    // Block the stop — workflow is still active
    incrementReinforcement(workflow, state);

    const reason = [
      `[OMA PERSISTENT MODE: ${workflow.toUpperCase()}]`,
      `The /${workflow} workflow is still active (reinforcement ${state.reinforcementCount}/${MAX_REINFORCEMENTS}).`,
      `Continue executing the workflow. If all tasks are genuinely complete, run:`,
      `  "워크플로우 완료" or "workflow done"`,
      `to deactivate persistent mode.`,
    ].join("\n");

    process.stdout.write(JSON.stringify({ decision: "block", reason }));
    process.exit(2);
  }

  // No active persistent workflow — allow stop
  process.exit(0);
}

main().catch(() => process.exit(0));
