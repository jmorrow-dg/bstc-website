---
title: "The End of Subsidised AI: What Claude Code Leaving the Pro Plan Means for Southeast Asia Founders"
slug: end-of-subsidised-ai-claude-code-pricing-sea-founders-2026
date: "2026-04-23"
author: Josh Morrow
authorRole: Co-founder, BSTC & David & Goliath
category: thought-leadership
readTime: "10 min"
tags:
  - AI
  - Claude Code
  - Anthropic
  - pricing
  - Southeast Asia
  - founders
  - AI economics
excerpt: "On 21 April 2026 Anthropic quietly pulled Claude Code from the $20 Pro plan, pushing users to the $100 Max tier. Framed as a 2% test, executed as a global rollout. The signal is not the price hike. It is the admission that flat-rate frontier AI was never sustainable, and that changes the calculation for every SEA founder building on top of it."
seo:
  title: "Anthropic Pulls Claude Code From Pro: What It Means for SEA Founders | BSTC"
  description: "Anthropic removed Claude Code from the $20 Pro plan. What changed, why it matters, and the 5-step margin stress test every Southeast Asia founder building on AI APIs should run this week."
  keywords:
    - Claude Code pricing
    - Anthropic Pro plan
    - Claude Max plan
    - AI pricing 2026
    - token pricing
    - AI subscription economics
    - Southeast Asia AI founders
    - Claude Code alternatives
    - Cursor vs Claude Code
    - AI margin stress test
---

# The End of Subsidised AI: What Claude Code Leaving the Pro Plan Means for Southeast Asia Founders

On Monday, Anthropic's pricing page said the Pro plan includes Claude Code. By Tuesday, it did not. No blog post, no email to subscribers, no changelog entry. The $20 tier lost its flagship coding agent, and the $100 Max plan became the new floor for anyone who wanted it.

George Pu's tweet flagging the silent edit hit nearly a million views in a few hours. Anthropic's Head of Growth, Amol Avasare, replied the same day to clarify: this was "a small test on ~2% of new prosumer signups," and "existing Pro and Max subscribers are not affected." That framing held for about as long as it took people to pull up the support docs, which had already been rewritten globally from "Using Claude Code with your Pro or Max plan" to "Using Claude Code with your Max plan." Not a 2% test. A rollout that got pre-announced by accident.

If you are a founder in Bali, Jakarta, Singapore, Manila, Bangkok, or Ho Chi Minh City and you are building anything that runs on top of a Claude, OpenAI, or reseller API, this is not a headline to scroll past. The price of the tool is the smallest part of the story. The real signal is what it tells you about the unit economics of every AI subscription you and your customers currently rely on, and how fast that ground is moving.

This post breaks down what actually happened, why it happened, what to expect next, and a five-step margin stress test every SEA founder building on AI APIs should run this week.

## TL;DR

- **What changed (21 April 2026):** Claude Code moved from being a $20/month Pro benefit to being Max-only at $100/month minimum. Anthropic called it a 2% test but support documentation was globally rewritten.
- **Why it happened:** A single heavy Claude Code user can reportedly burn 10x their subscription fee in token costs. Flat-rate frontier AI at $20/month was never going to last.
- **The broader pattern:** GitHub Copilot is moving to token-based billing. OpenAI has tightened Codex limits. The VC-funded "subsidy era" of AI pricing is unwinding in public.
- **What SEA founders should do:** Stress-test your margins assuming token pass-through pricing within 12 months. Plan for Max-style pricing tiers to become the norm, not the exception.
- **Where to look next:** Chinese frontier models (GLM, Kimi, Qwen) and coding-specific tools (Cursor, Codex) are now genuinely viable alternatives, not just cheap substitutes.
- **The framing:** The companies that hid the subsidy best will take the biggest reputational hit when it unwinds. Build trust by pricing honestly now.

## What actually happened

On 20 April 2026, Anthropic's pricing and support pages listed Claude Code as included in both the Pro ($20/month) and Max ($100/$200/month) plans. On 21 April, the pricing table changed. Claude Code now shows a cross under Pro and a tick only under Max. The support documentation shifted in parallel. The "Using Claude Code with your Pro or Max plan" article was renamed and rewritten to reference only the Max plan.

There was no blog post. No email to existing Pro subscribers. No changelog entry. Developers noticed because they went to sign up and the checkout flow told them they needed Max. Some of them tweeted. Those tweets went viral.

Amol Avasare's public response on X was that this was a "small test on ~2% of new prosumer signups" and that existing subscribers were not affected. That claim was contradicted by the same company's own help centre, which by that point was serving the Max-only version to everyone. Journalists at The Register and Ed Zitron at "Where's Your Ed At" flagged the inconsistency the same day.

The most honest part of Anthropic's response was Avasare's follow-up observation that when Max launched a year ago, long-running coding agents barely existed. Since Opus 4 shipped, "engagement per subscriber has surged significantly." Translation: our Pro tier was priced for a world that no longer exists.

## The official story versus the observable reality

| Claim | Observable reality |
| --- | --- |
| "Small test on 2% of new prosumer signups" | Support docs globally rewritten to Max-only |
| "Existing Pro and Max subscribers are not affected" | True for now. Avasare also said "if it affects existing subscribers you'll get plenty of notice," which is not a commitment that it will not |
| "We are exploring different options" | Pricing page already ships a specific option |

This is the pattern you want to notice. The company is probably telling the truth about the technical rollout mechanics (a 2% cohort flag exists). It is also clearly telegraphing the direction. The small test is how a product team writes the plausible-deniability version of a decision that has already been made.

## Why it happened: the token economics do not work

Anthropic is not being greedy. It is being honest, late.

The core problem is that a frontier coding agent at Opus-class quality costs real money to serve. When a developer asks Claude Code to scaffold a feature, it may spin through hundreds of thousands of tokens of context, tool calls, file reads, test runs, and revisions. Heavy users can push through millions of tokens per day. At API rates, a single power user burns through their entire $20 monthly fee inside a handful of sessions. Industry reporting puts the ratio at roughly 10x between what heavy Claude Code users consume in raw token cost and what Pro subscriptions charge.

Anthropic tried softer interventions first. Usage limits were introduced in March 2026 to push consumption off-peak. That did not bend the curve enough. The Pro tier, economically, was a subsidy from investors to power users. Someone had to eat the cost. For a while, the venture capital markets did.

That subsidy is now running out across the industry, not just at Anthropic. GitHub Copilot is shifting to token-based billing for its premium agent features. OpenAI tightened Codex rate limits. Google Gemini's new usage model has similar direction. The pattern is unmistakable. Frontier AI at flat subscription rates is not a business model that survives contact with real usage patterns. It was a customer acquisition loss leader, and the leader is tired of losing.

## Why the silent execution hurt more than the price

Here is the thing that will stick with me long after the $80/month price delta is forgotten. The backlash was not about money. It was about trust.

Developers who chose Claude Code over GitHub Copilot or Cursor specifically because it came bundled with Pro felt bait-and-switched. The lack of an announcement, a grandfathering period, or even a clear acknowledgement that this was a policy change (not just a test) turned a defensible business decision into a reputational own-goal. The most devastating comment I saw on Hacker News was short: "A/B tests only work if the subjects do not realise they are in an A/B test."

If you are reading this as an SEA founder thinking about your own pricing decisions, this is the lesson worth stealing. You will have to raise prices. Your cost base is moving. Your customers know this. What they do not know is whether they can trust you to tell them when it happens. Announce the change, explain the reason, offer a transition. The $20-to-$100 move would have been forgiven. The silent edit of the support docs will not be.

## What this means for SEA founders specifically

The Southeast Asian founder context matters here because the economics are not the same as San Francisco. A $100 USD monthly AI subscription at SEA engineering salary parities is not a rounding error. It is a meaningful hiring-lever decision. For a Jakarta dev shop running 15 engineers, the difference between Pro and Max for all of them is $14,400 a year. That buys a junior engineer in Indonesia. Or a second brand designer. Or three months of runway.

Three implications follow.

**1. SEA dev teams will migrate faster than SF teams.** The flat-rate subsidy was always more valuable in cost-sensitive markets than in places where a $100 tool is considered cheap. When Anthropic moves Claude Code to Max-only globally, the SF teams shrug and expense it. The SEA teams do a build-versus-buy review. That is already happening this week.

**2. Chinese frontier models become genuinely competitive on price-performance.** GLM, Kimi, and Qwen are not second-tier alternatives anymore. GLM-4.6 and Kimi K2 are within a few percentage points of Claude 4.x and GPT-5.x on real coding benchmarks, at roughly 15% to 30% of the cost for equivalent tokens. For SEA teams shipping B2C products to SEA users, the data-residency optics are often better too. If you have been treating Chinese models as "the cheap option we will try later," now is later.

**3. Agent-layer tools with their own pricing logic win.** Cursor at $20/month still gives you effectively unlimited Composer use. Codex at $20 still works fine for most tasks. These tools control the agent layer and negotiate their own volume deals with model providers, which insulates them from Anthropic and OpenAI's direct pricing shifts. If you are choosing an AI coding environment for your team today, the question is no longer "which has the best model access" but "which has the most durable pricing stack."

## The five-step margin stress test to run this week

If any part of your product economics, your internal tooling budget, or your customer pricing depends on AI subscriptions, run this stress test. It takes an afternoon.

**Step 1: Inventory every flat-rate AI cost in your stack.**
List every tool your team uses that depends on a frontier model and is priced below token pass-through cost. Claude Pro, ChatGPT Plus, Cursor, Copilot, v0, Lovable, Replit Agent, Perplexity Pro, Windsurf, Granola, Linear AI features. If it uses a frontier model and costs less than $50/month, it is on the list.

**Step 2: Calculate each tool's likely unit economics.**
For each tool on the list, estimate whether the current price plausibly covers the underlying model costs. If you are paying $20/month and your team generates more than ~2 million tokens a month through the tool, the vendor is losing money on you. Assume that gap closes.

**Step 3: Build a 12-month scenario at 3x prices.**
Take your current annual AI tooling bill and triple it. That is a defensible worst-case scenario if the full subsidy unwinds. If your business cannot absorb 3x AI costs without restructuring, your margins are a subsidy, not a business.

**Step 4: Identify your single-vendor exposure.**
If more than 60% of your AI cost is going to one provider, you have concentration risk. Anthropic's pricing move could just as easily have been OpenAI or Google. Build an architecture that can swap models with minimal rework, which usually means routing through a thin abstraction layer or using a provider-agnostic tool.

**Step 5: Decide where AI value actually lives for your customer.**
The companies that will survive the subsidy unwind are the ones where AI is the delivery mechanism, not the value proposition. If your pitch to customers is "we use Claude 4.7," you are selling someone else's roadmap. If your pitch is "we solve this specific SEA-market problem and happen to use AI to do it," you have pricing power. Audit your own positioning honestly.

## The alternatives landscape for SEA teams in April 2026

A practical starting point, based on what BSTC members are using right now after the Claude Code news.

**Coding agents (team/workstation use):**
- **Cursor** ($20/month) remains the strongest flat-rate option. Heavy Composer use without the per-token anxiety.
- **GitHub Copilot** is becoming hybrid: the standard autocomplete stays subscription, the agent mode is moving to tokens. Calculate your usage.
- **Codex CLI** ($20/month with ChatGPT Plus) handles most routine tasks well. Less polished than Claude Code, but honest pricing.
- **Claude Code via Max ($100/month)** is still the best for long-running agentic coding tasks if you can afford it. Worth it for senior engineers shipping complex agent work.

**Models via API for product integration:**
- **Anthropic Claude 4.7 Opus/Sonnet** for your highest-stakes customer-facing reasoning.
- **OpenAI GPT-5.x** for tool use and structured output reliability.
- **Google Gemini 2.x Pro** for long context and multimodal.
- **GLM-4.6 / Kimi K2 / Qwen 3.x** for cost-sensitive paths, internal tooling, and bulk generation. Genuine 70% to 85% cost savings at within-margin quality for most tasks.

**Infra and orchestration:**
- **OpenRouter** or **LiteLLM** to abstract provider lock-in. Cheap insurance.
- **Vercel AI SDK** if you are already in that ecosystem.

None of these recommendations are static. Re-run this shortlist every quarter for the next two years. The pricing architecture of the entire industry is in motion.

## The bigger bet: where AI value actually lives in SEA

I keep coming back to this question when I advise founders in our community. If the raw model access is going to become more expensive, not cheaper, and if every competitor you have gets the same models you do, where does your moat actually come from?

For SEA founders, the answer has always been the same as it was before AI. Local market knowledge. Local distribution. Local trust. Local regulatory navigation. Local payment rails. Local language and cultural nuance. AI is a productivity multiplier on top of those durable advantages. It is not the advantage itself.

The founders I see winning in 2026 are not the ones with the cheapest token costs. They are the ones who figured out that the model was never the product, and who built something specific enough to an SEA problem that the customer could not switch to a generic US-built tool even if they wanted to.

That is the reframe worth taking from this week's news. The subsidy era is ending. Good. It forces the question every founder should have been asking anyway: what am I selling that would still be worth buying if the AI part got 3x more expensive?

## What to do this week

1. Run the five-step margin stress test on your stack.
2. If you are on Claude Pro specifically for Claude Code, decide in the next seven days whether Max is worth $100/month for your actual usage, or whether Cursor, Codex, or a GLM-based setup gets you 80% there for 20% of the cost.
3. If you sell any product priced at a flat monthly rate that depends on a frontier AI API, redraft your Terms of Service to allow for provider-pass-through pricing changes. Do it before you need it.
4. Announce any pricing change you make to your customers honestly and ahead of time. Be the counter-example to Anthropic's week.
5. Re-read your own positioning. If you are selling "we have Claude 4.7," find a better answer. This week is a good prompt.

## Final thought

Anthropic still posted a $19B revenue run-rate in 2026. The company is not in trouble. The Pro plan was. That is the precision of this signal. The money is being made, and the pricing is being corrected toward where the unit economics already were. The loud part is finally being said out loud.

For SEA founders, that is useful information. The cheapest AI is probably behind you. The most interesting AI products are probably still ahead. The difference between the founders who make it through the next 18 months and the ones who do not will come down to whether they built a business or a subsidy arbitrage. The pricing page at claude.com just told you which one you have.

## Related reading from BSTC

- [The State of AI in Southeast Asia: Where the Opportunities Are in 2026](/blog/state-of-ai-southeast-asia-2026)
- [The AI Stack for Founders in 2026: What Builders Are Actually Using](/blog/ai-tools-founders-2026)

---

*Building something AI-native in Southeast Asia? [Join BSTC](/join) and plug into the community of operators figuring this out together in Bali, Singapore, Jakarta, and across the region.*
