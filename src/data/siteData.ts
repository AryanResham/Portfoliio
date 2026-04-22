// ─── All portfolio content lives here. Edit this one file to update the site. ───

export const profile = {
  name: "Aryan Reshamwala",
  initials: "A",
  tagline: "Hi, I'm <accent>Aryan</accent>.\nI build <verb>software</verb>\nmostly at night.",
  lede: "Third-year computer engineering student. I like reducing latency, automating tedious things out of existence, and shipping interfaces that feel inevitable.",
  status: "Available · 2027 grad",
  location: "Mumbai · IST +05:30",
  resumeUrl: "uploads/Aryan_Reshamwala_SDE.pdf",
  pfp: {
    role: "CE · KJSCE · 2027",
    meta: ["Mumbai", "9.89 CGPA", "SDE intern"],
  },
};

export type NavLink = { label: string; href: string };
export const navLinks: NavLink[] = [
  { label: "Intro", href: "#top" },
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Stack", href: "#stack" },
  { label: "Education", href: "#education" },
  { label: "Connect", href: "#contact" },
];

export const marqueeItems = [
  "Probably watching an F1 qualifying replay right now",
  "CGPA 9.89 — and annoyed about the 0.11",
  "Bakes when debugging gets heavy",
  "Chasing sub-50ms auction bids",
  "Reads more than he writes",
  "Mumbai → anywhere with good coffee",
];

export const typingPhrases = [
  "a nice little app",
  "an infinite coffee dispenser",
  "big muscles",
  "a cool portfolio???",
  "something at 2am, probably...",
];

export type NowItem = {
  icon: string;
  label: string;
  value: string;
  meta?: string;
  featured?: boolean;
  type?: "typing" | "countdown" | "default";
};

export const nowItems: NowItem[] = [
  {
    icon: "▶",
    label: "Currently building",
    value: "",
    featured: true,
    type: "typing",
  },
  {
    icon: "●",
    label: "Next F1 race",
    value: "Miami GP · Hard-Left at turn 17",
    type: "countdown",
  },
  {
    icon: "■",
    label: "Reading",
    value: "Feminist Literature",
    meta: "pg 214\nof 589",
  },
  {
    icon: "▲",
    label: "Baking",
    value: "Sourdough, attempt #7",
    meta: "rise\n4h 12m",
  },
];

export type Project = {
  num: string;
  slug: string;
  title: string;
  titleAccent: string;
  subtitle: string;
  description: string;
  stack: string[];
  status: string;
  size?: "lg";
  viz?: "auction" | "route" | "terminal";
};

export const projects: Project[] = [
  {
    num: "01",
    slug: "RelicQuest",
    title: "Relic",
    titleAccent: "Quest",
    subtitle: "A real-time collectibles auction platform",
    description:
      "Responsive React front-end, Redis-backed bidding core that absorbs the write storm at peak. Cron jobs drive auction lifecycle transitions; Supabase table publications push state to clients instantly. Built over a long few weeks — the kind where you forget what day it is.",
    stack: ["React", "Node.js", "PostgreSQL", "Redis", "Supabase"],
    status: "Live",
    size: "lg",
    viz: "auction",
  },
  {
    num: "02",
    slug: "RideMates",
    title: "Ride",
    titleAccent: "Mates",
    subtitle: "Carpooling for students tired of ₹400 Ubers",
    description:
      "Full-stack carpooling with auth, ride creation, booking, and location-based matching. Optimised for the 4G-to-WiFi handoff you get walking into campus.",
    stack: ["React", "Node.js", "MongoDB", "Firebase"],
    status: "Shipped",
    viz: "route",
  },
  {
    num: "03",
    slug: "Categorizer",
    title: "Bank Transaction ",
    titleAccent: "Categorizer",
    subtitle: "Reads messy bank PDFs, returns a clean CSV",
    description:
      "Python + Pandas pipeline that reads bank statement PDFs, normalises rows, and groups transactions by pattern. Small tool, real exercise in data cleaning and classification.",
    stack: ["Python", "Pandas", "pdfplumber", "pypdf"],
    status: "Learning",
    viz: "terminal",
  },
];

export type Experience = {
  period: string;
  role: string;
  company: string;
  tag: string;
  points: string[];
};

export const experiences: Experience[] = [
  {
    period: "Jun 2025 — Jul 2025",
    role: "Zoho Integration Intern",
    company: "MBM Newtech · Mumbai",
    tag: "Internship",
    points: [
      "Automated internal HR workflows with Zoho People — cut manual work by ~80%",
      "Worked across departments to turn vague processes into opinionated automations",
      "Built 4 custom apps in Zoho Creator, replacing years of Excel-based processes",
      "Wrote SOPs clear enough that a first-week hire could follow them without pinging anyone",
    ],
  },
  {
    period: "Dec 2024 — Jan 2025",
    role: "IXD Intern",
    company: "The Minimalist · Mumbai",
    tag: "Internship",
    points: [
      "Converted Figma mocks into responsive pages — HTML, CSS, JavaScript",
      "Built marketing e-mailers for clients; iterated on feedback from senior designers",
      "Sat between design and engineering, keeping implementation honest to the mocks",
    ],
  },
];

export type SkillGroup = { category: string; skills: string[] };
export const skillGroups: SkillGroup[] = [
  {
    category: "Languages",
    skills: ["Python", "JavaScript", "TypeScript", "C++", "SQL", "HTML", "CSS"],
  },
  {
    category: "Web & Backend",
    skills: [
      "React",
      "Node.js",
      "Express",
      "Flask",
      "MongoDB",
      "Redis",
      "PostgreSQL",
      "Supabase",
    ],
  },
  {
    category: "Tools & Data",
    skills: [
      "Git",
      "Pandas",
      "NumPy",
      "Matplotlib",
      "Firebase",
      "Zoho Creator",
      "Deluge",
    ],
  },
];

export const education = {
  school: "KJ Somaiya College of Engineering",
  degree: "B.Tech · Computer Engineering",
  period: "Jul 2023 — Aug 2027 (expected)",
  cgpa: "9.89",
  courses: ["Data Analysis", "Probability", "Discrete Maths", "Statistics"],
};

export const aboutParagraphs = [
  `I'm a Computer Engineering student who loves building things that are fast, scalable, and built to last. I recently spent months deep in WebSockets, Redis, and advanced Postgres just to understand how to handle high-concurrency data in real time — and I genuinely enjoyed every minute of it.`,
  `Right now my focus sits at the intersection of <accent>system design and Gen AI</accent>. I care about the unglamorous parts — caching layers, queue workers, the small functions that keep big systems quiet — and I care just as much about what it feels like on the other side of the screen. Soft edges. Sensible defaults. No surprises at the bottom.`,
  `I'm looking for a fast-paced engineering culture that values clean code and strong architecture — a place where I can learn rigorous standards from people who know more than I do, and contribute to software that solves real problems from day one.`,
  `When I'm not at my keyboard you'll find me analysing F1 aerodynamics, reading something a little too long, cooking or baking my way through a stubborn recipe, or halfway through a show I was supposed to finish last week.`,
];

export type AboutCard = {
  label: string;
  value: string;
  sub?: string;
  big?: boolean;
  extra?: string;
};

export const aboutCards: AboutCard[] = [
  { label: "Based in", value: "Mumbai", big: true, extra: "IST +05:30" },
  {
    label: "Currently",
    value: "Open to internships",
    sub: "SDE · full-stack · backend",
  },
  {
    label: "Outside code",
    value: "F1, cars, cooking, baking, shows",
    sub: "And reading more than I write",
  },
];

export type ContactLink = {
  label: string;
  value: string;
  href: string;
};

export const contactLinks: ContactLink[] = [
  {
    label: "Email",
    value: "aryan.resham@gmail.com",
    href: "mailto:aryan.resham@gmail.com",
  },
  {
    label: "Phone",
    value: "+91 8691 074 005",
    href: "tel:+918691074005",
  },
  {
    label: "LinkedIn",
    value: "aryan-resham",
    href: "https://linkedin.com/in/aryan-resham",
  },
  {
    label: "GitHub",
    value: "AryanResham",
    href: "https://github.com/AryanResham",
  },
];
