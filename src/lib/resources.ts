// Live member-resource loader. SME experts maintain these by editing a shared Airtable base;
// the site renders published rows. Reads are cached briefly so we don't hit Airtable per request.
// Returns [] on any failure or when unconfigured (pages then show a graceful empty state).

export type ResourceCategory = "Community Resource" | "Bali Guide" | "Legal & Setup";

export interface ResourceRecord {
  id: string;
  title: string;
  category: string;
  description?: string;
  url?: string;
  contributor?: string;
  tags?: string[];
}

export async function getResources(category: ResourceCategory): Promise<ResourceRecord[]> {
  const token = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const table = process.env.AIRTABLE_RESOURCES_TABLE || "Resources";
  if (!token || !baseId) return [];

  const safeCategory = category.replace(/'/g, "\\'");
  const formula = `AND({Published}=TRUE(),{Category}='${safeCategory}')`;
  const params = new URLSearchParams({ filterByFormula: formula, pageSize: "100" });
  const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(table)}?${params.toString()}`;

  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 300 },
    });
    if (!res.ok) {
      console.error("Airtable resources fetch failed:", res.status);
      return [];
    }
    const data = await res.json();
    return (data.records || []).map(
      (r: { id: string; fields: Record<string, unknown> }) => ({
        id: r.id,
        title: (r.fields.Title as string) || "Untitled",
        category: (r.fields.Category as string) || "",
        description: r.fields.Description as string | undefined,
        url: r.fields.URL as string | undefined,
        contributor: r.fields.Contributor as string | undefined,
        tags: r.fields.Tags as string[] | undefined,
      })
    );
  } catch (err) {
    console.error("Airtable resources error:", err);
    return [];
  }
}
