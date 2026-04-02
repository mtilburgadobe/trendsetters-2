/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: trendsetters sections.
 * Adds section breaks and section-metadata blocks based on template sections.
 * Runs in afterTransform only.
 * Selectors from captured DOM of https://www.wknd-trendsetters.site/faq
 */
const H = { after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.after) {
    const { document } = element.ownerDocument ? { document: element.ownerDocument } : { document: element.getRootNode() };
    const sections = payload && payload.template && payload.template.sections;
    if (!sections || sections.length < 2) return;

    // Process sections in reverse order to preserve DOM positions
    const reversedSections = [...sections].reverse();

    reversedSections.forEach((section) => {
      // Find the first element matching the section selector
      const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
      let sectionEl = null;
      for (const sel of selectors) {
        sectionEl = element.querySelector(sel);
        if (sectionEl) break;
      }
      if (!sectionEl) return;

      // Add section-metadata block if section has a style
      if (section.style) {
        const metaBlock = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        sectionEl.after(metaBlock);
      }

      // Add section break (<hr>) before section if it's not the first
      // and there is content before it
      if (section.id !== sections[0].id && sectionEl.previousElementSibling) {
        const hr = document.createElement('hr');
        sectionEl.before(hr);
      }
    });
  }
}
