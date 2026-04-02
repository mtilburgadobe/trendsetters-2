/* eslint-disable */
/* global WebImporter */

/**
 * Parser for accordion-faq.
 * Base: accordion. Source: https://www.wknd-trendsetters.site/faq
 * Selectors from captured DOM: .faq-list containing details.faq-item elements
 * Accordion table: 2 columns, each row = [title, content]
 */
export default function parse(element, { document }) {
  // Extract all FAQ items
  // Found in captured HTML: <details class="faq-item"> with <summary class="faq-question"> and <div class="faq-answer">
  const faqItems = element.querySelectorAll('details.faq-item');

  const cells = [];

  faqItems.forEach((item) => {
    // Title: extract text from summary, excluding the icon
    // Found in captured HTML: <summary class="faq-question"><span>Question text</span><img ...></summary>
    const questionSpan = item.querySelector('summary span, summary');
    const titleText = questionSpan ? questionSpan.textContent.trim() : '';

    // Content: extract answer text
    // Found in captured HTML: <div class="faq-answer"><p>Answer text</p></div>
    const answer = item.querySelector('.faq-answer');
    const answerContent = answer ? answer.cloneNode(true) : document.createTextNode('');

    cells.push([titleText, answerContent]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-faq', cells });
  element.replaceWith(block);
}
