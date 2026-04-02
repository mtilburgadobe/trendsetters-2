export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length >= 2) {
    rows[0].classList.add('hero-faq-image');
    rows[1].classList.add('hero-faq-content');
  }
}
