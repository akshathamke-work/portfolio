import { h, externalLink } from '../utils/dom.js';
import { validateContact, LIMITS } from '../utils/validate.js';
import { sendMessage } from '../utils/contactApi.js';

const MIN_INTERVAL_MS = 4000;

function Field({ id, label, control }) {
  return h(
    'div',
    { class: 'field' },
    h('label', { for: id }, label),
    control,
    h('p', { class: 'field__error', id: `${id}-error`, role: 'alert' }),
  );
}

export function Contact(profile) {
  const name = h('input', { id: 'cf-name', name: 'name', type: 'text', autocomplete: 'name', maxlength: LIMITS.name, required: true, 'aria-describedby': 'cf-name-error' });
  const email = h('input', { id: 'cf-email', name: 'email', type: 'email', autocomplete: 'email', maxlength: LIMITS.email, required: true, 'aria-describedby': 'cf-email-error' });
  const message = h('textarea', { id: 'cf-message', name: 'message', rows: 6, maxlength: LIMITS.message, required: true, 'aria-describedby': 'cf-message-error' });
  // Honeypot: hidden from people, tempting to bots. Anything typed here is discarded.
  const trap = h('input', { class: 'trap', name: 'website', type: 'text', tabindex: '-1', autocomplete: 'off', 'aria-hidden': 'true' });
  const status = h('p', { class: 'form__status', role: 'status' });
  const send = h('button', { class: 'btn', type: 'submit' }, 'Send');
  const fields = { name, email, message };
  let lastSent = 0;

  const form = h(
    'form',
    { class: 'form', novalidate: true },
    Field({ id: 'cf-name', label: 'Name', control: name }),
    Field({ id: 'cf-email', label: 'Email', control: email }),
    Field({ id: 'cf-message', label: 'What are you building?', control: message }),
    trap,
    send,
    status,
  );

  const setStatus = (text, kind = '') => {
    status.textContent = text;
    status.dataset.kind = kind;
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (trap.value || send.disabled) return;

    const result = validateContact({ name: name.value, email: email.value, message: message.value });
    for (const [key, control] of Object.entries(fields)) {
      const error = result.errors[key] ?? '';
      form.querySelector(`#${control.id}-error`).textContent = error;
      control.setAttribute('aria-invalid', String(Boolean(error)));
    }
    if (!result.ok) {
      setStatus('Fix the highlighted fields and try again.', 'error');
      form.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }
    if (!profile.web3formsKey) {
      setStatus(`The form isn't connected yet. Please email ${profile.email} directly.`, 'error');
      return;
    }
    if (Date.now() - lastSent < MIN_INTERVAL_MS) return;

    send.disabled = true;
    send.textContent = 'Sending...';
    setStatus('');
    const { ok } = await sendMessage(profile.web3formsKey, result.values);
    send.disabled = false;
    send.textContent = 'Send';

    if (ok) {
      lastSent = Date.now();
      form.reset();
      setStatus('Thanks! Your message has been sent.', 'success');
    } else {
      setStatus(`Your message could not be sent. Please try again, or email ${profile.email}.`, 'error');
    }
  });

  return h(
    'section',
    { class: 'section section--center', id: 'contact', 'aria-labelledby': 'contact-title' },
    h(
      'div',
      { class: 'section__inner contact' },
      h('h2', { id: 'contact-title', class: 'heading heading--center', 'data-reveal': '' }, 'Have a product that needs AI?'),
      h('p', { class: 'lede lede--center', 'data-reveal': '', 'data-delay': '0.1' }, 'Tell me what you\u2019re building and I\u2019ll reply by email.'),
      h('div', { 'data-reveal': '', 'data-delay': '0.2' }, form),
      h('p', { class: 'contact__direct' }, 'Or write directly to ', externalLink(profile.email, `mailto:${profile.email}`, { class: 'text-link' })),
    ),
  );
}
