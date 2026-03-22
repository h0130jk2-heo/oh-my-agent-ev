#!/usr/bin/env bun
/**
 * oh-my-agent — UserPromptSubmit Hook
 *
 * Detects natural-language keywords in user prompts and injects
 * workflow instructions into Claude's context.
 *
 * All trigger keywords are loaded from triggers.json — no hardcoded patterns.
 * Supports any language by adding entries to the config file.
 *
 * stdin : JSON  — { sessionId, prompt }
 * stdout: JSON  — { additionalContext } | {}
 * exit 0 = always (allow)
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { parse } from "yaml";
import type { UserPromptSubmitInput, ModeState } from "./types.ts";

// ── Config Loading ────────────────────────────────────────────

interface TriggerConfig {
  workflows: Record<
    string,
    {
      persistent: boolean;
      keywords: Record<string, string[]>;
    }
  >;
  informationalPatterns: Record<string, string[]>;
  excludedWorkflows: string[];
  cjkScripts: string[];
}

function loadConfig(): TriggerConfig {
  const configPath = join(dirname(import.meta.path), "triggers.json");
  return JSON.parse(readFileSync(configPath, "utf-8"));
}

function detectLanguage(): string {
  const projectDir = process.env.CLAUDE_PROJECT_DIR || process.cwd();
  const prefsPath = join(projectDir, ".agents", "config", "user-preferences.yaml");
  if (!existsSync(prefsPath)) return "en";
  try {
    const prefs = parse(readFileSync(prefsPath, "utf-8"));
    return prefs?.language ?? "en";
  } catch {
    return "en";
  }
}

// ── Pattern Builder ───────────────────────────────────────────

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildPatterns(
  keywords: Record<string, string[]>,
  lang: string,
  cjkScripts: string[],
): RegExp[] {
  // Merge: universal (*) + English (always) + user's language
  const allKeywords = [
    ...(keywords["*"] ?? []),
    ...(keywords["en"] ?? []),
    ...(lang !== "en" ? (keywords[lang] ?? []) : []),
  ];
  const isCjk = cjkScripts.includes(lang);

  return allKeywords.map((kw) => {
    const escaped = escapeRegex(kw).replace(/\s+/g, "\\s+");
    // CJK scripts: no word boundaries (doesn't work)
    // Latin scripts: wrap with \b for accuracy
    if (isCjk || /[^\x00-\x7F]/.test(kw)) {
      return new RegExp(escaped, "i");
    }
    return new RegExp(`\\b${escaped}\\b`, "i");
  });
}

function buildInformationalPatterns(
  config: TriggerConfig,
  lang: string,
): RegExp[] {
  const patterns = [...(config.informationalPatterns["en"] ?? [])];
  if (lang !== "en") {
    patterns.push(...(config.informationalPatterns[lang] ?? []));
  }
  return [
    ...patterns.map((p) => {
      if (/[^\x00-\x7F]/.test(p)) return new RegExp(escapeRegex(p), "i");
      return new RegExp(`\\b${escapeRegex(p)}\\b`, "i");
    }),
    /\?$/,
  ];
}

// ── Informational Context Filter ──────────────────────────────

function isInformationalContext(
  prompt: string,
  matchIndex: number,
  infoPatterns: RegExp[],
): boolean {
  const windowStart = Math.max(0, matchIndex - 60);
  const window = prompt.slice(windowStart, matchIndex + 60);
  return infoPatterns.some((p) => p.test(window));
}

// ── Code Block Stripping ──────────────────────────────────────

function stripCodeBlocks(text: string): string {
  return text.replace(/```[\s\S]*?```/g, "").replace(/`[^`]+`/g, "");
}

// ── State Management ──────────────────────────────────────────

function getStateDir(): string {
  const projectDir = process.env.CLAUDE_PROJECT_DIR || process.cwd();
  const dir = join(projectDir, ".agents", "state");
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  return dir;
}

function activateMode(workflow: string, sessionId: string): void {
  const state: ModeState = {
    workflow,
    sessionId,
    activatedAt: new Date().toISOString(),
    reinforcementCount: 0,
  };
  writeFileSync(
    join(getStateDir(), `${workflow}-state.json`),
    JSON.stringify(state, null, 2),
  );
}

// ── Slash Command Detection ───────────────────────────────────

function startsWithSlashCommand(prompt: string): boolean {
  return /^\/[a-zA-Z][\w-]*/.test(prompt.trim());
}

// ── Main ──────────────────────────────────────────────────────

async function main() {
  const raw = readFileSync("/dev/stdin", "utf-8");
  let input: UserPromptSubmitInput;
  try {
    input = JSON.parse(raw);
  } catch {
    process.exit(0);
  }

  const { prompt, sessionId } = input;
  if (!prompt?.trim()) process.exit(0);
  if (startsWithSlashCommand(prompt)) process.exit(0);

  const config = loadConfig();
  const lang = detectLanguage();
  const infoPatterns = buildInformationalPatterns(config, lang);
  const cleaned = stripCodeBlocks(prompt);
  const excluded = new Set(config.excludedWorkflows);

  for (const [workflow, def] of Object.entries(config.workflows)) {
    if (excluded.has(workflow)) continue;

    const patterns = buildPatterns(def.keywords, lang, config.cjkScripts);

    for (const pattern of patterns) {
      const match = pattern.exec(cleaned);
      if (!match) continue;

      if (isInformationalContext(cleaned, match.index, infoPatterns)) continue;

      if (def.persistent) {
        activateMode(workflow, sessionId);
      }

      const context = [
        `[OMA WORKFLOW: ${workflow.toUpperCase()}]`,
        `User intent matches the /${workflow} workflow.`,
        `Read and follow \`.agents/workflows/${workflow}.md\` step by step.`,
        `User request: ${prompt}`,
        `IMPORTANT: Start the workflow IMMEDIATELY. Do not ask for confirmation.`,
      ].join("\n");

      process.stdout.write(JSON.stringify({ additionalContext: context }));
      process.exit(0);
    }
  }

  process.exit(0);
}

main().catch(() => process.exit(0));
