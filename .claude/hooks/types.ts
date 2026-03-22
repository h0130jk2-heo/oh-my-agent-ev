// Claude Code Hook Types for oh-my-agent

// --- Hook Input Types ---

export interface UserPromptSubmitInput {
  sessionId: string;
  messageId?: string;
  prompt: string;
}

export interface StopInput {
  sessionId: string;
  messageId?: string;
  stopReason?: string;
}

// --- Hook Output Types ---

export interface HookAllowOutput {
  additionalContext?: string;
}

export interface HookBlockOutput {
  decision: "block";
  reason: string;
}

// --- Keyword Detection ---

export interface TriggerRule {
  workflow: string;
  patterns: RegExp[];
  /** If true, skip informational-context filtering */
  exact?: boolean;
}

// --- Persistent Mode ---

export interface ModeState {
  workflow: string;
  sessionId: string;
  activatedAt: string;
  reinforcementCount: number;
}
