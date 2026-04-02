/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-contact.
 * Base: columns. Source: https://www.wknd-trendsetters.site/faq
 * Selectors from captured DOM: section.section.secondary-section .grid-layout
 * Columns table: 2 columns per row, row 1 = [left content, right content]
 */
export default function parse(element, { document }) {
  // Left column: heading + paragraph
  // Found in captured HTML: <h2 class="h2-heading">Let's connect</h2>
  // and <p class="paragraph-lg">Got more questions or want to chat?...</p>
  const heading = element.querySelector('h2, h3');
  const paragraph = element.querySelector('p.paragraph-lg, p');

  const leftCol = document.createElement('div');
  if (heading) leftCol.append(heading);
  if (paragraph) leftCol.append(paragraph);

  // Right column: contact items
  // Found in captured HTML: <div class="contact-items"> with child divs containing
  // <h3 class="h6-heading">Email</h3> <a href="mailto:...">hello@fashionblog.com</a>
  // <h3 class="h6-heading">Phone</h3> <a href="tel:...">+1 (555) 123-9876</a>
  // <h3 class="h6-heading">Address</h3> <p class="paragraph-lg">101 Trend Ave, SF, CA</p>
  const contactItems = element.querySelector('.contact-items');

  const rightCol = document.createElement('div');
  if (contactItems) {
    rightCol.append(contactItems);
  }

  const cells = [[leftCol, rightCol]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-contact', cells });
  element.replaceWith(block);
}
