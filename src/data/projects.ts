export type Project = {
  title: string;
  description: string;
  href?: string;
  tags: string[];
  year?: string;
};

export const projects: Project[] = [
  {
    title: "Personal Tech Blog",
    description:
      "This site — notes on Java, Git, developer tooling, and workstation setups, rebuilt in Astro for speed and clarity.",
    href: "/blog/",
    tags: ["Astro", "TypeScript", "Writing"],
    year: "2020–present",
  },
  {
    title: "Flipkart — Fintech & Payments",
    description:
      "SDE 2 work on Buy Now Pay Later within Flipkart’s Fintech and Payments group.",
    href: "/career-update-april-2021/",
    tags: ["Java", "Payments", "Fintech"],
    year: "2021",
  },
  {
    title: "Slackbot with Hubot",
    description:
      "Workplace automation and fun scripts built on Hubot for Slack, covering generators, custom CoffeeScript/JS modules, and integrations.",
    href: "/build-a-salckbot-using-hubot/",
    tags: ["Hubot", "Slack", "Node.js"],
    year: "2020",
  },
  {
    title: "MongoDB Migrations with Mongock",
    description:
      "Practical guide and patterns for schema/data migrations on MongoDB using Mongock in Spring Boot Java services.",
    href: "/mongock-java-mongodb/",
    tags: ["Java", "MongoDB", "Spring"],
    year: "2020",
  },
];
