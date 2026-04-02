/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: trendsetters cleanup.
 * Removes non-authorable content from WKND Trendsetters pages.
 * Selectors from captured DOM of https://www.wknd-trendsetters.site/faq
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.before) {
    // Remove skip link that may interfere with parsing
    // Found in captured HTML: <a href="#main-content" class="skip-link">
    WebImporter.DOMUtils.remove(element, ['a.skip-link']);
  }
  if (hookName === H.after) {
    // Remove non-authorable site shell elements
    // Found in captured HTML: <div class="navbar">, <footer class="footer">
    WebImporter.DOMUtils.remove(element, [
      '.navbar',
      'footer.footer',
      'noscript',
      'link',
      'iframe',
    ]);
  }
}
