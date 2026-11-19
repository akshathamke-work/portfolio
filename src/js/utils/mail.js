/**
 * Builds the links that deliver a contact message. The recipient always comes
 * from the validated site data, never from the form, so a visitor can't change
 * where a message goes. Subject and body are percent-encoded to prevent header injection.
 */
export function buildMailLinks(recipient, { name, email, message }) {
  const subject = `Portfolio enquiry from ${name}`;
  const body = `${message}\n\n${name}\n${email}`;
  const s = encodeURIComponent(subject);
  const b = encodeURIComponent(body);
  const to = encodeURIComponent(recipient);
  return {
    mailto: `mailto:${recipient}?subject=${s}&body=${b}`,
    gmail: `https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${s}&body=${b}`,
  };
}
