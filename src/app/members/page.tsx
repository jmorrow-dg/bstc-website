import type { Metadata } from "next";
import Link from "next/link";
import { getBreadcrumbSchema } from "@/lib/schema";
import {
  MIN_INDEXABLE_MEMBERS,
  RB_DIRECTORY_URL,
  getBaliMembers,
  type BaliMember,
} from "@/lib/rb-directory";

// The member list comes from the Remote Builders directory feed; refresh daily.
export const revalidate = 86400;

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function joinedLabel(joined: string) {
  const [y, m] = joined.split("-").map(Number);
  return y && m ? `Joined ${MONTHS[m - 1]} ${y}` : "";
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

export async function generateMetadata(): Promise<Metadata> {
  const { members } = await getBaliMembers();
  const indexable = members.length >= MIN_INDEXABLE_MEMBERS;
  return {
    title: "Bali members: who you'll meet at the dinners",
    description:
      "Founders, entrepreneurs and remote builders in the Bali Startup & Tech community, based in Canggu, Ubud, Uluwatu and across Bali. Each links to their member profile.",
    alternates: { canonical: "/members" },
    // A short list stays out of search until it's worth finding.
    robots: indexable ? { index: true, follow: true } : { index: false, follow: true },
  };
}

function MemberCard({ member }: { member: BaliMember }) {
  return (
    <li className="gl-player">
      {member.photoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element -- remote directory photo, sized by CSS
        <img className="gl-mem-photo" src={member.photoUrl} alt="" width={88} height={88} loading="lazy" />
      ) : (
        <span className="gl-initials" aria-hidden="true">
          {initials(member.displayName)}
        </span>
      )}
      {member.industry && <span className="gl-tier">{member.industry}</span>}
      <h3>{member.displayName}</h3>
      {member.business && member.business !== member.displayName && (
        <p className="gl-role">{member.business}</p>
      )}
      <div className="gl-p-city">
        <span>{member.city}</span>
        {member.joined && <span>{joinedLabel(member.joined)}</span>}
      </div>
      {member.oneLiner && <p className="gl-bio">{member.oneLiner}</p>}
      <p className="gl-p-links">
        <a href={member.profileUrl} aria-label={`${member.displayName}'s member profile`}>
          Member profile
        </a>
      </p>
    </li>
  );
}

export default async function MembersPage() {
  const { ok, members } = await getBaliMembers();
  const breadcrumb = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Members", url: "/members" },
  ]);

  return (
    <div className="gl-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <section className="gl-head gl-on-red" aria-labelledby="page-title">
        <div className="gl-wrap">
          <div className="gl-head-copy">
            <p className="gl-est">Bali members</p>
            <h1 id="page-title">Who you&apos;ll meet at the dinners</h1>
            <p className="gl-lede">
              Bali Startup &amp; Tech is the community for founders, entrepreneurs
              and remote builders in Bali. These are members based here, from
              Canggu to Ubud and Uluwatu. Each card opens their profile in the
              member directory, which follows them wherever they build from next.
            </p>
            <div className="gl-head-ctas">
              <Link className="gl-btn gl-btn-paper" href="/join?src=members-head">
                Join and get your profile
              </Link>
              <a className="gl-link" href={RB_DIRECTORY_URL}>
                See the full member directory
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="gl-sec gl-members gl-on-navy" aria-labelledby="mem-title">
        <div className="gl-wrap">
          <div className="gl-sec-head">
            <h2 id="mem-title">
              {members.length > 0
                ? `${members.length} ${members.length === 1 ? "member" : "members"} in Bali`
                : "Members in Bali"}
            </h2>
            <p>
              {members.length > 0
                ? "Newest first. Members choose what their profile shows."
                : ok
                  ? "The first Bali profiles are going up now. Join and yours can be one of them."
                  : "We couldn't load the member list just now. The full directory is on Remote Builders."}
            </p>
          </div>

          {members.length > 0 && (
            <ul className="gl-squad">
              {members.map((m) => (
                <MemberCard member={m} key={m.slug || m.profileUrl} />
              ))}
            </ul>
          )}

          <div className="gl-spot">
            <div>
              <h3>Your spot in Members</h3>
              <p>
                Join and you get your own page in the member directory: your photo,
                your company, what you&apos;re building and a link to your site.
                Bali members show up here too.
              </p>
            </div>
            <div className="gl-spot-actions">
              <Link className="gl-btn gl-btn-paper" href="/join?src=members-spot">
                Join and get your page
              </Link>
              <a className="gl-link" href={RB_DIRECTORY_URL}>
                See the member directory
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
