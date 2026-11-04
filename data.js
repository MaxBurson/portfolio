/*
  ─────────────────────────────────────────────────────────────
  YOUR CONTENT LIVES HERE.
  Edit this file, save, and refresh the browser. Nothing else to touch.

  Formatting tips:
  • Wrap a word in *asterisks* to set it in the italic serif accent font.
  • "colors" are the three colours used to paint a project's cover art
    when there's no image. Set "image" to a path like "images/foo.jpg"
    (put the file in the /images folder) to use a real screenshot instead.
  ─────────────────────────────────────────────────────────────
*/
window.PORTFOLIO = {
  name: "Maxwell Burson",
  initials: "MB",
  role: "Developer",
  location: "London",
  locationShort: "LDN",
  timezone: "Europe/London", // IANA zone for the live clock, or "" for the visitor's own time
  email: "", // leave blank to hide email everywhere
  resume: "", // e.g. "resume.pdf" (put the file in this folder) — leave blank to hide

  hero: {
    first: "Maxwell",
    last: "Burson",
    // Small italic aside that sits beside the surname
    aside: ["Developer &", "CS graduate, *ldn*"],
    kicker: "Portfolio — 2026",
    course: "BSc Computer Science · Sussex",
    intro:
      "I'm a 21-year-old developer in London. I graduated from the University of Sussex with a First in Computer Science, and I like building software that's clean, considered and a little bit playful.",
    facts: [
      { label: "Age", value: "21" },
      { label: "Degree", value: "BSc CS, First" },
      { label: "Based", value: "London" },
    ],
  },

  marquee: ["Interface Design", "Front-end", "Creative Coding", "Game Mods", "Motion", "Java", "TypeScript", "Prototyping"],

  projects: [
    {
      title: "Oath — AI Accountability",
      description: "An iOS habit tracker you can't fool. Commit to a habit, then prove it with a live photo that AI checks. Live on the App Store.",
      tags: ["Swift", "SwiftUI", "Supabase", "AI vision"],
      year: "2026",
      link: "oath/", // the case study page
      cta: "View",
      colors: ["#34c759", "#0f5a33", "#060a07"],
      phone: "oath/media/oaths-dark.webp", // screenshot shown inside a phone on the cover
    },
  ],

  about: {
    portrait: "", // e.g. "images/me.jpg"
    statement:
      "I like building things that feel *obvious* in hindsight: tools that get out of the way, games that teach without lecturing and interfaces with a little *personality*.",
    paragraphs: [
      "I'm Maxwell, a developer based in London. I recently finished a BSc in Computer Science at the University of Sussex, graduating with First Class Honours.",
      "Outside of code: hobbies, languages you're learning, the games you play, whatever makes you you. (Edit this in data.js.)",
    ],
    stats: [
      { value: 21, suffix: "", label: "Years old" },
      { value: 1, suffix: "st", label: "Class honours" },
      { value: 3, suffix: "", label: "Years at Sussex" },
    ],
    skills: [
      { group: "Languages", items: ["Java", "TypeScript", "Python", "HTML & CSS"] },
      { group: "Tools", items: ["Figma", "Git", "VS Code", "Blender"] },
      { group: "Focus", items: ["UI / UX", "Motion", "Game mods", "Prototyping"] },
    ],
  },

  experience: [
    {
      period: "2025 — Now",
      role: "Your Role",
      company: "Company Name",
      location: "City / Remote",
      summary: "One or two sentences on what you do there and the impact you've had.",
      highlights: ["A concrete achievement with a number if you have one", "Something you built or led", "A skill you grew"],
      tags: ["TypeScript", "Design systems"],
    },
    {
      period: "2023 — 2025",
      role: "Previous Role",
      company: "Another Company",
      location: "City",
      summary: "What you worked on and what you learned.",
      highlights: ["Highlight one", "Highlight two"],
      tags: ["Java", "Product"],
    },
    {
      period: "2022 — 2025",
      role: "BSc Computer Science",
      company: "University of Sussex",
      location: "Brighton",
      summary: "Graduated with First Class Honours.",
      highlights: ["Final-year project: add yours here", "Modules, societies or awards worth mentioning"],
      tags: ["First Class"],
    },
  ],

  // Links shown at the bottom of the page. Leave a url blank ("") to hide that link.
  socials: [
    { label: "GitHub", url: "https://github.com/MaxBurson" },
    { label: "LinkedIn", url: "https://www.linkedin.com/in/maxwellgeorge1/" },
    { label: "X / Twitter", url: "https://x.com/maxbts_" },
  ],
};
