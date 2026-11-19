/** Personal details, taken from the resume. Edit here to change the site. */
export const profile = {
  name: 'Aksha Thamke',
  role: 'Full-stack AI web developer',
  location: 'Pune, India',
  email: 'aksha.thamke.work@gmail.com',
  /**
   * Web3Forms access key (public by design). Create it at https://web3forms.com using
   * aksha.thamke.work@gmail.com, then paste the key from the email here.
   */
  web3formsKey: '',
  /** Drop your photo at src/assets/photo.jpg (3:4 portrait works best). */
  photo: './assets/photo.jpg',
  headline: ['Build AI', 'products that', 'ship.'],
  intro:
    'Three years at Tata Consultancy Services building AI-driven web applications: React and Node.js interfaces, Python services and LLM workflows that turn prototypes into tools teams rely on.',
  primaryCta: { label: 'See my work', href: '#work' },
  social: [{ label: 'LinkedIn', href: 'https://www.linkedin.com/in/aksha-thamke-2936bb200' }],
  approach: {
    title: 'Reliable by design.',
    paragraphs: [
      'I work across the whole stack, from the database schema to the dashboard, so the gaps where AI features usually fail get closed before users find them.',
      'At TCS I took an early prototype to a production tool used across internal testing teams, and built the LLM and validation logic behind it.',
    ],
  },
  stack: {
    title: 'From idea to production.',
    intro: 'One developer for the model, the API and the interface.',
  },
};
