## Upstream sync (milind-soni/OpenMausBot → HubBot)

Every time you merge upstream into this fork, re-apply these removals to whatever the merge brings in:

- **No Cloud service, plans or purchases.** HubBot sells nothing. Keep off every plan, billing, subscription, upgrade,
  trial, checkout, "Add a Cloud" and Cloud-move surface, including popups that offer a plan. The switches are:
  `CLOUD_SERVICES = false` in `electron/preload.cjs` (the `cloudAccount`, `cloudPlan`, `cloudSendPage`, `placesTogether`,
  `accounts`, `accountSheet` bridges stay `undefined`, and stay out of `electron/bridge-contract.json`),
  `cloudOffersAllowed()` returning `false` in `electron/main.mjs`, `plan: false` in
  `src/components/settings/settings-context.ts`, `whatsNewSlides()` returning `[]` in `src/lib/whats-new.ts`, and no
  `"cloud"` step or chip in `setupSteps`/`introChips` (`src/lib/default-bot.ts`). New upstream UI that sells or links
  to the Cloud goes behind the same switches or is removed.
- **No link to https://cloud.openmausbot.com/** anywhere a person can see or open it (no `CLOUD_PLAN_URL`, no Plan-page link).
- **No link to https://github.com/milind-soni/OpenMausBot** anywhere: remove it from new and changed strings and UI, instead of docs.
- Update tests that assert the removed behavior so they assert its absence instead.

## Running tests

After every code change, ask the user for confirmation before running any tests (unit, e2e, typecheck-as-test or
`verify-omb`). Say which tests you plan to run, then wait for a yes. Don't run them on your own initiative.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:

- When graphify-out/graph.json exists, run `graphify query "<question>"` before your first grep, search or source-file read for a codebase question, and put this rule in every subagent prompt that explores code. Read raw files only for lines the graph or an earlier read already located. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- Run `graphify update .` only when the user asks for it. Do not run it automatically after modifying code or merging.
- A committed graphify-out/graph.json is rewritten whole on every build, so a large diff to it in a pull request is expected. Do not flag it as churn or suggest skipping the graph rebuild or its hooks.
- Graph build scope: only priority 1 `server/` and priority 2 `src/`. When building or updating the graph, include only files under these two folders; leave the rest of the repo (docs, electron, scripts, shared, packages, apps) out of the graph.

# CLAUDE.md

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:

- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:

- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:

- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:

- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:

```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.
