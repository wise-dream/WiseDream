import { describe, expect, it } from 'vitest';
import { APP_CONFIG, ROUTES, SOCIAL_LINKS, TECHNOLOGIES } from '@/utils/constants';

describe('Constants', () => {
  describe('APP_CONFIG', () => {
    it('should have correct structure', () => {
      expect(APP_CONFIG).toHaveProperty('name');
      expect(APP_CONFIG).toHaveProperty('version');
      expect(APP_CONFIG).toHaveProperty('description');
    });

    it('should have correct values', () => {
      expect(APP_CONFIG.name).toBe('WiseDream Portfolio');
      expect(APP_CONFIG.version).toBe('1.0.0');
      expect(APP_CONFIG.description).toBe('Personal portfolio website built with Nuxt 4');
    });

    it('should have string values', () => {
      expect(typeof APP_CONFIG.name).toBe('string');
      expect(typeof APP_CONFIG.version).toBe('string');
      expect(typeof APP_CONFIG.description).toBe('string');
    });
  });

  describe('ROUTES', () => {
    it('should have all required routes', () => {
      expect(ROUTES).toHaveProperty('HOME');
      expect(ROUTES).toHaveProperty('ABOUT');
      expect(ROUTES).toHaveProperty('PROJECTS');
      expect(ROUTES).toHaveProperty('CONTACT');
    });

    it('should have correct route values', () => {
      expect(ROUTES.HOME).toBe('/');
      expect(ROUTES.ABOUT).toBe('/about');
      expect(ROUTES.PROJECTS).toBe('/projects');
      expect(ROUTES.CONTACT).toBe('/contact');
    });

    it('should have correct types', () => {
      expect(typeof ROUTES.HOME).toBe('string');
      expect(typeof ROUTES.ABOUT).toBe('string');
      expect(typeof ROUTES.PROJECTS).toBe('string');
      expect(typeof ROUTES.CONTACT).toBe('string');
    });
  });

  describe('SOCIAL_LINKS', () => {
    it('should have all social platforms', () => {
      expect(SOCIAL_LINKS).toHaveProperty('GITHUB');
      expect(SOCIAL_LINKS).toHaveProperty('LINKEDIN');
      expect(SOCIAL_LINKS).toHaveProperty('TELEGRAM');
    });

    it('should have valid URLs', () => {
      expect(SOCIAL_LINKS.GITHUB).toMatch(/^https:\/\/github\.com\//);
      expect(SOCIAL_LINKS.LINKEDIN).toMatch(/^https:\/\/linkedin\.com\//);
      expect(SOCIAL_LINKS.TELEGRAM).toMatch(/^https:\/\/t\.me\//);
    });

    it('should have correct types', () => {
      expect(typeof SOCIAL_LINKS.GITHUB).toBe('string');
      expect(typeof SOCIAL_LINKS.LINKEDIN).toBe('string');
      expect(typeof SOCIAL_LINKS.TELEGRAM).toBe('string');
    });
  });

  describe('TECHNOLOGIES', () => {
    it('should have all technology categories', () => {
      expect(TECHNOLOGIES).toHaveProperty('FRONTEND');
      expect(TECHNOLOGIES).toHaveProperty('BACKEND');
      expect(TECHNOLOGIES).toHaveProperty('DEVOPS');
      expect(TECHNOLOGIES).toHaveProperty('DESIGN');
    });

    it('should have arrays of technologies', () => {
      expect(Array.isArray(TECHNOLOGIES.FRONTEND)).toBe(true);
      expect(Array.isArray(TECHNOLOGIES.BACKEND)).toBe(true);
      expect(Array.isArray(TECHNOLOGIES.DEVOPS)).toBe(true);
      expect(Array.isArray(TECHNOLOGIES.DESIGN)).toBe(true);
    });

    it('should have non-empty arrays', () => {
      expect(TECHNOLOGIES.FRONTEND.length).toBeGreaterThan(0);
      expect(TECHNOLOGIES.BACKEND.length).toBeGreaterThan(0);
      expect(TECHNOLOGIES.DEVOPS.length).toBeGreaterThan(0);
      expect(TECHNOLOGIES.DESIGN.length).toBeGreaterThan(0);
    });

    it('should contain expected technologies', () => {
      expect(TECHNOLOGIES.FRONTEND).toContain('Vue.js');
      expect(TECHNOLOGIES.FRONTEND).toContain('TypeScript');
      expect(TECHNOLOGIES.BACKEND).toContain('Node.js');
      expect(TECHNOLOGIES.DEVOPS).toContain('Docker');
    });

    it('should have correct array types', () => {
      expect(Array.isArray(TECHNOLOGIES.FRONTEND)).toBe(true);
      expect(Array.isArray(TECHNOLOGIES.BACKEND)).toBe(true);
      expect(Array.isArray(TECHNOLOGIES.DEVOPS)).toBe(true);
      expect(Array.isArray(TECHNOLOGIES.DESIGN)).toBe(true);
    });
  });
});
