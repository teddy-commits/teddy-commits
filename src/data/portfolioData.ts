import type{ Project, Service, SocialLink } from '../types';

export const projectsData: Project[] = [
  {
    title: "AI TaskFlow",
    desc: "Full-stack task manager with AI suggestions, realtime sync, and microservices backend. Complex role-based system.",
    tech: ["React", "Node.js", "MongoDB", "Redis", "Docker"],
    icon: "fa-brain",
    category: "web"
  },
  {
    title: "UrbanEats Mobile",
    desc: "Cross-platform food delivery app with offline mode, realtime order tracking, push notifications and payment gateway.",
    tech: ["Flutter", "Firebase", "Stripe", "GraphQL"],
    icon: "fa-mobile-alt",
    category: "mobile"
  },
  {
    title: "Creative Studio Branding",
    desc: "Complete visual identity + UI/UX design & custom illustration set for a creative agency. Also built a showcase website.",
    tech: ["Figma", "Illustrator", "GSAP", "Tailwind"],
    icon: "fa-paintbrush-fine",
    category: "design"
  },
  {
    title: "Enterprise Dashboard",
    desc: "Complex backend admin panel with analytics, role permissions, realtime websockets, and scalable cloud deployment.",
    tech: ["Next.js", "FastAPI", "PostgreSQL", "AWS"],
    icon: "fa-chart-line",
    category: "web"
  },
  {
    title: "Portfolio 3D Experience",
    desc: "Interactive 3D graphics + design system for creative showcase (WebGL + modern frontend)",
    tech: ["Three.js", "Blender", "React", "CSS Grid"],
    icon: "fa-cube",
    category: "design"
  },
  {
    title: "Mobile Up: EventHub",
    desc: "Event management app with ticket scanning, social features, and realtime chat (iOS & Android).",
    tech: ["React Native", "Socket.io", "Node.js", "MongoDB"],
    icon: "fa-calendar-alt",
    category: "mobile"
  }
];

export const servicesData: Service[] = [
  {
    icon: "fa-globe",
    title: "Web Apps & Backend",
    description: "Full-stack development, REST APIs, realtime features, databases, complex microservices and cloud infrastructure."
  },
  {
    icon: "fa-mobile-alt",
    title: "Mobile Applications",
    description: "Cross-platform apps (React Native / Flutter) with smooth UX, offline support, and native capabilities. iOS + Android."
  },
  {
    icon: "fa-palette",
    title: "Graphics Designer",
    description: "Brand identity, UI/UX, custom illustrations, modern visual storytelling that elevates digital products."
  }
];

export const socialLinks: SocialLink[] = [
  { icon: "fa-github", url: "https://github.com/yourusername", label: "GitHub" },
  { icon: "fa-linkedin-in", url: "https://linkedin.com/in/yourusername", label: "LinkedIn" },
  { icon: "fa-twitter", url: "https://twitter.com/yourusername", label: "Twitter" },
  { icon: "fa-behance", url: "https://behance.net/yourusername", label: "Behance" }
];