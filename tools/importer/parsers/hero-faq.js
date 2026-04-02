/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-faq.
 * Base: hero. Source: https://www.wknd-trendsetters.site/faq
 * Selectors from captured DOM: header.section.secondary-section
 * Hero table: 1 column, row 1 = background image, row 2 = heading + subheading + text
 */
export default function parse(element, { document }) {
  // Extract image from the grid layout
  // Found in captured HTML: <img src="./images/..." alt="FAQ" class="cover-image">
  const image = element.querySelector('img.cover-image, img');

  // Extract heading
  // Found in captured HTML: <h1 class="h1-heading">Got questions? We've got answers.</h1>
  const heading = element.querySelector('h1, h2');

  // Extract subheading
  // Found in captured HTML: <p class="subheading">Fashion FAQs, answered fast</p>
  const subheading = element.querySelector('p.subheading, p:first-of-type');

  // Extract body text (paragraph after subheading)
  // Found in captured HTML: <p>Curious about trends, tips, or our vibe?...</p>
  const paragraphs = Array.from(element.querySelectorAll('p:not(.subheading)'));
  const bodyText = paragraphs.find((p) => !p.classList.contains('subheading') && p.textContent.trim().length > 0);

  const cells = [];

  // Row 1: Background image (optional per block library)
  if (image) {
    cells.push([image]);
  }

  // Row 2: Single cell with title + subheading + body text
  const contentContainer = document.createElement('div');
  if (heading) contentContainer.append(heading);
  if (subheading) contentContainer.append(subheading);
  if (bodyText) contentContainer.append(bodyText);
  cells.push([contentContainer]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-faq', cells });
  element.replaceWith(block);
}
