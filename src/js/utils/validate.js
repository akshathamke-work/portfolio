/**
 * Validation helpers used for (a) the static content in /data and
 * (b) the contact form. Nothing is trusted: every value is type-checked,
 * length-limited and stripped of control characters before it reaches the DOM.
 */
const CONTROL_TEST = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/;
const CONTROL_ALL = new RegExp(CONTROL_TEST.source, 'g');
const EMAIL = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[A-Za-z]{2,}$/;
const HEX = /^#[0-9a-f]{6}$/i;

export const stripControl = (value) => String(value).replace(CONTROL_ALL, '');

/** Only https:, mailto: and plain #anchors may ever become a link target. */
export function isSafeUrl(value) {
  if (typeof value !== 'string' || value.length > 300) return false;
  if (value.startsWith('#')) return /^#[\w-]*$/.test(value);
  try {
    const { protocol } = new URL(value);
    return protocol === 'https:' || protocol === 'mailto:';
  } catch {
    return false;
  }
}

export function deepFreeze(value) {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.values(value).forEach(deepFreeze);
    Object.freeze(value);
  }
  return value;
}

const fail = (path, message) => {
  throw new TypeError(`Invalid content at ${path}: ${message}`);
};

/** Composable schema checks: each returns (value, path) => value or throws. */
export const check = {
  str: (min = 1, max = 200) => (x, p) => {
    if (typeof x !== 'string' || x.length < min || x.length > max || CONTROL_TEST.test(x)) {
      fail(p, `expected text of ${min}-${max} characters`);
    }
    return x;
  },
  url: () => (x, p) => {
    if (!isSafeUrl(x)) fail(p, 'expected an https:, mailto: or #anchor URL');
    return x;
  },
  email: () => (x, p) => {
    if (typeof x !== 'string' || x.length > 120 || !EMAIL.test(x)) fail(p, 'expected an email address');
    return x;
  },
  hex: () => (x, p) => {
    if (typeof x !== 'string' || !HEX.test(x)) fail(p, 'expected a #rrggbb colour');
    return x;
  },
  arr: (item, min = 0, max = 50) => (x, p) => {
    if (!Array.isArray(x) || x.length < min || x.length > max) fail(p, `expected ${min}-${max} items`);
    x.forEach((entry, i) => item(entry, `${p}[${i}]`));
    return x;
  },
  obj: (shape) => (x, p) => {
    if (!x || typeof x !== 'object' || Array.isArray(x)) fail(p, 'expected an object');
    Object.keys(x).forEach((key) => {
      if (!(key in shape)) fail(`${p}.${key}`, 'unexpected field');
    });
    Object.entries(shape).forEach(([key, fn]) => fn(x[key], `${p}.${key}`));
    return x;
  },
  optional: (fn) => (x, p) => (x === undefined ? x : fn(x, p)),
};

/** Contact form: returns sanitised values or a map of field errors. */
export const LIMITS = Object.freeze({ name: 80, email: 120, message: 1500 });

export function validateContact({ name = '', email = '', message = '' }) {
  const values = {
    name: stripControl(name).trim().replace(/\s+/g, ' '),
    email: stripControl(email).trim(),
    message: stripControl(message).replace(/\r\n/g, '\n').trim(),
  };
  const errors = {};
  if (values.name.length < 2 || values.name.length > LIMITS.name) {
    errors.name = `Enter your name (2-${LIMITS.name} characters).`;
  }
  if (values.email.length > LIMITS.email || !EMAIL.test(values.email)) {
    errors.email = 'Enter a valid email address, like name@example.com.';
  }
  if (values.message.length < 10 || values.message.length > LIMITS.message) {
    errors.message = `Write a message of 10-${LIMITS.message} characters.`;
  }
  return { ok: Object.keys(errors).length === 0, values, errors };
}
