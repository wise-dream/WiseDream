import type { AppConfig } from '../entities/types'

export const APP_CONFIG: AppConfig = {
  name: 'WiseDream Portfolio',
  version: '1.0.0',
  description: 'Personal portfolio website built with Nuxt 4'
}

export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  PROJECTS: '/projects',
  CONTACT: '/contact'
} as const

export const SOCIAL_LINKS = {
  GITHUB: 'https://github.com/WiseDream',
  LINKEDIN: 'https://linkedin.com/in/wisedream',
  TELEGRAM: 'https://t.me/wisedream'
} as const

export const TECHNOLOGIES = {
  FRONTEND: ['Vue.js', 'Nuxt', 'TypeScript', 'Tailwind CSS'],
  BACKEND: ['Node.js', 'Express', 'PostgreSQL', 'MongoDB'],
  DEVOPS: ['Docker', 'AWS', 'CI/CD', 'Nginx'],
  DESIGN: ['Figma', 'Adobe XD', 'Photoshop']
} as const
