import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface BlogCalloutProps {
  title: string;
  description: string;
  href: string;
  label?: string;
}

export default function BlogCallout({
  title,
  description,
  href,
  label = "Read More",
}: BlogCalloutProps) {
  return (
    <Link
      href={href}
      className="group block my-8 p-6 rounded-lg border border-brand-red/20 bg-brand-red/5 hover:bg-brand-red/10 transition-all"
    >
      <p className="text-xs font-medium uppercase tracking-wider text-brand-red mb-2">
        Related
      </p>
      <h4 className="font-semibold text-brand-white group-hover:text-brand-red transition-colors mb-1">
        {title}
      </h4>
      <p className="text-sm text-brand-grey mb-3">{description}</p>
      <span className="inline-flex items-center gap-1 text-sm text-brand-red group-hover:text-brand-white transition-colors">
        {label} <ArrowRight size={14} />
      </span>
    </Link>
  );
}
