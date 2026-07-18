# Loop Engineering: The Master Prompt

> A copy-and-paste system for getting an AI coding agent to work through real build tasks on its own, safely, until they are actually done. Works for any team building any product, on any stack: Next.js, Python, Rails, Go, or no-code glue. Copy the whole document, or lift any single prompt block below and drop it into your agent.

---

## What's inside

A short read, then a library you keep. Sections:

1. **The idea in 60 seconds.** Why you write the loop instead of prompting each task.
2. **The Anchor Template.** The five-slot shape every loop is built from.
3. **The Prompt Library.** Six ready-to-paste loops: ship a change until it passes, build/test/lint until green, the continuous master-plan loop, deploy verification, the independent verifier, and the mistake diary.
4. **Write your plan as a story file.** The simple checklist format that lets an agent run an entire plan unattended.
5. **The Five Non-Negotiables.** The checklist before you run anything unattended.
6. **Adapt it to your stack.** A fill-in command table and the two swaps that make it yours.
7. **The one rule that matters most.** What gets harder as loops get better, and stays your job.

How to use it: read sections 1 and 2 once, fill in the table in section 6 for your own project, then paste the loops from section 3 as you need them. Total setup time is about fifteen minutes.

---

## 1. The idea in 60 seconds

Most people prompt an agent to do one task, watch it, then prompt it again. That does not scale and it does not run while you sleep.

Loop engineering flips it. **You stop being the loop. You write the loop.** Instead of "do this task", you hand the agent a goal, an external check it cannot argue with, and the rules for when to stop. Then it iterates on its own: do the work, run the check, read the result, fix, repeat, until the check passes or a stop condition trips.

The whole skill is learning to write that wrapper well. This doc gives you the templates.

Three things make a loop trustworthy:
1. **A verifiable goal.** Not "make it work". Something a command can confirm: tests pass, build exits clean, the page returns 200.
2. **An external check the agent cannot fake.** The agent does not get to decide it is finished. A command decides.
3. **Hard stops.** A budget, an iteration cap, and an escalate-instead-of-guess rule, so a stuck loop reports back instead of spinning or cheating.

---

## 2. The Anchor Template

Every loop you ever write has the same five slots. Learn this shape and you can build any loop.

```
Goal: <the end state, stated so a command can verify it>
Max iterations: <a number, so it cannot run forever>
Between iterations run: <the exact check command>
Exit when: <the exact passing condition>

Step 1: <the work to do each pass>

Self-pace this loop. After each iteration, run the check command, read the
output, and only continue if the exit condition is not met. Stop when the exit
condition passes or max iterations is reached. Give a short status update each pass.

Guardrails (do not skip):
- Do not modify the check command or the exit criteria to force success.
- Do not skip, disable, or bypass checks to pass the exit condition.
- If stuck after several iterations, stop and report the blocker. Do not game the metric.
```

The guardrails are not optional politeness. A capable model under pressure to "make the check pass" will, if you let it, delete the failing test or add a disable comment. The guardrails are what keep the loop honest.

---

## 3. The Prompt Library

Copy these straight into your agent. Replace anything in `<angle brackets>` with your project's real commands. A table of common commands per stack is in section 6.

### 3a. Ship one change until it passes

The workhorse. Use it for any single feature or fix.

```
Goal: the change is implemented and <your test/build command> passes.
Max iterations: 10
Between iterations run: <your check command, e.g. npm test>
Exit when: the check command exits 0.

Step 1: Implement <describe the change in one or two sentences>. Then run the
check, read the output, and fix the smallest root cause of any failure.

Self-pace. Continue only while the exit condition is unmet. Stop when it passes
or at 10 iterations. One-line status each pass: iteration number, what failed,
what you fixed.

Guardrails: do not edit the check command or the tests to force a pass; do not
disable, skip, or comment out checks; if stuck after 3 passes with the same
error, stop and report the blocker.
```

### 3b. Build / test / lint until green

Same shape, swap the check. Run these before you ever push.

```
Goal: <build | test suite | linter> is green.
Max iterations: 6
Between iterations run: <build/test/lint command>
Exit when: it exits 0 with no errors.

Step 1: Run it, fix the smallest root cause of the first failure, run again.
Group errors by cause, not by file. Fix the cause, not the symptom.

Guardrails: fix the code, never loosen the config or add ignore comments to
silence an error; if the same error survives two fix attempts, stop and report it.
```

### 3c. The Continuous Master-Plan Loop (the important one)

This is what lets the agent work through an entire plan on its own, one item at a time, without you babysitting each step. It depends on you writing your plan as a checklist (see section 4).

```
Work the master plan at <path to your plan file>.

Each iteration, do exactly ONE thing:
1. Open the plan. Find the FIRST unchecked "- [ ]" item.
2. If there are none left, report "plan complete" and stop.
3. Do that item, and only that item, in a fresh frame of mind. Do not pull in
   the whole conversation history; read only what the item needs.
4. Run the item's own verify check, exactly as written in the plan.
5. If it passes: tick the box, add a one-line "Done: <date, evidence>" under it,
   save the plan, and post a one-line status.
6. If it fails: retry once. If it fails again, mark the item
   "BLOCKED: <reason>", save the plan, notify me, and STOP the whole loop.

Hard stops, non-negotiable: a blocked item; running low on budget; the plan is
complete. Never edit a verify check to force a pass. Continue to the next item
only while items keep passing.
```

Two details that make or break this loop:
- **One item per pass, fresh context.** Long-running agents rot when you keep stuffing the whole history back in. Reading only what the current item needs keeps the work sharp.
- **It saves state to the plan file every pass.** The ticked boxes and "Done" lines are the memory. If the session dies, you restart and it picks up exactly where it left off.

### 3d. Verify it is actually live

For anything you deploy. Codifies the rule: never report success until you have confirmed it live.

```
Goal: the deploy is live and healthy.
Max iterations: 20 (poll every ~90 seconds, 30 minute ceiling)
Between iterations run: a request to <your deployed URL> and the routes I changed
Exit when: deploy status is ready AND every checked URL returns 200 with the
expected content.

Step 1: Wait for the deploy to finish. Then request each route and confirm it
returns 200 and contains <a specific string the change should have added>.

Guardrails: check the real production URL, not a cache or a preview; do not
shrink the list of routes to make it pass; if a route errors, that is the
finding, report it.
```

### 3e. The Independent Verifier (the trust multiplier)

The single most valuable pattern here. **The agent that did the work never gets to mark its own homework.** Spin up a second, fresh agent that only sees the result and the checks, never the reasoning, and have it grade the work.

```
You are an independent reviewer. You did not do this work and you have not seen
the reasoning behind it. Judge it cold and sceptically.

You are given only: the change, and the checks it must pass. Do this:
1. Read the change as a senior reviewer seeing it for the first time.
2. Run every stated check yourself. Record the exit code and key output.
3. Score it 1 to 5 on: does it work, is it correct, is it complete, is it clean.
4. Return a verdict: PASS only if everything checks out, otherwise FAIL with the
   exact reasons.

You may not fix anything. You may not accept "it looks right" as evidence. Only
a check that you ran and passed counts. If a check cannot be run, the verdict is
FAIL, not PASS.
```

If you only adopt one thing from this doc, adopt this. It is the difference between an agent that says "done" and an agent whose "done" you can trust.

### 3f. The Mistake Diary

Stops the agent repeating the same wrong fix. Pair it with any loop above.

```
Keep a file called LESSONS.md.

Before you attempt any fix, check LESSONS.md for this error. If there is an
entry, follow its guidance instead of repeating a failed approach.

When the same check fails twice the same way, before trying again, append one
entry to LESSONS.md:
- the error (the stable part, no timestamps or line numbers)
- the fix you tried that did NOT work
- one specific instruction the next attempt must follow

Keep entries specific. "Be careful with the build" is useless. "The build runs
out of memory above 40 images, batch them in tens" is a real lesson.
```

---

## 4. Write your plan as a story file

The continuous loop (3c) only works if your plan is machine-runnable. The format is dead simple. Every item has three parts: an **id**, a **Fire** line (what to do), and a **Verify** line (the check that gates the tick).

```markdown
# My Project Plan

- [ ] **1. Add the contact form API route**
  Fire: Create POST /api/contact that validates name, email, message and stores
  them. Follow the patterns already in the codebase.
  Verify: <test command> for the contact route exits 0.

- [ ] **2. Wire the form on the contact page**
  Fire: Connect the existing form UI to POST /api/contact, with a success and an
  error state.
  Verify: build exits 0 and submitting the form on the running dev server shows
  the success state.

- [ ] **3. Ship it**
  Fire: Open a pull request with this change and get the checks green.
  Verify: all pull request checks pass.
```

Rules that keep it honest:
- The **Verify** line must be something a command or an observation can confirm. If you cannot check it, rewrite it until you can.
- One item is one unit of work. If an item needs three checks, it is probably three items.
- Order matters. The loop goes top to bottom and stops at the first blocker, so put dependencies first.

Write the plan once. The loop executes it. You review the ticked boxes.

---

## 5. The Five Non-Negotiables

Before you run any loop unattended, confirm all five. Missing one is how loops burn time, money, or trust.

1. **A verifiable stopping condition.** A command or observation confirms "done", not the agent's opinion.
2. **A budget and an iteration cap.** It cannot run forever or spend unbounded tokens.
3. **A no-gaming rule.** It may never edit the check, disable a test, or fake the metric to pass.
4. **An independent check.** A second pass, ideally a fresh agent, verifies the work (section 3e).
5. **Escalate, do not guess.** When stuck, it stops and reports the exact blocker, with a notification you will actually see.

---

## 6. Adapt it to your stack

The prompts above are generic on purpose. Fill in your project's real commands once and reuse them everywhere. Fill this table in for your own repo and keep it pinned:

| Slot | Node / Next.js | Python | Rails | Fill in yours |
|---|---|---|---|---|
| Build | `npm run build` | `python -m build` | `bin/rails assets:precompile` | |
| Test | `npm test` | `pytest` | `bin/rails test` | |
| Lint | `npm run lint` | `ruff check .` | `bin/rubocop` | |
| Types | `npx tsc --noEmit` | `mypy .` | n/a | |
| Run locally | `npm run dev` | `flask run` | `bin/rails s` | |

Two more swaps to make it yours:
- **Notifications.** Wherever a prompt says "notify me", point it at whatever you will actually see: a Slack or Discord message, an email, a desktop notification. Silent automation is undebuggable. A loop that fails quietly is worse than no loop.
- **Runtime.** These prompts run anywhere an agent runs: an interactive session, a scheduled or cloud run for overnight work, or a CI pipeline. The plan and the checks stay identical across all three. Only the trigger changes.

A note on running headless (scheduled or overnight): never use an approval question that waits for a human, because nobody is there to answer it. Replace any "should I proceed?" with a written rule the agent decides by, or have it save a draft and notify you to review later.

---

## 7. The one rule that matters most

When loops get good, three things get harder, not easier, and they are all on you:

- **Verification is still your job.** A loop running unattended is a loop making mistakes unattended. "It's done" is a claim, not a proof. That is why the independent verifier exists.
- **Comprehension debt.** The faster a loop ships code you did not write, the wider the gap between what exists and what you understand. Read what the loop made.
- **The cure and the trap are the same action.** Designing the loop with judgment is the cure. Designing it to avoid thinking is the trap.

Build the loop. Stay the engineer.

---

*Share it freely. Adapt it to your stack. The patterns are yours.*
