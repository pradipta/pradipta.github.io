export const SITE_TITLE = "Pradipta Sarma";
export const SITE_DESCRIPTION =
  "Software engineer writing about Java, developer tooling, terminals, and building things that last.";
export const SITE_URL = "https://pradipta.github.io";

export const AUTHOR = {
  name: "Pradipta Sarma",
  role: "Software Engineer",
  tagline: "UX Enthusiast",
  bio: "Software engineer with a passion for building reliable backend systems, designing scalable architectures, and creating software that's easy to operate and maintain. I enjoy solving distributed systems problems, improving developer experience, and exploring the technologies that power modern applications.",
  avatar: "/assets/img/pradipta.jpg",
  email: "pradiptasarma@outlook.com",
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
