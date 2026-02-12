// Diploma DSL → HTML/CSS Renderer
// Converts a DiplomaDSL object into final HTML and CSS strings

import type { DiplomaDSL } from './types';
import {
  backgroundStyles,
  borderStyles,
  headerStyles,
  sealStyles,
  signatureStyles,
  paddingValues,
} from './blocks';

export function renderDiplomaDSL(dsl: DiplomaDSL): { html: string; css: string } {
  const primaryColor = dsl.brand?.primaryColor || '#1a365d';
  const accentColor = dsl.brand?.accentColor || '#c6a961';
  const padding = paddingValues[dsl.layout.padding] || '40px';

  // ── Collect CSS ──
  const cssParts: string[] = [];

  // Background
  const bgCss = backgroundStyles[dsl.background.style] || backgroundStyles['clean-white'];
  cssParts.push(`
    .diploma-container {
      max-width: 800px;
      margin: 0 auto;
      padding: ${padding};
      box-sizing: border-box;
      overflow: hidden;
      font-family: 'Georgia', 'Times New Roman', serif;
      color: #333;
      ${bgCss}
    }
  `);

  // Border — always clip content inside the frame
  const borderFn = borderStyles[dsl.border.style] || borderStyles['classical'];
  cssParts.push(borderFn(dsl.border.color || primaryColor));
  cssParts.push(`
    .diploma-border {
      overflow: hidden;
      position: relative;
    }
  `);

  // Header
  const headerFn = headerStyles[dsl.header.style] || headerStyles['serif-centered'];
  cssParts.push(headerFn(primaryColor));

  // Body
  cssParts.push(`
    .diploma-body {
      text-align: center;
      margin: 1.5em 0;
    }
    .diploma-body .diploma-title {
      font-family: 'Georgia', serif;
      font-size: 32px;
      font-weight: bold;
      color: ${primaryColor};
      margin-bottom: 0.8em;
      letter-spacing: 2px;
      text-transform: uppercase;
    }
    .diploma-body .diploma-pretext {
      font-size: 14px;
      color: #666;
      margin-bottom: 0.5em;
      font-style: italic;
    }
    .diploma-body .diploma-recipient {
      font-family: 'Dancing Script', cursive;
      font-size: 36px;
      color: ${primaryColor};
      margin: 0.3em 0;
      border-bottom: 2px solid ${accentColor}40;
      display: inline-block;
      padding: 0 20px 4px;
    }
    .diploma-body .diploma-description {
      font-size: 15px;
      color: #555;
      max-width: 500px;
      margin: 1em auto;
      line-height: 1.6;
    }
    .diploma-body .diploma-course {
      font-size: 18px;
      font-weight: bold;
      color: ${primaryColor};
      margin: 0.5em 0;
    }
    .diploma-body .diploma-date {
      font-size: 13px;
      color: #888;
      margin-top: 1em;
    }
    .diploma-body .diploma-fields {
      margin-top: 1em;
      font-size: 13px;
      color: #666;
    }
    .diploma-body .diploma-fields .field-label {
      font-weight: bold;
      color: #555;
    }
  `);

  // Seal
  let sealHtml = '';
  if (dsl.seal && dsl.seal.style !== 'none') {
    const sealFn = sealStyles[dsl.seal.style] || sealStyles['classical-round'];
    const seal = sealFn(accentColor, dsl.seal.text);
    cssParts.push(seal.css);
    sealHtml = seal.html;

    const posMap: Record<string, string> = {
      'bottom-right': 'justify-content: flex-end;',
      'bottom-left': 'justify-content: flex-start;',
      'bottom-center': 'justify-content: center;',
      'top-right': 'justify-content: flex-end;',
    };
    cssParts.push(`
      .diploma-seal-wrapper {
        display: flex;
        ${posMap[dsl.seal.position] || 'justify-content: flex-end;'}
        margin-top: 1em;
      }
    `);
  }

  // Signature
  const sigFn = signatureStyles[dsl.signature.style] || signatureStyles['handwriting'];
  const sig = sigFn(dsl.signature.name, dsl.signature.title, primaryColor);
  cssParts.push(sig.css);

  // Footer
  cssParts.push(`
    .diploma-footer {
      text-align: center;
      margin-top: 1.5em;
      font-size: 10px;
      color: #aaa;
    }
    .diploma-footer a {
      color: #aaa;
      text-decoration: none;
    }
    .diploma-bottom-row {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      margin-top: 1.5em;
    }
    .diploma-bottom-row.no-seal {
      justify-content: center;
    }
  `);

  // Custom CSS
  if (dsl.customCss) cssParts.push(dsl.customCss);

  // Google Fonts import
  cssParts.unshift(`@import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Great+Vibes&display=swap');`);

  // ── Build HTML ──
  const htmlParts: string[] = [];

  htmlParts.push(`<div class="diploma-container">`);
  htmlParts.push(`<div class="diploma-border">`);

  // Header
  htmlParts.push(`<div class="diploma-header">`);
  htmlParts.push(`<div class="institution">${dsl.header.institutionName}</div>`);
  if (dsl.header.subtitle) htmlParts.push(`<div class="subtitle">${dsl.header.subtitle}</div>`);
  htmlParts.push(`</div>`);

  // Body
  htmlParts.push(`<div class="diploma-body">`);
  htmlParts.push(`<div class="diploma-title">${dsl.body.title}</div>`);
  if (dsl.body.preText) htmlParts.push(`<div class="diploma-pretext">${dsl.body.preText}</div>`);
  htmlParts.push(`<div class="diploma-recipient">${dsl.body.recipientName}</div>`);
  htmlParts.push(`<div class="diploma-description">${dsl.body.description}</div>`);
  if (dsl.body.courseOrProgram) htmlParts.push(`<div class="diploma-course">${dsl.body.courseOrProgram}</div>`);
  if (dsl.body.additionalFields?.length) {
    htmlParts.push(`<div class="diploma-fields">`);
    for (const f of dsl.body.additionalFields) {
      htmlParts.push(`<div><span class="field-label">${f.label}:</span> ${f.value}</div>`);
    }
    htmlParts.push(`</div>`);
  }
  if (dsl.body.date) htmlParts.push(`<div class="diploma-date">${dsl.body.date}</div>`);
  htmlParts.push(`</div>`);

  // Bottom row: signature + seal
  const hasSeal = sealHtml && dsl.seal?.style !== 'none';
  htmlParts.push(`<div class="diploma-bottom-row${hasSeal ? '' : ' no-seal'}">`);
  htmlParts.push(sig.html);
  if (hasSeal) {
    htmlParts.push(`<div class="diploma-seal-wrapper">${sealHtml}</div>`);
  }
  htmlParts.push(`</div>`);

  // Footer
  if (dsl.footer) {
    htmlParts.push(`<div class="diploma-footer">`);
    if (dsl.footer.additionalText) htmlParts.push(`<div>${dsl.footer.additionalText}</div>`);
    if (dsl.footer.verificationUrl) htmlParts.push(`<div><a href="${dsl.footer.verificationUrl}">Verify: ${dsl.footer.diplomaId || ''}</a></div>`);
    htmlParts.push(`</div>`);
  }

  htmlParts.push(`</div>`); // border
  htmlParts.push(`</div>`); // container

  return {
    html: htmlParts.join('\n'),
    css: cssParts.join('\n'),
  };
}
