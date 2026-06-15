// src/utils/storage.js

export const SEED_TESTIMONIALS = [
  {
    id: "t1",
    name: "Théodore Mfou",
    role: "Mason, Douala",
    text: "I applied through this platform and was contacted within 2 days. I've been working on a great project for 5 months now. The process was simple and professional.",
    initials: "TM",
  },
  {
    id: "t2",
    name: "Bernadette Nguele",
    role: "Concrete Finisher, Yaoundé",
    text: "I had been looking for work for months. This agency helped me find a stable job close to home in less than a week. I am very grateful.",
    initials: "BN",
  },
  {
    id: "t3",
    name: "Paul Essama",
    role: "Site Foreman, Bafoussam",
    text: "Professional, fast, and honest. They kept me informed at every step. I have already referred three of my colleagues.",
    initials: "PE",
  },
];

// Fallback checking helper for app navigation routers if needed
export function isLoggedIn() { 
  return localStorage.getItem("crw_logged") === "true"; 
}