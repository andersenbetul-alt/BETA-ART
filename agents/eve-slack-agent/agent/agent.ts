import { defineAgent } from "eve";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dir = dirname(fileURLToPath(import.meta.url));

// AGENT_PROFILE selects which profile to load.
// Set in Vercel environment variables:
//   hxi-music project    → AGENT_PROFILE=hxi-music
//   naviar-consult project → AGENT_PROFILE=naviar-consult
// Falls back to the shared instructions.md when not set.
const profile = process.env.AGENT_PROFILE;
const instructionsPath = profile
  ? join(__dir, "profiles", `${profile}.md`)
  : join(__dir, "instructions.md");

const instructions = readFileSync(instructionsPath, "utf8");

export default defineAgent({
  model: "anthropic/claude-sonnet-5",
  instructions,
});
