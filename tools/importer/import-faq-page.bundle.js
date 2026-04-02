var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-faq-page.js
  var import_faq_page_exports = {};
  __export(import_faq_page_exports, {
    default: () => import_faq_page_default
  });

  // tools/importer/parsers/hero-faq.js
  function parse(element, { document }) {
    const image = element.querySelector("img.cover-image, img");
    const heading = element.querySelector("h1, h2");
    const subheading = element.querySelector("p.subheading, p:first-of-type");
    const paragraphs = Array.from(element.querySelectorAll("p:not(.subheading)"));
    const bodyText = paragraphs.find((p) => !p.classList.contains("subheading") && p.textContent.trim().length > 0);
    const cells = [];
    if (image) {
      cells.push([image]);
    }
    const contentContainer = document.createElement("div");
    if (heading) contentContainer.append(heading);
    if (subheading) contentContainer.append(subheading);
    if (bodyText) contentContainer.append(bodyText);
    cells.push([contentContainer]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-faq", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/accordion-faq.js
  function parse2(element, { document }) {
    const faqItems = element.querySelectorAll("details.faq-item");
    const cells = [];
    faqItems.forEach((item) => {
      const questionSpan = item.querySelector("summary span, summary");
      const titleText = questionSpan ? questionSpan.textContent.trim() : "";
      const answer = item.querySelector(".faq-answer");
      const answerContent = answer ? answer.cloneNode(true) : document.createTextNode("");
      cells.push([titleText, answerContent]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "accordion-faq", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-contact.js
  function parse3(element, { document }) {
    const heading = element.querySelector("h2, h3");
    const paragraph = element.querySelector("p.paragraph-lg, p");
    const leftCol = document.createElement("div");
    if (heading) leftCol.append(heading);
    if (paragraph) leftCol.append(paragraph);
    const contactItems = element.querySelector(".contact-items");
    const rightCol = document.createElement("div");
    if (contactItems) {
      rightCol.append(contactItems);
    }
    const cells = [[leftCol, rightCol]];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-contact", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/trendsetters-cleanup.js
  var H = { before: "beforeTransform", after: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === H.before) {
      WebImporter.DOMUtils.remove(element, ["a.skip-link"]);
    }
    if (hookName === H.after) {
      WebImporter.DOMUtils.remove(element, [
        ".navbar",
        "footer.footer",
        "noscript",
        "link",
        "iframe"
      ]);
    }
  }

  // tools/importer/transformers/trendsetters-sections.js
  var H2 = { after: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === H2.after) {
      const { document } = element.ownerDocument ? { document: element.ownerDocument } : { document: element.getRootNode() };
      const sections = payload && payload.template && payload.template.sections;
      if (!sections || sections.length < 2) return;
      const reversedSections = [...sections].reverse();
      reversedSections.forEach((section) => {
        const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
        let sectionEl = null;
        for (const sel of selectors) {
          sectionEl = element.querySelector(sel);
          if (sectionEl) break;
        }
        if (!sectionEl) return;
        if (section.style) {
          const metaBlock = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.after(metaBlock);
        }
        if (section.id !== sections[0].id && sectionEl.previousElementSibling) {
          const hr = document.createElement("hr");
          sectionEl.before(hr);
        }
      });
    }
  }

  // tools/importer/import-faq-page.js
  var parsers = {
    "hero-faq": parse,
    "accordion-faq": parse2,
    "columns-contact": parse3
  };
  var PAGE_TEMPLATE = {
    name: "faq-page",
    description: "FAQ page with frequently asked questions and answers",
    urls: [
      "https://www.wknd-trendsetters.site/faq"
    ],
    blocks: [
      {
        name: "hero-faq",
        instances: ["header.section.secondary-section"]
      },
      {
        name: "accordion-faq",
        instances: [".faq-list"]
      },
      {
        name: "columns-contact",
        instances: ["section.section.secondary-section .grid-layout"]
      }
    ],
    sections: [
      {
        id: "section-1-hero",
        name: "Hero Section",
        selector: "header.section.secondary-section",
        style: "grey",
        blocks: ["hero-faq"],
        defaultContent: []
      },
      {
        id: "section-2-faq",
        name: "FAQ Accordion Section",
        selector: "section.section:not(.secondary-section):not(.accent-section)",
        style: null,
        blocks: ["accordion-faq"],
        defaultContent: []
      },
      {
        id: "section-3-contact",
        name: "Contact Section",
        selector: "main > section.section.secondary-section",
        style: "grey",
        blocks: ["columns-contact"],
        defaultContent: []
      },
      {
        id: "section-4-cta",
        name: "CTA Section",
        selector: "section.section.accent-section",
        style: "accent",
        blocks: [],
        defaultContent: [
          "section.section.accent-section h2",
          "section.section.accent-section p",
          "section.section.accent-section a.button"
        ]
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
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
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_faq_page_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_faq_page_exports);
})();
