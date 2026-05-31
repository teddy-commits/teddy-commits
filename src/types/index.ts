export interface Project {
  title: string;
  desc: string;
  tech: string[];
  icon: string;
  category: 'web' | 'mobile' | 'design' | 'backend';
}

export interface Message {
  sender: string;
  text: string;
  timestamp: Date;
}

export interface Service {
  icon: string;
  title: string;
  description: string;
}

export interface SocialLink {
  icon: string;
  url: string;
  label: string;
}