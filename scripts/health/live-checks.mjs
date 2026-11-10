// Daily read-only checks: endpoints (item 7), known live issues (item 16) and
// perks counts (item 20). Run scripts/health/crawl.mjs first; this reads its crawl.json.
// Usage: node scripts/health/live-checks.mjs [base] [evidence directory]
import { readFile, writeFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { isFutureLastmod, sitemapEntries, visibleText, witaDate } from './crawl.mjs';

export function robotsSummary(text) {
  const agents = [...text.matchAll(/^\s*user-agent:\s*(.+?)\s*$/gim)].map(m => m[1].toLowerCase());
  return { wildcardGroups: agents.filter(a => a === '*').length, claudeSearchBot: agents.includes('claude-searchbot'), claudeUser: agents.includes('claude-user'), sitemapLine: /^\s*sitemap:/im.test(text) };
}
// Member offer counts as worded in the /perks meta description and llms.txt since #38.
export function offerCounts(text = '') {
  const n = re => { const m = text.match(re); return m ? Number(m[1]) : null; };
  return {
    agreedTerms: n(/\b(\d+) offers? (?:have|has) agreed terms\b/i),
    activationPending: n(/\b(\d+) (?:offer )?is agreed and waiting on activation\b/i),
    received: n(/\b(\d+) offers? (?:has|have) been received\b/i),
    examples: n(/\b(\d+) example listings\b/i),
    exampleNotAvailable: n(/\b(\d+) examples? (?:is|are) not currently available\b/i),
  };
}
export function perksCounts({ perksText, homeText, llmsText, perksDescription = '' }) {
  const n = (text, re) => { const m = text.match(re); return m ? Number(m[1]) : null; };
  return {
    perksPage: n(perksText, /\b(\d+)\s+Open now\b/i),
    home: n(homeText, /\b(\d+)\s+startup programmes are open\b/i),
    llms: n(llmsText, /\b(\d+) open startup programmes\b/i),
    llmsDirect: n(llmsText, /\b(\d+) you apply for direct\b/i),
    llmsPartner: n(llmsText, /\b(\d+) through a partner referral\b/i),
    offersPage: offerCounts(perksDescription),
    offersLlms: offerCounts(llmsText),
  };
}
export function perksConsistent(c) {
  const offers = Object.keys(c.offersPage ?? {});
  return c.perksPage !== null && c.perksPage === c.home && c.home === c.llms && c.llmsDirect + c.llmsPartner === c.llms
    && offers.every(k => c.offersPage[k] !== null && c.offersPage[k] === c.offersLlms[k]);
}
// Each issue is checked against the named pages, or every sitemap page when pages is absent.
export const KNOWN_ISSUES = [
  { id: 'home-hackathons', owner: 'lane 4', pages: ['/'], pattern: /Full-day hackathons/ },
  { id: 'home-ticket-fee', owner: 'lane 4', pages: ['/'], pattern: /ticketed editions|may have a ticket fee/i },
  { id: 'home-hackathon-faq-card', owner: 'lane 4', pages: ['/'], pattern: /About the Hackathon|Hackathons: one-day builds/i },
  { id: 'home-audience-percentages', owner: 'lane 4', pages: ['/'], pattern: /40\s*%\s*Startup founders/i },
  { id: 'home-cadence-and-room-size', owner: 'lane 4', pages: ['/'], pattern: /4 to 6 events per month|40 to 80/ },
  { id: 'ticket-price', owner: 'lane 2', pages: ['/faq', '/community'], pattern: /ticket price/i },
  { id: 'ticketed-blog', owner: 'lane 3', pages: ['/blog/best-tech-events-bali'], pattern: /Cost:\s*Ticketed/i },
  { id: 'agency-mention', owner: 'lanes 2, 3, 4', pattern: /goliath/i },
  { id: 'retired-2500', owner: 'lane 3', pages: ['/blog/how-to-network-at-tech-events'], pattern: /2,500\+/ },
  { id: 'start-up-in-own-name', owner: 'lane 3', pattern: /Bali Start-ups?\b/i },
];
export function checkIssues(rows, base, issues = KNOWN_ISSUES) {
  const path = row => row.url.replace(base, '') || '/';
  return issues.map(issue => {
    const pool = issue.pages ? rows.filter(r => issue.pages.includes(path(r))) : rows;
    const hits = pool.filter(r => issue.pattern.test(r.visibleText ?? '')).map(path);
    return { id: issue.id, owner: issue.owner, status: hits.length ? 'still live' : 'fixed', hits };
  });
}
function eventNode(html) {
  for (const m of html.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      const data = JSON.parse(m[1]);
      for (const node of [data, ...(data['@graph'] ?? [])].flat()) if (node?.['@type'] === 'Event') return node;
    } catch { /* The crawl reports parse errors. */ }
  }
  return null;
}
async function head(url) {
  const response = await fetch(url, { redirect: 'manual', signal: AbortSignal.timeout(30000), headers: { 'user-agent': 'BSTC-Site-Health/1.0' } });
  return { response, body: await response.text() };
}
async function run(base, output) {
  const checkedAt = new Date().toLocaleString('en-AU', { timeZone: 'Asia/Makassar', dateStyle: 'medium', timeStyle: 'short' }) + ' WITA';
  const { rows } = JSON.parse(await readFile(resolve(output, 'crawl.json'), 'utf8'));
  const get = async path => { const { response, body } = await head(base + path); return { status: response.status, location: response.headers.get('location'), robots: response.headers.get('x-robots-tag'), body }; };
  const [robots, sitemap, llms, llmsFull, articles, members, hackathon, join, slash] = await Promise.all(['/robots.txt', '/sitemap.xml', '/llms.txt', '/llms-full.txt', '/articles', '/members', '/events/hackathon-edition-1', '/join', '/events/'].map(get));
  const bare = await head(base.replace('://www.', '://'));
  const entries = sitemapEntries(sitemap.body);
  const future = entries.filter(e => isFutureLastmod(e.lastmod));
  const linksToArticles = rows.filter(r => (r.internalOutlinks ?? []).some(l => l.replace(/\/$/, '').endsWith('/articles'))).length;
  const joinNoindex = /noindex/i.test(join.robots ?? '') || /<meta[^>]+name=["']robots["'][^>]+noindex/i.test(join.body);
  const robot = robotsSummary(robots.body);
  const text = path => rows.find(r => (r.url.replace(base, '') || '/') === path)?.visibleText ?? '';
  const perksRow = rows.find(r => r.url.replace(base, '') === '/perks');
  const perks = perksCounts({ perksText: text('/perks'), homeText: text('/'), llmsText: llms.body, perksDescription: perksRow?.description ?? '' });
  const issues = checkIssues(rows, base);
  const events = [];
  for (const slug of ['how-i-ai-edition-19', 'how-i-ai-edition-20', 'how-i-ai-edition-21', 'how-i-ai-edition-22', 'networking-drinks-dinner-canggu-40', 'networking-drinks-dinner-canggu-41']) {
    const { body } = await get(`/events/${slug}`);
    const e = eventNode(body) ?? {};
    const offers = [e.offers].flat()[0] ?? {};
    events.push({ slug, endDate: Boolean(e.endDate), organizer: Boolean(e.organizer), contributor: Boolean(e.contributor), isAccessibleForFree: e.isAccessibleForFree ?? false, priceCurrency: offers.priceCurrency ?? '', moderatedLine: visibleText(body).match(/Moderated by [^.]{0,40}Community/)?.[0] ?? '' });
  }
  const result = { checkedAt, robots: { status: robots.status, ...robot }, sitemap: { status: sitemap.status, urls: entries.length, joinListed: entries.some(e => e.loc.endsWith('/join')), hackathonListed: entries.some(e => e.loc.endsWith('/events/hackathon-edition-1')), future }, llms: llms.status, llmsFull: llmsFull.status, articles: articles.status, linksToArticles, members: members.status, hackathon: { status: hackathon.status, location: hackathon.location }, bare: { status: bare.response.status, location: bare.response.headers.get('location') }, trailingSlash: { status: slash.status, location: slash.location }, join: { status: join.status, noindex: joinNoindex }, perks, perksConsistent: perksConsistent(perks), issues, events };
  await writeFile(resolve(output, 'live-checks.json'), JSON.stringify(result, null, 2));
  const yn = v => (v ? 'yes' : 'no');
  const md = `# Live checks, ${checkedAt}\n\n## Endpoints\n\n| Check | Result |\n| --- | --- |\n| /robots.txt | ${robots.status}; ${robot.wildcardGroups} \`User-agent: *\` groups; Claude-SearchBot ${yn(robot.claudeSearchBot)}; Claude-User ${yn(robot.claudeUser)}; Sitemap line ${yn(robot.sitemapLine)} |\n| /sitemap.xml | ${sitemap.status}; ${entries.length} URLs; /join listed ${yn(result.sitemap.joinListed)}; hackathon listed ${yn(result.sitemap.hackathonListed)}; ${future.length} lastmod after today |\n| /llms.txt | ${llms.status} |\n| /llms-full.txt | ${llmsFull.status} |\n| /articles | ${articles.status}; ${linksToArticles} sitemap pages link to it |\n| /members | ${members.status} |\n| /events/hackathon-edition-1 | ${hackathon.status}${hackathon.location ? ` to ${hackathon.location}` : ''} |\n| Bare domain | ${bare.response.status} to ${bare.response.headers.get('location')} |\n| /events/ (trailing slash) | ${slash.status} to ${slash.location} |\n| /join | ${join.status}; noindex ${yn(joinNoindex)} |\n\n## Sitemap lastmod after today (lane 2)\n\n${future.map(e => `- ${e.loc.replace(base, '')}: ${e.lastmod}`).join('\n') || 'None.'}\n\n## Perks counts (measure only)\n\n/perks ${perks.perksPage}; home ${perks.home}; llms.txt ${perks.llms} (${perks.llmsDirect} direct, ${perks.llmsPartner} partner referral). Member offers, /perks description then llms.txt: ${Object.entries(perks.offersPage).map(([k, v]) => `${k} ${v}/${perks.offersLlms[k]}`).join('; ')}. Consistent: ${yn(result.perksConsistent)}.\n\n## Known live issues\n\n| Issue | Owner | Status | Pages |\n| --- | --- | --- | --- |\n${issues.map(i => `| ${i.id} | ${i.owner} | ${i.status} | ${i.hits.join(', ')} |`).join('\n')}\n\n## Upcoming event schema (lane 2)\n\n| Page | endDate | organizer | contributor | isAccessibleForFree | priceCurrency | Credit line |\n| --- | --- | --- | --- | --- | --- | --- |\n${events.map(e => `| ${e.slug} | ${yn(e.endDate)} | ${yn(e.organizer)} | ${yn(e.contributor)} | ${e.isAccessibleForFree} | ${e.priceCurrency} | ${e.moderatedLine} |`).join('\n')}\n`;
  await writeFile(resolve(output, 'live-checks.md'), md);
  console.log(md);
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  await run(process.argv[2] ?? 'https://www.balistartupandtech.com', resolve(process.argv[3] ?? `${homedir()}/orca/evidence/bstc/health-${witaDate()}`));
}
