/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroFaqParser from './parsers/hero-faq.js';
import accordionFaqParser from './parsers/accordion-faq.js';
import columnsContactParser from './parsers/columns-contact.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/trendsetters-cleanup.js';
import sectionsTransformer from './transformers/trendsetters-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-faq': heroFaqParser,
  'accordion-faq': accordionFaqParser,
  'columns-contact': columnsContactParser,
};

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'faq-page',
  description: 'FAQ page with frequently asked questions and answers',
  urls: [
    'https://www.wknd-trendsetters.site/faq',
  ],
  blocks: [
    {
      name: 'hero-faq',
      instances: ['header.section.secondary-section'],
    },
    {
      name: 'accordion-faq',
      instances: ['.faq-list'],
    },
    {
      name: 'columns-contact',
      instances: ['section.section.secondary-section .grid-layout'],
    },
  ],
  sections: [
    {
      id: 'section-1-hero',
      name: 'Hero Section',
      selector: 'header.section.secondary-section',
      style: 'grey',
      blocks: ['hero-faq'],
      defaultContent: [],
    },
    {
      id: 'section-2-faq',
      name: 'FAQ Accordion Section',
      selector: 'section.section:not(.secondary-section):not(.accent-section)',
      style: null,
      blocks: ['accordion-faq'],
      defaultContent: [],
    },
    {
      id: 'section-3-contact',
      name: 'Contact Section',
      selector: 'main > section.section.secondary-section',
      style: 'grey',
      blocks: ['columns-contact'],
      defaultContent: [],
    },
    {
      id: 'section-4-cta',
      name: 'CTA Section',
      selector: 'section.section.accent-section',
      style: 'accent',
      blocks: [],
      defaultContent: [
        'section.section.accent-section h2',
        'section.section.accent-section p',
        'section.section.accent-section a.button',
      ],
    },
  ],
};

// TRANSFORMER REGISTRY
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };
  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });
  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;
    const main = document.body;

    // 1. Execute beforeTransform transformers
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers (cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '')
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
