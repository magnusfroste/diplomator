// Diploma DSL CSS Block Library
// Pre-built, quality-assured CSS for each block type

// ── Background Styles ──

export const backgroundStyles: Record<string, string> = {
  'parchment': `
    background: linear-gradient(135deg, #f5f0e8 0%, #e8dcc8 50%, #f0e6d3 100%);
  `,
  'clean-white': `
    background: #ffffff;
  `,
  'ivory': `
    background: linear-gradient(180deg, #fffff8 0%, #faf6ee 100%);
  `,
  'gradient-warm': `
    background: linear-gradient(145deg, #fdf8f0 0%, #f5ebe0 40%, #faf0e4 100%);
  `,
  'gradient-cool': `
    background: linear-gradient(145deg, #f0f4f8 0%, #e2e8f0 40%, #edf2f7 100%);
  `,
  'linen': `
    background: #faf0e6;
    background-image: repeating-linear-gradient(
      0deg, transparent, transparent 2px, rgba(0,0,0,0.01) 2px, rgba(0,0,0,0.01) 4px
    );
  `,
  'marble': `
    background: linear-gradient(135deg, #f5f5f5 0%, #ececec 25%, #f8f8f8 50%, #e8e8e8 75%, #f5f5f5 100%);
  `,
};

// ── Border Styles ──

export const borderStyles: Record<string, (color: string) => string> = {
  'ornamental': (color) => `
    .diploma-border {
      border: 3px solid ${color};
      outline: 1px solid ${color};
      outline-offset: 6px;
      position: relative;
    }
    .diploma-border::before {
      content: '';
      position: absolute;
      top: 8px; left: 8px; right: 8px; bottom: 8px;
      border: 1px solid ${color}40;
    }
    .diploma-border::after {
      content: '❧';
      position: absolute;
      top: -8px; left: 50%;
      transform: translateX(-50%);
      background: inherit;
      padding: 0 12px;
      color: ${color};
      font-size: 16px;
    }
  `,
  'double-line': (color) => `
    .diploma-border {
      border: 3px double ${color};
      padding: 4px;
      outline: 1px solid ${color}60;
      outline-offset: 4px;
    }
  `,
  'modern': (color) => `
    .diploma-border {
      border: 2px solid ${color};
      border-radius: 4px;
    }
  `,
  'minimal': (color) => `
    .diploma-border {
      border: 1px solid ${color}40;
    }
  `,
  'classical': (color) => `
    .diploma-border {
      border: 4px solid ${color};
      box-shadow: inset 0 0 0 2px white, inset 0 0 0 4px ${color}30;
    }
  `,
  'art-deco': (color) => `
    .diploma-border {
      border: 2px solid ${color};
      position: relative;
    }
    .diploma-border::before,
    .diploma-border::after {
      content: '';
      position: absolute;
      width: 40px;
      height: 40px;
      border: 2px solid ${color};
    }
    .diploma-border::before {
      top: 8px; left: 8px;
      border-right: none; border-bottom: none;
    }
    .diploma-border::after {
      bottom: 8px; right: 8px;
      border-left: none; border-top: none;
    }
  `,
  'none': () => `
    .diploma-border {}
  `,
};

// ── Header Styles ──

export const headerStyles: Record<string, (primaryColor: string) => string> = {
  'serif-centered': (color) => `
    .diploma-header {
      text-align: center;
      margin-bottom: 1.5em;
    }
    .diploma-header .institution {
      font-family: 'Georgia', 'Times New Roman', serif;
      font-size: 28px;
      font-weight: bold;
      color: ${color};
      letter-spacing: 3px;
      text-transform: uppercase;
      margin-bottom: 4px;
    }
    .diploma-header .subtitle {
      font-family: 'Georgia', serif;
      font-size: 14px;
      color: ${color}99;
      font-style: italic;
    }
  `,
  'modern-left': (color) => `
    .diploma-header {
      text-align: left;
      margin-bottom: 1.5em;
      border-left: 4px solid ${color};
      padding-left: 16px;
    }
    .diploma-header .institution {
      font-family: 'Helvetica Neue', Arial, sans-serif;
      font-size: 24px;
      font-weight: 700;
      color: ${color};
    }
    .diploma-header .subtitle {
      font-size: 13px;
      color: #666;
      margin-top: 2px;
    }
  `,
  'elegant-script': (color) => `
    .diploma-header {
      text-align: center;
      margin-bottom: 1.5em;
    }
    .diploma-header .institution {
      font-family: 'Dancing Script', cursive;
      font-size: 36px;
      color: ${color};
    }
    .diploma-header .subtitle {
      font-family: 'Georgia', serif;
      font-size: 13px;
      color: ${color}80;
      letter-spacing: 2px;
      text-transform: uppercase;
      margin-top: 4px;
    }
  `,
  'bold-caps': (color) => `
    .diploma-header {
      text-align: center;
      margin-bottom: 1.5em;
    }
    .diploma-header .institution {
      font-family: 'Georgia', serif;
      font-size: 32px;
      font-weight: bold;
      color: ${color};
      letter-spacing: 6px;
      text-transform: uppercase;
    }
    .diploma-header .subtitle {
      font-size: 12px;
      color: ${color}70;
      letter-spacing: 4px;
      text-transform: uppercase;
      margin-top: 6px;
    }
  `,
  'minimal': (color) => `
    .diploma-header {
      text-align: center;
      margin-bottom: 1.5em;
    }
    .diploma-header .institution {
      font-family: 'Helvetica Neue', Arial, sans-serif;
      font-size: 20px;
      font-weight: 300;
      color: ${color};
      letter-spacing: 4px;
      text-transform: uppercase;
    }
    .diploma-header .subtitle {
      font-size: 12px;
      color: #999;
      margin-top: 4px;
    }
  `,
};

// ── Seal Styles ──

export const sealStyles: Record<string, (color: string, text?: string) => { css: string; html: string }> = {
  'classical-round': (color, text = 'VERIFIED') => ({
    css: `
      .diploma-seal {
        width: 80px; height: 80px;
        border: 3px solid ${color};
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
      }
      .diploma-seal::before {
        content: '';
        position: absolute;
        width: 70px; height: 70px;
        border: 1px solid ${color}60;
        border-radius: 50%;
      }
      .diploma-seal .seal-text {
        font-size: 9px;
        font-weight: bold;
        color: ${color};
        letter-spacing: 2px;
        text-transform: uppercase;
      }
    `,
    html: `<div class="diploma-seal"><span class="seal-text">${text}</span></div>`,
  }),
  'star': (color, text = '★') => ({
    css: `
      .diploma-seal {
        width: 80px; height: 80px;
        background: ${color};
        clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 20px;
      }
    `,
    html: `<div class="diploma-seal">${text}</div>`,
  }),
  'shield': (color, text = 'CERTIFIED') => ({
    css: `
      .diploma-seal {
        width: 70px; height: 85px;
        background: ${color};
        clip-path: polygon(0% 0%, 100% 0%, 100% 70%, 50% 100%, 0% 70%);
        display: flex;
        align-items: center;
        justify-content: center;
        padding-bottom: 10px;
      }
      .diploma-seal .seal-text {
        color: white;
        font-size: 8px;
        font-weight: bold;
        letter-spacing: 1px;
        text-transform: uppercase;
      }
    `,
    html: `<div class="diploma-seal"><span class="seal-text">${text}</span></div>`,
  }),
  'ribbon': (color) => ({
    css: `
      .diploma-seal {
        background: ${color};
        color: white;
        padding: 6px 24px;
        font-size: 11px;
        font-weight: bold;
        letter-spacing: 2px;
        text-transform: uppercase;
        position: relative;
      }
      .diploma-seal::before,
      .diploma-seal::after {
        content: '';
        position: absolute;
        bottom: -8px;
        border: 8px solid ${color};
        border-bottom-color: transparent;
      }
      .diploma-seal::before { left: 0; border-left-color: transparent; }
      .diploma-seal::after { right: 0; border-right-color: transparent; }
    `,
    html: `<div class="diploma-seal">CERTIFIED</div>`,
  }),
  'modern-circle': (color, text = '✓') => ({
    css: `
      .diploma-seal {
        width: 60px; height: 60px;
        border: 2px solid ${color};
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        color: ${color};
      }
    `,
    html: `<div class="diploma-seal">${text}</div>`,
  }),
  'rosette': (color) => ({
    css: `
      .diploma-seal {
        width: 80px; height: 80px;
        background: radial-gradient(circle, ${color} 30%, transparent 31%),
                    conic-gradient(from 0deg, ${color}20, ${color}60, ${color}20, ${color}60, ${color}20, ${color}60, ${color}20, ${color}60, ${color}20, ${color}60, ${color}20, ${color}60);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .diploma-seal .seal-text {
        color: white;
        font-size: 9px;
        font-weight: bold;
        letter-spacing: 1px;
      }
    `,
    html: `<div class="diploma-seal"><span class="seal-text">AWARD</span></div>`,
  }),
  'none': () => ({ css: '', html: '' }),
};

// ── Signature Styles ──

export const signatureStyles: Record<string, (name: string, title?: string, color?: string) => { css: string; html: string }> = {
  'handwriting': (name, title, color = '#333') => ({
    css: `
      @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');
      .diploma-signature {
        text-align: center;
      }
      .diploma-signature .sig-name {
        font-family: 'Dancing Script', cursive;
        font-size: 28px;
        color: ${color};
        border-bottom: 1px solid ${color}40;
        padding-bottom: 4px;
        display: inline-block;
      }
      .diploma-signature .sig-title {
        font-size: 11px;
        color: #888;
        margin-top: 4px;
      }
    `,
    html: `<div class="diploma-signature"><div class="sig-name">${name}</div>${title ? `<div class="sig-title">${title}</div>` : ''}</div>`,
  }),
  'formal': (name, title, color = '#333') => ({
    css: `
      .diploma-signature {
        text-align: center;
      }
      .diploma-signature .sig-line {
        width: 200px;
        border-bottom: 1px solid ${color};
        margin: 0 auto 6px;
      }
      .diploma-signature .sig-name {
        font-family: 'Georgia', serif;
        font-size: 16px;
        color: ${color};
        font-weight: bold;
      }
      .diploma-signature .sig-title {
        font-size: 11px;
        color: #888;
        margin-top: 2px;
      }
    `,
    html: `<div class="diploma-signature"><div class="sig-line"></div><div class="sig-name">${name}</div>${title ? `<div class="sig-title">${title}</div>` : ''}</div>`,
  }),
  'elegant': (name, title, color = '#333') => ({
    css: `
      @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap');
      .diploma-signature {
        text-align: center;
      }
      .diploma-signature .sig-name {
        font-family: 'Great Vibes', cursive;
        font-size: 32px;
        color: ${color};
      }
      .diploma-signature .sig-title {
        font-family: 'Georgia', serif;
        font-size: 11px;
        color: #888;
        letter-spacing: 1px;
        text-transform: uppercase;
        margin-top: 2px;
      }
    `,
    html: `<div class="diploma-signature"><div class="sig-name">${name}</div>${title ? `<div class="sig-title">${title}</div>` : ''}</div>`,
  }),
};

// ── Layout padding values ──

export const paddingValues: Record<string, string> = {
  compact: '24px',
  normal: '40px',
  spacious: '60px',
};
