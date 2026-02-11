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
  'ocean-deep': `
    background: linear-gradient(180deg, #e8f4f8 0%, #b8d8e8 30%, #a0c8d8 60%, #d4eaf0 100%);
  `,
  'cosmic-dark': `
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 30%, #0f3460 60%, #1a1a2e 100%);
  `,
  'botanical-green': `
    background: linear-gradient(160deg, #f0f7f0 0%, #dcedc8 30%, #e8f5e0 60%, #f5faf0 100%);
  `,
  'vintage-sepia': `
    background: linear-gradient(135deg, #f5e6d0 0%, #e8d5b5 30%, #f0dfc5 60%, #eddcc0 100%);
    background-image: repeating-linear-gradient(
      45deg, transparent, transparent 4px, rgba(139,109,63,0.03) 4px, rgba(139,109,63,0.03) 8px
    );
  `,
  'watercolor-soft': `
    background: linear-gradient(135deg, #fce4ec 0%, #e8eaf6 25%, #e0f7fa 50%, #f3e5f5 75%, #fff3e0 100%);
  `,
  'royal-burgundy': `
    background: linear-gradient(145deg, #f8e8e8 0%, #f0d0d0 30%, #e8c0c0 60%, #f5dada 100%);
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
  'celtic-knot': (color) => `
    .diploma-border {
      border: 3px solid ${color};
      outline: 3px solid ${color};
      outline-offset: 4px;
      position: relative;
    }
    .diploma-border::before {
      content: '⟐';
      position: absolute;
      top: -10px; left: 50%;
      transform: translateX(-50%);
      background: inherit;
      padding: 0 8px;
      color: ${color};
      font-size: 18px;
    }
    .diploma-border::after {
      content: '⟐';
      position: absolute;
      bottom: -10px; left: 50%;
      transform: translateX(-50%);
      background: inherit;
      padding: 0 8px;
      color: ${color};
      font-size: 18px;
    }
  `,
  'botanical-vine': (color) => `
    .diploma-border {
      border: 2px solid ${color};
      position: relative;
    }
    .diploma-border::before {
      content: '❦';
      position: absolute;
      top: -10px; left: 50%;
      transform: translateX(-50%);
      background: inherit;
      padding: 0 10px;
      color: ${color};
      font-size: 20px;
    }
    .diploma-border::after {
      content: '❦';
      position: absolute;
      bottom: -10px; left: 50%;
      transform: translateX(-50%) rotate(180deg);
      background: inherit;
      padding: 0 10px;
      color: ${color};
      font-size: 20px;
    }
  `,
  'wave': (color) => `
    .diploma-border {
      border: 2px solid ${color};
      border-radius: 8px;
      box-shadow: 0 0 0 4px ${color}15, 0 0 0 8px ${color}10, 0 0 0 12px ${color}05;
    }
  `,
  'geometric-deco': (color) => `
    .diploma-border {
      border: 2px solid ${color};
      position: relative;
    }
    .diploma-border::before,
    .diploma-border::after {
      content: '';
      position: absolute;
      width: 30px;
      height: 30px;
      border: 2px solid ${color};
      transform: rotate(45deg);
    }
    .diploma-border::before {
      top: -16px; left: 50%;
      margin-left: -15px;
      border-bottom: none; border-right: none;
    }
    .diploma-border::after {
      bottom: -16px; left: 50%;
      margin-left: -15px;
      border-top: none; border-left: none;
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
  'monumental': (color) => `
    .diploma-header {
      text-align: center;
      margin-bottom: 1.5em;
    }
    .diploma-header .institution {
      font-family: 'Georgia', serif;
      font-size: 38px;
      font-weight: bold;
      color: ${color};
      letter-spacing: 10px;
      text-transform: uppercase;
      border-bottom: 3px double ${color};
      padding-bottom: 8px;
      display: inline-block;
    }
    .diploma-header .subtitle {
      font-size: 13px;
      color: ${color}80;
      letter-spacing: 6px;
      text-transform: uppercase;
      margin-top: 10px;
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
  'compass': (color, text = 'N') => ({
    css: `
      .diploma-seal {
        width: 80px; height: 80px;
        border: 2px solid ${color};
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
      }
      .diploma-seal::before {
        content: '';
        position: absolute;
        width: 60px; height: 60px;
        border: 1px solid ${color}40;
        transform: rotate(45deg);
      }
      .diploma-seal::after {
        content: '✦';
        position: absolute;
        top: 4px; left: 50%;
        transform: translateX(-50%);
        color: ${color};
        font-size: 10px;
      }
      .diploma-seal .seal-text {
        font-size: 18px;
        font-weight: bold;
        color: ${color};
      }
    `,
    html: `<div class="diploma-seal"><span class="seal-text">${text}</span></div>`,
  }),
  'laurel-wreath': (color, text = 'HONOR') => ({
    css: `
      .diploma-seal {
        width: 90px; height: 90px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
      }
      .diploma-seal::before {
        content: '❧';
        position: absolute;
        left: 2px; top: 50%;
        transform: translateY(-50%) scaleX(-1);
        color: ${color};
        font-size: 32px;
      }
      .diploma-seal::after {
        content: '❧';
        position: absolute;
        right: 2px; top: 50%;
        transform: translateY(-50%);
        color: ${color};
        font-size: 32px;
      }
      .diploma-seal .seal-text {
        font-size: 9px;
        font-weight: bold;
        color: ${color};
        letter-spacing: 2px;
        text-transform: uppercase;
        border-top: 1px solid ${color}40;
        border-bottom: 1px solid ${color}40;
        padding: 4px 0;
      }
    `,
    html: `<div class="diploma-seal"><span class="seal-text">${text}</span></div>`,
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
  'stamp': (name, title, color = '#333') => ({
    css: `
      .diploma-signature {
        text-align: center;
      }
      .diploma-signature .sig-stamp {
        display: inline-block;
        border: 3px solid ${color};
        border-radius: 4px;
        padding: 6px 18px;
        transform: rotate(-3deg);
        position: relative;
      }
      .diploma-signature .sig-name {
        font-family: 'Georgia', serif;
        font-size: 14px;
        font-weight: bold;
        color: ${color};
        letter-spacing: 3px;
        text-transform: uppercase;
      }
      .diploma-signature .sig-title {
        font-size: 10px;
        color: ${color}80;
        letter-spacing: 1px;
        text-transform: uppercase;
        margin-top: 2px;
      }
    `,
    html: `<div class="diploma-signature"><div class="sig-stamp"><div class="sig-name">${name}</div>${title ? `<div class="sig-title">${title}</div>` : ''}</div></div>`,
  }),
  'digital': (name, title, color = '#333') => ({
    css: `
      .diploma-signature {
        text-align: center;
      }
      .diploma-signature .sig-digital {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: ${color}08;
        border: 1px solid ${color}20;
        border-radius: 6px;
        padding: 8px 16px;
      }
      .diploma-signature .sig-icon {
        font-size: 18px;
        color: ${color};
      }
      .diploma-signature .sig-info {
        text-align: left;
      }
      .diploma-signature .sig-name {
        font-family: 'Helvetica Neue', Arial, sans-serif;
        font-size: 14px;
        font-weight: 600;
        color: ${color};
      }
      .diploma-signature .sig-title {
        font-size: 10px;
        color: #888;
        margin-top: 1px;
      }
      .diploma-signature .sig-verified {
        font-size: 9px;
        color: ${color}90;
        letter-spacing: 1px;
        text-transform: uppercase;
        margin-top: 2px;
      }
    `,
    html: `<div class="diploma-signature"><div class="sig-digital"><span class="sig-icon">🔏</span><div class="sig-info"><div class="sig-name">${name}</div>${title ? `<div class="sig-title">${title}</div>` : ''}<div class="sig-verified">Digitally signed</div></div></div></div>`,
  }),
};

// ── Layout padding values ──

export const paddingValues: Record<string, string> = {
  compact: '24px',
  normal: '40px',
  spacious: '60px',
};
