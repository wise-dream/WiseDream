// Application types
export interface AppConfig {
  name: string;
  version: string;
  description: string;
}

// Route types
export interface AppRoute {
  name: string;
  path: string;
  component: string;
  meta?: {
    title?: string;
    description?: string;
    requiresAuth?: boolean;
  };
}

// Notification types
export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

// Portfolio types
export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  link?: string;
  github?: string;
}

export interface Skill {
  name: string;
  level: number; // 1-100
  category: 'frontend' | 'backend' | 'devops' | 'design';
}

export interface Contact {
  email: string;
  linkedin?: string;
  github?: string;
  telegram?: string;
}
