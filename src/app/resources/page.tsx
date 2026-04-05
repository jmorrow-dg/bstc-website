import Link from "next/link";
import { Metadata } from "next";
import {
  ArrowRight,
  ExternalLink,
  Code,
  Zap,
  BarChart3,
  Paintbrush,
  Megaphone,
  Wrench,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Resources: Tools & Stack Used by BSTC Founders",
  description:
    "The tools, platforms, and resources used by 2,500+ founders in the BSTC community. AI, development, automation, sales, design: curated from real builder workflows.",
  keywords: [
    "founder tools",
    "startup tools 2026",
    "AI tools for founders",
    "best tools for startups",
    "builder stack",
    "tech stack founders",
  ],
};

interface Tool {
  name: string;
  description: string;
  url: string;
  tag?: string;
}

const TOOL_CATEGORIES = [
  {
    name: "AI & Intelligence",
    icon: Zap,
    description: "The AI tools our community builds with daily",
    tools: [
      {
        name: "Claude (Anthropic)",
        description:
          "LLM with strong reasoning and 200K context. Used for code review, strategy, content, and as a thinking partner.",
        url: "https://claude.ai",
        tag: "Most used",
      },
      {
        name: "ChatGPT (OpenAI)",
        description:
          "Broad-capability LLM. Strong at creative tasks, custom GPTs, and image generation via DALL-E.",
        url: "https://chat.openai.com",
      },
      {
        name: "Cursor",
        description:
          "AI-native code editor. Entire editing experience built around AI pair programming. Cuts dev time 40-60%.",
        url: "https://cursor.com",
        tag: "Builder favourite",
      },
      {
        name: "Descript",
        description:
          "AI-powered audio/video editor. Edit audio by editing text. Essential for podcast production.",
        url: "https://descript.com",
      },
    ],
  },
  {
    name: "Development & Hosting",
    icon: Code,
    description: "The stack our members ship products on",
    tools: [
      {
        name: "Vercel",
        description:
          "Frontend deployment platform. Zero-config deploys, edge network, built-in analytics. Hosts the BSTC website.",
        url: "https://vercel.com",
        tag: "We use this",
      },
      {
        name: "Supabase",
        description:
          "Open-source Firebase alternative. PostgreSQL database, auth, storage, and realtime: all managed.",
        url: "https://supabase.com",
      },
      {
        name: "Next.js",
        description:
          "React framework for production. SSR, SSG, API routes, image optimisation. The foundation of modern web apps.",
        url: "https://nextjs.org",
        tag: "We use this",
      },
      {
        name: "GitHub",
        description:
          "Code hosting and collaboration. Where the BSTC website lives as a living, version-controlled system.",
        url: "https://github.com",
      },
    ],
  },
  {
    name: "Automation & Workflows",
    icon: Wrench,
    description: "Connect tools and automate the repetitive stuff",
    tools: [
      {
        name: "n8n",
        description:
          "Open-source workflow automation. Self-hosted, no per-execution pricing. The power user's choice.",
        url: "https://n8n.io",
        tag: "Builder favourite",
      },
      {
        name: "Make (Integromat)",
        description:
          "Visual automation platform. Lower learning curve than n8n, good for non-technical founders.",
        url: "https://make.com",
      },
      {
        name: "Zapier",
        description:
          "The most accessible automation tool. Connects 5,000+ apps. Best for simple, quick automations.",
        url: "https://zapier.com",
      },
    ],
  },
  {
    name: "Sales & GTM",
    icon: BarChart3,
    description: "How BSTC founders find and close customers",
    tools: [
      {
        name: "Apollo.io",
        description:
          "Sales intelligence and engagement. Prospecting, enrichment, and outreach in one platform.",
        url: "https://apollo.io",
      },
      {
        name: "Clay",
        description:
          "Data enrichment and outreach with AI. Waterfall enrichment produces higher-quality prospect data than any single source.",
        url: "https://clay.com",
      },
      {
        name: "Resend",
        description:
          "Developer-first email API. Simple, reliable, great deliverability. Used for transactional and marketing email.",
        url: "https://resend.com",
      },
    ],
  },
  {
    name: "Design & Content",
    icon: Paintbrush,
    description: "Create without a design team",
    tools: [
      {
        name: "Canva",
        description:
          "Design platform for non-designers. Templates, brand kits, and quick social media asset creation.",
        url: "https://canva.com",
      },
      {
        name: "DALL-E",
        description:
          "AI image generation. BSTC uses it for our GTA-style event cover art. Great for social media visuals.",
        url: "https://openai.com/dall-e",
      },
      {
        name: "Framer Motion",
        description:
          "React animation library. Powers the animations on this website. Scroll-triggered, gesture-based, production-ready.",
        url: "https://framer.com/motion",
      },
    ],
  },
  {
    name: "Community & Events",
    icon: Megaphone,
    description: "How we run the community and events",
    tools: [
      {
        name: "MeetUp",
        description:
          "Event listing and RSVP management. Where our 2,100+ members discover and register for events.",
        url: "https://meetup.com",
        tag: "We use this",
      },
      {
        name: "WhatsApp",
        description:
          "Primary community communication. 2,500+ members across community and leader channels.",
        url: "https://whatsapp.com",
        tag: "We use this",
      },
      {
        name: "Luma",
        description:
          "Modern event platform. Beautiful event pages, built-in ticketing, better discovery than MeetUp for premium events.",
        url: "https://luma.com",
      },
    ],
  },
];

function ToolCard({ tool }: { tool: Tool }) {
  return (
    <a
      href={tool.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block p-5 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-brand-red/20 transition-all"
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-brand-white group-hover:text-brand-red transition-colors text-sm">
          {tool.name}
        </h3>
        <div className="flex items-center gap-2">
          {tool.tag && (
            <span className="text-[10px] font-medium uppercase tracking-wider text-brand-red bg-brand-red/10 px-2 py-0.5 rounded">
              {tool.tag}
            </span>
          )}
          <ExternalLink
            size={12}
            className="text-brand-grey group-hover:text-brand-red transition-colors flex-shrink-0"
          />
        </div>
      </div>
      <p className="text-xs text-brand-grey leading-relaxed">
        {tool.description}
      </p>
    </a>
  );
}

export default function ResourcesPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-16 md:py-24">
        <div className="max-w-site mx-auto px-6">
          <p className="text-brand-red text-sm font-medium uppercase tracking-widest mb-4">
            Resources
          </p>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            The Builder&apos;s Toolkit
          </h1>
          <p className="text-brand-grey max-w-2xl text-lg">
            The tools, platforms, and resources used by 2,500+ founders in the
            BSTC community. Curated from real workflows: not sponsored lists.
          </p>
        </div>
      </section>

      {/* Tool Categories */}
      <section className="pb-16 md:pb-24">
        <div className="max-w-site mx-auto px-6">
          {TOOL_CATEGORIES.map((category) => (
            <div key={category.name} className="mb-16">
              <div className="flex items-center gap-3 mb-2">
                <category.icon className="w-5 h-5 text-brand-red" />
                <h2 className="text-xl font-display font-bold text-brand-white">
                  {category.name}
                </h2>
              </div>
              <p className="text-sm text-brand-grey mb-6">
                {category.description}
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.tools.map((tool) => (
                  <ToolCard key={tool.name} tool={tool} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 border-t border-white/5">
        <div className="max-w-site mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-display font-bold mb-4">
            See These Tools in Action
          </h2>
          <p className="text-brand-grey max-w-md mx-auto mb-8">
            Every &ldquo;How I Build with AI&rdquo; session features founders
            demonstrating these tools live: with real workflows and real
            revenue.
          </p>
          <Link
            href="/how-i-build-with-ai"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-red hover:bg-brand-red-dark text-brand-white font-medium rounded transition-colors"
          >
            Watch Builder Sessions
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
