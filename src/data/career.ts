export type Expertise = {
  title: string;
  description: string;
};

export type Job = {
  company: string;
  team: string;
  title?: string;
  dates?: string;
  highlights?: string[];
};

export type OpenSourceItem = {
  name: string;
  href: string;
  role: string;
  description: string;
};

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
    team: "AWS OpenSearch",
    dates: "Dec 2024 – Feb 2026",
  },
  {
    company: "Amazon",
    team: "Pay",
    dates: "Aug 2022 – Aug 2024",
  },
  {
    company: "Flipkart",
    team: "Fintech / Payments",
    title: "SDE 2",
    dates: "Apr 2021 – Aug 2022",
  },
  {
    company: "upGrad",
    team: "Growth & Payments",
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
