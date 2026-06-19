// ─── All portfolio content lives here. Edit this one file to update the site. ───

export const profile = {
  name: "Aryan Reshamwala",
  initials: "A",
  tagline: "Hi, I'm <accent>Aryan</accent>.\nWelcome to my very <accent>un</accent>serious website.",
  lede: "Third-year computer engineering student. I like building cool stuff. I also love like food and beer and coffee and cool expensive shit",
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
  "Probably watching a dumb movie",
  "CGPA 9.89 — and annoyed about the 0.11",
  "",
  "Reads more than he writes",
  "Mumbai → anywhere with good coffee",
  "Vibes == Coded"
];

export const typingPhrases = [
  "a nice little app",
  "an infinite coffee dispenser",
  "big muscles",
  "a cool portfolio???",
  "something at 2am, probably...",
  "multi-million dollar start-up?",
  "new beer flavours"
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
    icon: "",
    label: "Currently building",
    value: "",
    featured: true,
    type: "typing",
  },
  {
    icon: "",
    label: "Next F1 race",
    value: "Miami GP · Hard-Left at turn 17",
    type: "countdown",
  },
  {
    icon: "",
    label: "Reading",
    value: " <big impressive book>",
    meta: "pg 42\nof 100",
  },
  {
    icon: "",
    label: "Baking",
    value: "BREAD!!",
    meta: "rise\n4h 20m",
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
    period: "May 2026 — Present",
    role: "Automation Intern",
    company: "GlobalGyan · Mumbai",
    tag: "Internship",
    points: [
      "Integrating a Learning Record Store (LRS) and user tracking system into GyanCompass to monitor user progress.",
      "Designed and deployed n8n workflows to automate manual processes and speed up routine tasks.",
      "Built an internal management dashboard to give a clear and automated view to track revenue and other company performance metrics.",
      "Standardized team task management by configuring and customizing Zoho Projects."      
    ],
  },
  {
    period: "Jun 2025 — Jul 2025",
    role: "Zoho Integration Intern",
    company: "MBM Newtech · Mumbai",
    tag: "Internship",
    points: [
      "Automated internal HR workflows with Zoho People — cut manual work by ~80%.",
      "Worked across departments to turn vague processes into opinionated automations.",
      "Built 4 custom apps in Zoho Creator, replacing years of Excel-based processes.",
      "Wrote SOPs clear enough that a first-week hire could follow them without pinging anyone.",
    ],
  },
  {
    period: "Dec 2024 — Jan 2025",
    role: "IXD Intern",
    company: "The Minimalist · Mumbai",
    tag: "Internship",
    points: [
      "Converted Figma designs into responsive pages using HTML, CSS, JavaScript.",
      "Developed e-mailers for client marketing campaigns; iterated on feedback from senior designers.",
      "Worked with the design department to ensure consistency between UI designs and final implementations.",
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
  `I'm a Computer Engineering student who loves to build things. I enjoy learning about the whys and hows of things and their inner workings. I also enjoy building things that have a real applicaiton, solve a pain point or are just objectively cool or fun.`,
  `Right now I am getting into <accent>System Design and Gen AI</accent>. I am learning about what it is, how it works, and how I can create something meaningful with it. I am still exploring new domains and tools and things and tech, trying to find what really excites me.`,
  `I'd like to work in a place where I can learn from experienced devs, while making actual meaningful contributions and growing as an engineer.`,
  `When I'm not at my keyboard you'll find me playing games, watching movies, reading, cooking or baking my way through a recipe.`,
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
    value: "Open to internships and full-time roles",
    sub: "SDE · full-stack · backend",
  },
  {
    label: "Outside code",
    value: "Movies, Games, TV Shows, Baking, Cooking, F1",
    sub: "and other fun stuff",
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
