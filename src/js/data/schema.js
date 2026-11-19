import { check as c } from '../utils/validate.js';

const link = c.obj({ label: c.str(1, 40), href: c.url() });

/** Photo must be a local image inside assets/ so nothing external is ever loaded. */
const photo = (x, p) => {
  c.str(5, 80)(x, p);
  if (!/^\.\/assets\/[\w.-]+\.(jpe?g|png|webp|avif)$/i.test(x)) {
    throw new TypeError(`Invalid content at ${p}: expected ./assets/<file>.jpg|png|webp|avif`);
  }
  return x;
};

/** Web3Forms keys are UUIDs; an empty string means the form is not connected yet. */
const accessKey = (x, p) => {
  if (x !== '' && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(x)) {
    throw new TypeError(`Invalid content at ${p}: expected the Web3Forms access key (a UUID) or ''`);
  }
  return x;
};

export const schemas = {
  profile: c.obj({
    name: c.str(2, 60),
    role: c.str(2, 60),
    location: c.str(2, 60),
    email: c.email(),
    web3formsKey: accessKey,
    photo,
    headline: c.arr(c.str(1, 24), 1, 4),
    intro: c.str(20, 400),
    primaryCta: link,
    social: c.arr(link, 1, 6),
    approach: c.obj({ title: c.str(2, 80), paragraphs: c.arr(c.str(20, 500), 1, 4) }),
    stack: c.obj({ title: c.str(2, 80), intro: c.str(2, 200) }),
  }),
  projects: c.arr(
    c.obj({
      id: c.str(2, 40),
      title: c.str(1, 60),
      role: c.str(2, 80),
      summary: c.str(20, 400),
      tags: c.arr(c.str(1, 24), 1, 8),
      accent: c.hex(),
      href: c.optional(c.url()),
    }),
    1,
    12,
  ),
  stack: c.arr(c.obj({ group: c.str(2, 40), items: c.arr(c.str(2, 50), 1, 10) }), 1, 8),
  experience: c.arr(
    c.obj({
      role: c.str(2, 80),
      company: c.str(2, 80),
      period: c.str(2, 40),
      summary: c.str(10, 300),
      color: c.hex(),
    }),
    1,
    10,
  ),
};
