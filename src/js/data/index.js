import { deepFreeze } from '../utils/validate.js';
import { schemas } from './schema.js';
import { profile } from './profile.js';
import { projects } from './projects.js';
import { stack } from './stack.js';
import { experience } from './experience.js';

/**
 * Single entry point for site content. Every dataset is validated against its
 * schema and frozen, so a typo or unsafe URL fails loudly instead of rendering.
 */
export function loadContent() {
  const raw = { profile, projects, stack, experience };
  for (const [name, value] of Object.entries(raw)) schemas[name](value, name);
  return deepFreeze(structuredClone(raw));
}

