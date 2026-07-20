export type Expertise = {
  title: string;
  description: string;
};

export type Role = {
  team: string;
  title?: string;
  dates?: string;
  highlights?: string[];
};

export type Job = {
  company: string;
  /** Single-team roles use team/title/dates/highlights at this level. */
  team?: string;
  title?: string;
  dates?: string;
  highlights?: string[];
  /** Multi-team companies nest roles under the company. */
  roles?: Role[];
};

export type OpenSourceItem = {
  name: string;
  href: string;
  role: string;
  description: string;
};

export function jobSlug(job: Job, role?: Role): string {
  const parts = [job.company, role?.team ?? job.team].filter(Boolean);
  return parts
    .join("-")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const careerSummary =
  "Senior Software Engineer, currently at Uber. Focused on distributed systems, backend software engineering, Java, and AWS.";

export const careerLocation = "Bangalore, KA";

export const expertise: Expertise[] = [
  {
    title: "Distributed Systems & Architecture",
    description:
      "Designing and operating scalable, fault-tolerant backend systems",
  },
  {
    title: "Backend & API Platforms",
    description:
      "Building reliable services and APIs that are easy to operate and maintain",
  },
  {
    title: "Cloud Infrastructure",
    description:
      "Deep experience with AWS services and cloud-native systems",
  },
  {
    title: "Developer Experience",
    description:
      "Improving tooling, workflows, and the day-to-day of shipping software",
  },
];

export const experience: Job[] = [
  {
    company: "Uber",
    team: "U4B",
    title: "Senior Software Engineer",
    dates: "Mar 2026 – Present",
  },
  {
    company: "Amazon",
    title: "SDE II",
    dates: "Aug 2022 – Feb 2026",
    highlights: [
      "Contributed to Diya, Amazon’s internal AI assistant serving ~75K daily active users, and to cross-team fraud detection systems.",
    ],
    roles: [
      {
        team: "AWS OpenSearch",
        dates: "Jan 2025 – Feb 2026",
        highlights: [
          "Designed the core architecture of Cluster Insights, a platform that generates health diagnostics, mitigation signals, and operational recommendations for large-scale OpenSearch clusters.",
          "Built distributed insight pipelines that combine telemetry, metadata, and system signals to drive automated remediation.",
          "Led the NotificationService migration from JDK 8 to JDK 21, improving performance and runtime efficiency.",
        ],
      },
      {
        team: "Amazon Pay · Merchant Onboarding",
        dates: "Aug 2022 – Dec 2024",
        highlights: [
          "Designed a Risk Prevention evaluation platform for merchant onboarding within Amazon Pay’s ML infrastructure.",
          "Built secure KYC document ingestion and a Domain Validation Service for merchant verification and fraud detection in the US region.",
          "Reduced critical platform load time from ~50s to ~2s, improving operational efficiency and cutting support load.",
          "Enabled recurring payments in the next-generation Amazon Pay architecture.",
        ],
      },
    ],
  },
  {
    company: "Flipkart",
    team: "Consumer Finance · Lending",
    title: "SDE II",
    dates: "Apr 2021 – Aug 2022",
    highlights: [
      "Designed and implemented a multi-tenant billing platform with full data migration and rollback safety.",
      "Built scalable relaying infrastructure that reduced platform costs by 75%.",
      "Cut homepage API latency from ~1s to ~50ms through architecture redesign and database optimization.",
    ],
  },
  {
    company: "upGrad",
    team: "Payments / Growth",
    title: "SE II",
    dates: "Jan 2020 – Apr 2021",
    highlights: [
      "Built payments and invoicing backend services.",
      "Designed an Automated Program Launcher that reduced launch time from 10 days to 2 days.",
      "Built a Form Service that cut creation time from days to hours, with deployment automation that improved release safety.",
    ],
  },
];

export const skills = [
  "Java",
  "Spring",
  "AWS",
  "Kinesis",
  "Golang",
  "Kafka",
  "RDS",
  "DDB",
  "OpenSearch",
  "Docker",
] as const;

export const openSource: OpenSourceItem[] = [
  {
    name: "dloom",
    href: "https://github.com/dloomorg/dloom",
    role: "Maintainer",
    description:
      "Open-source home directory manager — an alternative approach to GNU Stow for managing dotfiles and configurations.",
  },
  {
    name: "endoflife.date",
    href: "https://github.com/endoflife-date/endoflife.date",
    role: "Contributor",
    description:
      "Community-maintained product end-of-life and support timelines for software and devices.",
  },
];

export const awayFromKeyboard =
  "Away from the keyboard: photography, bass, and games.";
