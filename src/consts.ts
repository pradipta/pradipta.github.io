export const SITE_TITLE = "Pradipta Sarma";
export const SITE_DESCRIPTION =
  "Software engineer writing about Java, developer tooling, terminals, and building things that last.";
export const SITE_URL = "https://pradipta.github.io";

export const AUTHOR = {
  name: "Pradipta Sarma",
  role: "Senior Software Engineer",
  tagline: "Distributed systems & backend",
  bio: "Senior Software Engineer, currently at Uber. Focused on distributed systems, backend software engineering, Java, and AWS.",
  avatar: "/assets/img/pradipta.jpg",
  twitter: "sarmapradipta",
  github: "pradipta",
  linkedin: "pradiptasarma",
} as const;

import { projects } from "./data/projects";

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/blog/", label: "Blog" },
  ...(projects.length > 0 ? [{ href: "/projects/", label: "Projects" }] : []),
  { href: "/about/", label: "About" },
] as const;
