import { SITE } from "@/lib/constants";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      ...(item.href && { item: `${SITE.url}${item.href}` }),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-xs text-brand-grey">
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-1">
            {i > 0 && <ChevronRight size={10} className="text-brand-grey" />}
            {item.href ? (
              <Link
                href={item.href}
                className="hover:text-brand-white transition-colors"
              >
                {item.label}
              </Link>
            ): (
              <span className="text-brand-grey">{item.label}</span>
            )}
          </span>
        ))}
      </nav>
    </>
  );
}
