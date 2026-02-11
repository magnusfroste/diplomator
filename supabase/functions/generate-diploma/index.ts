import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// ── Scraping helpers ──

const scrapeWebsiteData = async (url: string) => {
  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; DiplomaBot/1.0)', 'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8' },
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const html = await response.text();
    return {
      title: html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1] || '',
      colors: extractColors(html),
      fonts: extractFonts(html),
      brandName: extractBrandName(html, url),
      themeColor: html.match(/<meta[^>]*name="theme-color"[^>]*content="([^"]*)"[^>]*>/i)?.[1] || '',
    };
  } catch (e) { console.error('Scrape error:', e); return null; }
};

const extractColors = (html: string) => {
  const m = html.match(/#[0-9a-fA-F]{3,6}|rgb\([^)]+\)|hsl\([^)]+\)/g);
  return m ? [...new Set(m)].slice(0, 10) : [];
};
const extractFonts = (html: string) => {
  const fonts = new Set<string>();
  for (const m of html.matchAll(/font-family\s*:\s*([^;]+)/gi)) {
    const f = m[1].replace(/['"]/g, '').split(',')[0].trim();
    if (f && f !== 'inherit') fonts.add(f);
  }
  return [...fonts].slice(0, 5);
};
const extractBrandName = (html: string, url: string) => {
  const title = html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1] || '';
  const siteName = html.match(/<meta[^>]*property="og:site_name"[^>]*content="([^"]*)"[^>]*>/i)?.[1] || '';
  return siteName || title.split(/[-|–—]/)[0].trim() || new URL(url).hostname.replace('www.', '').split('.')[0];
};

// ── DSL Block Options (for prompt) ──

const DSL_SCHEMA = `{
  "brand": { "name": "string", "primaryColor": "#hex", "accentColor": "#hex" },
  "layout": { "orientation": "landscape|portrait", "padding": "compact|normal|spacious" },
  "header": { "style": "serif-centered|modern-left|elegant-script|bold-caps|minimal|monumental", "institutionName": "string", "subtitle": "string?" },
  "border": { "style": "ornamental|double-line|modern|minimal|classical|art-deco|celtic-knot|botanical-vine|wave|geometric-deco|none", "color": "#hex?" },
  "body": { "title": "string", "preText": "string?", "recipientName": "string", "description": "string", "date": "string?", "courseOrProgram": "string?", "additionalFields": [{"label":"string","value":"string"}]? },
  "seal": { "style": "classical-round|star|shield|ribbon|modern-circle|rosette|compass|laurel-wreath|none", "position": "bottom-right|bottom-left|bottom-center", "text": "string?" },
  "signature": { "style": "handwriting|formal|elegant|stamp|digital", "name": "string", "title": "string?" },
  "background": { "style": "parchment|clean-white|ivory|gradient-warm|gradient-cool|linen|marble|ocean-deep|cosmic-dark|botanical-green|vintage-sepia|watercolor-soft|royal-burgundy" },
  "footer": { "verificationUrl": "string?", "additionalText": "string?" },
  "customCss": "string?"
}`;

// ── System prompts ──

const DSL_SYSTEM_PROMPT = `You are an expert diploma designer. You design diplomas by choosing from predefined visual blocks.

RESPOND WITH ONLY A JSON OBJECT matching this schema (no markdown, no explanation outside JSON):
${DSL_SCHEMA}

RULES:
- Choose blocks that match the style the user wants (classic, modern, elegant, bold, minimal).
- The "signature.name" should default to "Mr Diploma" unless user specifies otherwise.
- Use appropriate brand colors that match the institution or requested style.
- "body.preText" is optional text before the recipient name like "This is to certify that".
- "customCss" is for any extra CSS tweaks the predefined blocks don't cover. Keep it minimal.
- Pick background, border, seal, and header styles that complement each other.
- For formal/academic diplomas use: serif-centered/monumental header, ornamental/classical border, classical-round seal, parchment/ivory bg.
- For modern/tech diplomas use: modern-left/minimal header, modern/wave border, modern-circle seal, clean-white/gradient-cool bg.
- For elegant/artistic diplomas use: elegant-script header, art-deco/double-line border, rosette/laurel-wreath seal, linen/marble/watercolor-soft bg.
- For nature/botanical diplomas use: serif-centered/elegant-script header, botanical-vine border, laurel-wreath seal, botanical-green bg.
- For ocean/nautical diplomas use: elegant-script header, wave border, compass seal, ocean-deep bg.
- For space/cosmic diplomas use: bold-caps/monumental header, geometric-deco border, star seal, cosmic-dark bg. Use light text colors in customCss.
- For vintage/classic diplomas use: serif-centered header, celtic-knot/ornamental border, classical-round seal, vintage-sepia bg.
- For royal/formal diplomas use: monumental/bold-caps header, classical/double-line border, shield seal, royal-burgundy bg.

Return ONLY the JSON object. No extra text.`;

const ITERATION_SYSTEM_PROMPT = `You are an expert diploma designer. You modify existing HTML/CSS diplomas.

FORBIDDEN: QR codes, <img> tags, external image files, markdown code fences.
Use only CSS for all visual elements.

Format response as:
MESSAGE: [explanation]
HTML: [complete HTML, no markdown]
CSS: [complete CSS, no markdown]

Make only the specific changes requested. Keep the existing design intact.`;

const IMAGE_SYSTEM_PROMPT = `You are an expert diploma designer. Analyze the uploaded image and design a diploma by choosing from predefined visual blocks.

RESPOND WITH ONLY A JSON OBJECT matching this schema (no markdown, no explanation outside JSON):
${DSL_SCHEMA}

Choose blocks that reflect the visual style of the uploaded image. Return ONLY the JSON object.`;

const URL_SYSTEM_PROMPT = `You are an expert diploma designer. Design a diploma matching a brand's visual identity by choosing from predefined visual blocks.

RESPOND WITH ONLY A JSON OBJECT matching this schema (no markdown, no explanation outside JSON):
${DSL_SCHEMA}

Use the provided website data to pick appropriate brand colors, fonts, and style. Return ONLY the JSON object.`;

// ── Inline DSL Renderer (edge functions can't import from src/) ──

const BG_STYLES: Record<string, string> = {
  'parchment': 'background: linear-gradient(135deg, #f5f0e8 0%, #e8dcc8 50%, #f0e6d3 100%);',
  'clean-white': 'background: #ffffff;',
  'ivory': 'background: linear-gradient(180deg, #fffff8 0%, #faf6ee 100%);',
  'gradient-warm': 'background: linear-gradient(145deg, #fdf8f0 0%, #f5ebe0 40%, #faf0e4 100%);',
  'gradient-cool': 'background: linear-gradient(145deg, #f0f4f8 0%, #e2e8f0 40%, #edf2f7 100%);',
  'linen': 'background: #faf0e6; background-image: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.01) 2px, rgba(0,0,0,0.01) 4px);',
  'marble': 'background: linear-gradient(135deg, #f5f5f5 0%, #ececec 25%, #f8f8f8 50%, #e8e8e8 75%, #f5f5f5 100%);',
  'ocean-deep': 'background: linear-gradient(180deg, #e8f4f8 0%, #b8d8e8 30%, #a0c8d8 60%, #d4eaf0 100%);',
  'cosmic-dark': 'background: linear-gradient(135deg, #1a1a2e 0%, #16213e 30%, #0f3460 60%, #1a1a2e 100%);',
  'botanical-green': 'background: linear-gradient(160deg, #f0f7f0 0%, #dcedc8 30%, #e8f5e0 60%, #f5faf0 100%);',
  'vintage-sepia': 'background: linear-gradient(135deg, #f5e6d0 0%, #e8d5b5 30%, #f0dfc5 60%, #eddcc0 100%);',
  'watercolor-soft': 'background: linear-gradient(135deg, #fce4ec 0%, #e8eaf6 25%, #e0f7fa 50%, #f3e5f5 75%, #fff3e0 100%);',
  'royal-burgundy': 'background: linear-gradient(145deg, #f8e8e8 0%, #f0d0d0 30%, #e8c0c0 60%, #f5dada 100%);',
};

function getBorderCss(style: string, color: string): string {
  const styles: Record<string, string> = {
    'ornamental': `.diploma-border{border:3px solid ${color};outline:1px solid ${color};outline-offset:6px;position:relative}.diploma-border::before{content:'';position:absolute;top:8px;left:8px;right:8px;bottom:8px;border:1px solid ${color}40}.diploma-border::after{content:'❧';position:absolute;top:-8px;left:50%;transform:translateX(-50%);background:inherit;padding:0 12px;color:${color};font-size:16px}`,
    'double-line': `.diploma-border{border:3px double ${color};padding:4px;outline:1px solid ${color}60;outline-offset:4px}`,
    'modern': `.diploma-border{border:2px solid ${color};border-radius:4px}`,
    'minimal': `.diploma-border{border:1px solid ${color}40}`,
    'classical': `.diploma-border{border:4px solid ${color};box-shadow:inset 0 0 0 2px white,inset 0 0 0 4px ${color}30}`,
    'art-deco': `.diploma-border{border:2px solid ${color};position:relative}.diploma-border::before,.diploma-border::after{content:'';position:absolute;width:40px;height:40px;border:2px solid ${color}}.diploma-border::before{top:8px;left:8px;border-right:none;border-bottom:none}.diploma-border::after{bottom:8px;right:8px;border-left:none;border-top:none}`,
    'celtic-knot': `.diploma-border{border:3px solid ${color};outline:3px solid ${color};outline-offset:4px;position:relative}.diploma-border::before{content:'⟐';position:absolute;top:-10px;left:50%;transform:translateX(-50%);background:inherit;padding:0 8px;color:${color};font-size:18px}.diploma-border::after{content:'⟐';position:absolute;bottom:-10px;left:50%;transform:translateX(-50%);background:inherit;padding:0 8px;color:${color};font-size:18px}`,
    'botanical-vine': `.diploma-border{border:2px solid ${color};position:relative}.diploma-border::before{content:'❦';position:absolute;top:-10px;left:50%;transform:translateX(-50%);background:inherit;padding:0 10px;color:${color};font-size:20px}.diploma-border::after{content:'❦';position:absolute;bottom:-10px;left:50%;transform:translateX(-50%) rotate(180deg);background:inherit;padding:0 10px;color:${color};font-size:20px}`,
    'wave': `.diploma-border{border:2px solid ${color};border-radius:8px;box-shadow:0 0 0 4px ${color}15,0 0 0 8px ${color}10,0 0 0 12px ${color}05}`,
    'geometric-deco': `.diploma-border{border:2px solid ${color};position:relative}.diploma-border::before,.diploma-border::after{content:'';position:absolute;width:30px;height:30px;border:2px solid ${color};transform:rotate(45deg)}.diploma-border::before{top:-16px;left:50%;margin-left:-15px;border-bottom:none;border-right:none}.diploma-border::after{bottom:-16px;left:50%;margin-left:-15px;border-top:none;border-left:none}`,
    'none': '.diploma-border{}',
  };
  return styles[style] || styles['classical'];
}

function getHeaderCss(style: string, color: string): string {
  const styles: Record<string, string> = {
    'serif-centered': `.diploma-header{text-align:center;margin-bottom:1.5em}.diploma-header .institution{font-family:'Georgia',serif;font-size:28px;font-weight:bold;color:${color};letter-spacing:3px;text-transform:uppercase;margin-bottom:4px}.diploma-header .subtitle{font-family:'Georgia',serif;font-size:14px;color:${color}99;font-style:italic}`,
    'modern-left': `.diploma-header{text-align:left;margin-bottom:1.5em;border-left:4px solid ${color};padding-left:16px}.diploma-header .institution{font-family:'Helvetica Neue',Arial,sans-serif;font-size:24px;font-weight:700;color:${color}}.diploma-header .subtitle{font-size:13px;color:#666;margin-top:2px}`,
    'elegant-script': `.diploma-header{text-align:center;margin-bottom:1.5em}.diploma-header .institution{font-family:'Dancing Script',cursive;font-size:36px;color:${color}}.diploma-header .subtitle{font-family:'Georgia',serif;font-size:13px;color:${color}80;letter-spacing:2px;text-transform:uppercase;margin-top:4px}`,
    'bold-caps': `.diploma-header{text-align:center;margin-bottom:1.5em}.diploma-header .institution{font-family:'Georgia',serif;font-size:32px;font-weight:bold;color:${color};letter-spacing:6px;text-transform:uppercase}.diploma-header .subtitle{font-size:12px;color:${color}70;letter-spacing:4px;text-transform:uppercase;margin-top:6px}`,
    'minimal': `.diploma-header{text-align:center;margin-bottom:1.5em}.diploma-header .institution{font-family:'Helvetica Neue',Arial,sans-serif;font-size:20px;font-weight:300;color:${color};letter-spacing:4px;text-transform:uppercase}.diploma-header .subtitle{font-size:12px;color:#999;margin-top:4px}`,
    'monumental': `.diploma-header{text-align:center;margin-bottom:1.5em}.diploma-header .institution{font-family:'Georgia',serif;font-size:38px;font-weight:bold;color:${color};letter-spacing:10px;text-transform:uppercase;border-bottom:3px double ${color};padding-bottom:8px;display:inline-block}.diploma-header .subtitle{font-size:13px;color:${color}80;letter-spacing:6px;text-transform:uppercase;margin-top:10px}`,
  };
  return styles[style] || styles['serif-centered'];
}

function getSealHtmlCss(style: string, color: string, text?: string): {html:string;css:string} {
  if (!style || style === 'none') return {html:'',css:''};
  const t = text || 'VERIFIED';
  const styles: Record<string, {html:string;css:string}> = {
    'classical-round': {css:`.diploma-seal{width:80px;height:80px;border:3px solid ${color};border-radius:50%;display:flex;align-items:center;justify-content:center;position:relative}.diploma-seal::before{content:'';position:absolute;width:70px;height:70px;border:1px solid ${color}60;border-radius:50%}.diploma-seal .seal-text{font-size:9px;font-weight:bold;color:${color};letter-spacing:2px;text-transform:uppercase}`,html:`<div class="diploma-seal"><span class="seal-text">${t}</span></div>`},
    'star': {css:`.diploma-seal{width:80px;height:80px;background:${color};clip-path:polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%);display:flex;align-items:center;justify-content:center;color:white;font-size:20px}`,html:`<div class="diploma-seal">★</div>`},
    'shield': {css:`.diploma-seal{width:70px;height:85px;background:${color};clip-path:polygon(0% 0%,100% 0%,100% 70%,50% 100%,0% 70%);display:flex;align-items:center;justify-content:center;padding-bottom:10px}.diploma-seal .seal-text{color:white;font-size:8px;font-weight:bold;letter-spacing:1px;text-transform:uppercase}`,html:`<div class="diploma-seal"><span class="seal-text">${t}</span></div>`},
    'ribbon': {css:`.diploma-seal{background:${color};color:white;padding:6px 24px;font-size:11px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;position:relative}.diploma-seal::before,.diploma-seal::after{content:'';position:absolute;bottom:-8px;border:8px solid ${color};border-bottom-color:transparent}.diploma-seal::before{left:0;border-left-color:transparent}.diploma-seal::after{right:0;border-right-color:transparent}`,html:`<div class="diploma-seal">CERTIFIED</div>`},
    'modern-circle': {css:`.diploma-seal{width:60px;height:60px;border:2px solid ${color};border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:24px;color:${color}}`,html:`<div class="diploma-seal">✓</div>`},
    'rosette': {css:`.diploma-seal{width:80px;height:80px;background:radial-gradient(circle,${color} 30%,transparent 31%),conic-gradient(from 0deg,${color}20,${color}60,${color}20,${color}60,${color}20,${color}60,${color}20,${color}60,${color}20,${color}60,${color}20,${color}60);border-radius:50%;display:flex;align-items:center;justify-content:center}.diploma-seal .seal-text{color:white;font-size:9px;font-weight:bold;letter-spacing:1px}`,html:`<div class="diploma-seal"><span class="seal-text">AWARD</span></div>`},
    'compass': {css:`.diploma-seal{width:80px;height:80px;border:2px solid ${color};border-radius:50%;display:flex;align-items:center;justify-content:center;position:relative}.diploma-seal::before{content:'';position:absolute;width:60px;height:60px;border:1px solid ${color}40;transform:rotate(45deg)}.diploma-seal::after{content:'✦';position:absolute;top:4px;left:50%;transform:translateX(-50%);color:${color};font-size:10px}.diploma-seal .seal-text{font-size:18px;font-weight:bold;color:${color}}`,html:`<div class="diploma-seal"><span class="seal-text">${t}</span></div>`},
    'laurel-wreath': {css:`.diploma-seal{width:90px;height:90px;display:flex;align-items:center;justify-content:center;position:relative}.diploma-seal::before{content:'❧';position:absolute;left:2px;top:50%;transform:translateY(-50%) scaleX(-1);color:${color};font-size:32px}.diploma-seal::after{content:'❧';position:absolute;right:2px;top:50%;transform:translateY(-50%);color:${color};font-size:32px}.diploma-seal .seal-text{font-size:9px;font-weight:bold;color:${color};letter-spacing:2px;text-transform:uppercase;border-top:1px solid ${color}40;border-bottom:1px solid ${color}40;padding:4px 0}`,html:`<div class="diploma-seal"><span class="seal-text">${t}</span></div>`},
  };
  return styles[style] || styles['classical-round'];
}

function getSignatureHtmlCss(style: string, name: string, title?: string, color = '#333'): {html:string;css:string} {
  const styles: Record<string, {html:string;css:string}> = {
    'handwriting': {css:`.diploma-signature{text-align:center}.diploma-signature .sig-name{font-family:'Dancing Script',cursive;font-size:28px;color:${color};border-bottom:1px solid ${color}40;padding-bottom:4px;display:inline-block}.diploma-signature .sig-title{font-size:11px;color:#888;margin-top:4px}`,html:`<div class="diploma-signature"><div class="sig-name">${name}</div>${title?`<div class="sig-title">${title}</div>`:''}</div>`},
    'formal': {css:`.diploma-signature{text-align:center}.diploma-signature .sig-line{width:200px;border-bottom:1px solid ${color};margin:0 auto 6px}.diploma-signature .sig-name{font-family:'Georgia',serif;font-size:16px;color:${color};font-weight:bold}.diploma-signature .sig-title{font-size:11px;color:#888;margin-top:2px}`,html:`<div class="diploma-signature"><div class="sig-line"></div><div class="sig-name">${name}</div>${title?`<div class="sig-title">${title}</div>`:''}</div>`},
    'elegant': {css:`.diploma-signature{text-align:center}.diploma-signature .sig-name{font-family:'Great Vibes',cursive;font-size:32px;color:${color}}.diploma-signature .sig-title{font-family:'Georgia',serif;font-size:11px;color:#888;letter-spacing:1px;text-transform:uppercase;margin-top:2px}`,html:`<div class="diploma-signature"><div class="sig-name">${name}</div>${title?`<div class="sig-title">${title}</div>`:''}</div>`},
    'stamp': {css:`.diploma-signature{text-align:center}.diploma-signature .sig-stamp{display:inline-block;border:3px solid ${color};border-radius:4px;padding:6px 18px;transform:rotate(-3deg)}.diploma-signature .sig-name{font-family:'Georgia',serif;font-size:14px;font-weight:bold;color:${color};letter-spacing:3px;text-transform:uppercase}.diploma-signature .sig-title{font-size:10px;color:${color}80;letter-spacing:1px;text-transform:uppercase;margin-top:2px}`,html:`<div class="diploma-signature"><div class="sig-stamp"><div class="sig-name">${name}</div>${title?`<div class="sig-title">${title}</div>`:''}</div></div>`},
    'digital': {css:`.diploma-signature{text-align:center}.diploma-signature .sig-digital{display:inline-flex;align-items:center;gap:8px;background:${color}08;border:1px solid ${color}20;border-radius:6px;padding:8px 16px}.diploma-signature .sig-icon{font-size:18px;color:${color}}.diploma-signature .sig-info{text-align:left}.diploma-signature .sig-name{font-family:'Helvetica Neue',Arial,sans-serif;font-size:14px;font-weight:600;color:${color}}.diploma-signature .sig-title{font-size:10px;color:#888;margin-top:1px}.diploma-signature .sig-verified{font-size:9px;color:${color}90;letter-spacing:1px;text-transform:uppercase;margin-top:2px}`,html:`<div class="diploma-signature"><div class="sig-digital"><span class="sig-icon">🔏</span><div class="sig-info"><div class="sig-name">${name}</div>${title?`<div class="sig-title">${title}</div>`:''}<div class="sig-verified">Digitally signed</div></div></div></div>`},
  };
  return styles[style] || styles['handwriting'];
}

function renderDSL(dsl: any): {html:string;css:string} {
  const pc = dsl.brand?.primaryColor || '#1a365d';
  const ac = dsl.brand?.accentColor || '#c6a961';
  const pad = ({compact:'24px',normal:'40px',spacious:'60px'} as any)[dsl.layout?.padding] || '40px';
  const bgCss = BG_STYLES[dsl.background?.style] || BG_STYLES['clean-white'];

  const cssParts = [
    `@import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Great+Vibes&display=swap');`,
    `.diploma-container{max-width:800px;margin:0 auto;padding:${pad};box-sizing:border-box;overflow:hidden;font-family:'Georgia','Times New Roman',serif;color:#333;${bgCss}}`,
    getBorderCss(dsl.border?.style || 'classical', dsl.border?.color || pc),
    getHeaderCss(dsl.header?.style || 'serif-centered', pc),
    `.diploma-body{text-align:center;margin:1.5em 0}.diploma-body .diploma-title{font-family:'Georgia',serif;font-size:32px;font-weight:bold;color:${pc};margin-bottom:0.8em;letter-spacing:2px;text-transform:uppercase}.diploma-body .diploma-pretext{font-size:14px;color:#666;margin-bottom:0.5em;font-style:italic}.diploma-body .diploma-recipient{font-family:'Dancing Script',cursive;font-size:36px;color:${pc};margin:0.3em 0;border-bottom:2px solid ${ac}40;display:inline-block;padding:0 20px 4px}.diploma-body .diploma-description{font-size:15px;color:#555;max-width:500px;margin:1em auto;line-height:1.6}.diploma-body .diploma-course{font-size:18px;font-weight:bold;color:${pc};margin:0.5em 0}.diploma-body .diploma-date{font-size:13px;color:#888;margin-top:1em}.diploma-body .diploma-fields{margin-top:1em;font-size:13px;color:#666}.diploma-body .diploma-fields .field-label{font-weight:bold;color:#555}`,
  ];

  const seal = getSealHtmlCss(dsl.seal?.style || 'none', ac, dsl.seal?.text);
  if (seal.css) cssParts.push(seal.css);
  if (dsl.seal && dsl.seal.style !== 'none') {
    const pos = ({
      'bottom-right':'justify-content:flex-end',
      'bottom-left':'justify-content:flex-start',
      'bottom-center':'justify-content:center',
    } as any)[dsl.seal.position] || 'justify-content:flex-end';
    cssParts.push(`.diploma-seal-wrapper{display:flex;${pos};margin-top:1em}`);
  }

  const sig = getSignatureHtmlCss(dsl.signature?.style||'handwriting', dsl.signature?.name||'Mr Diploma', dsl.signature?.title, pc);
  cssParts.push(sig.css);
  cssParts.push(`.diploma-footer{text-align:center;margin-top:1.5em;font-size:10px;color:#aaa}.diploma-footer a{color:#aaa;text-decoration:none}.diploma-bottom-row{display:flex;align-items:flex-end;justify-content:space-between;margin-top:1.5em}.diploma-bottom-row.no-seal{justify-content:center}`);
  if (dsl.customCss) cssParts.push(dsl.customCss);

  // Build HTML
  const hasSeal = seal.html && dsl.seal?.style !== 'none';
  const fields = (dsl.body?.additionalFields||[]).map((f:any)=>`<div><span class="field-label">${f.label}:</span> ${f.value}</div>`).join('');
  
  const html = `<div class="diploma-container">
<div class="diploma-border">
<div class="diploma-header">
<div class="institution">${dsl.header?.institutionName||'Institution'}</div>
${dsl.header?.subtitle?`<div class="subtitle">${dsl.header.subtitle}</div>`:''}
</div>
<div class="diploma-body">
<div class="diploma-title">${dsl.body?.title||'Certificate'}</div>
${dsl.body?.preText?`<div class="diploma-pretext">${dsl.body.preText}</div>`:''}
<div class="diploma-recipient">${dsl.body?.recipientName||'Recipient Name'}</div>
<div class="diploma-description">${dsl.body?.description||''}</div>
${dsl.body?.courseOrProgram?`<div class="diploma-course">${dsl.body.courseOrProgram}</div>`:''}
${fields?`<div class="diploma-fields">${fields}</div>`:''}
${dsl.body?.date?`<div class="diploma-date">${dsl.body.date}</div>`:''}
</div>
<div class="diploma-bottom-row${hasSeal?'':' no-seal'}">
${sig.html}
${hasSeal?`<div class="diploma-seal-wrapper">${seal.html}</div>`:''}
</div>
${dsl.footer?`<div class="diploma-footer">${dsl.footer.additionalText?`<div>${dsl.footer.additionalText}</div>`:''}${dsl.footer.verificationUrl?`<div><a href="${dsl.footer.verificationUrl}">Verify</a></div>`:''}</div>`:''}
</div>
</div>`;

  return { html, css: cssParts.join('\n') };
}

function extractJson(text: string): any {
  let cleaned = text.replace(/```(?:json)?\s*/gi, '').replace(/```\s*/g, '').trim();
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start === -1 || end === -1) throw new Error('No JSON found in response');
  cleaned = cleaned.substring(start, end + 1);
  try { return JSON.parse(cleaned); }
  catch { 
    cleaned = cleaned.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']').replace(/[\x00-\x1F\x7F]/g, '');
    return JSON.parse(cleaned);
  }
}



// ── Provider adapters ──

interface AIResponse { text: string }

async function callAnthropic(systemPrompt: string, messages: any[], model: string, imageData?: any): Promise<AIResponse> {
  const apiKey = Deno.env.get('ANTHROPIC_API_KEY');
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY not configured');

  const body: any = {
    model,
    max_tokens: 4000,
    system: systemPrompt,
    messages,
  };

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Anthropic API error ${response.status}: ${err.substring(0, 300)}`);
  }

  const data = await response.json();
  return { text: data.content[0].text };
}

async function callOpenAI(systemPrompt: string, messages: any[], model: string, imageData?: any): Promise<AIResponse> {
  const apiKey = Deno.env.get('OPENAI_API_KEY');
  if (!apiKey) throw new Error('OPENAI_API_KEY not configured');

  const openaiMessages: any[] = [{ role: 'system', content: systemPrompt }];

  for (const msg of messages) {
    if (Array.isArray(msg.content)) {
      // Handle image content
      const parts: any[] = [];
      for (const part of msg.content) {
        if (part.type === 'text') {
          parts.push({ type: 'text', text: part.text });
        } else if (part.type === 'image') {
          parts.push({ type: 'image_url', image_url: { url: `data:${part.source.media_type};base64,${part.source.data}` } });
        }
      }
      openaiMessages.push({ role: msg.role, content: parts });
    } else {
      openaiMessages.push({ role: msg.role, content: msg.content });
    }
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify({ model, max_tokens: 4000, messages: openaiMessages }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`OpenAI API error ${response.status}: ${err.substring(0, 300)}`);
  }

  const data = await response.json();
  return { text: data.choices[0].message.content };
}

async function callGemini(systemPrompt: string, messages: any[], model: string, imageData?: any): Promise<AIResponse> {
  const apiKey = Deno.env.get('GEMINI_API_KEY');
  if (!apiKey) throw new Error('GEMINI_API_KEY not configured');

  const contents: any[] = [];

  // Add system instruction as first user message context
  const allParts: any[] = [];

  for (const msg of messages) {
    if (Array.isArray(msg.content)) {
      for (const part of msg.content) {
        if (part.type === 'text') {
          allParts.push({ text: part.text });
        } else if (part.type === 'image') {
          allParts.push({ inline_data: { mime_type: part.source.media_type, data: part.source.data } });
        }
      }
    } else {
      allParts.push({ text: msg.content });
    }
  }

  contents.push({ role: 'user', parts: allParts });

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: systemPrompt }] },
      contents,
      generationConfig: { maxOutputTokens: 4000 },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Gemini API error ${response.status}: ${err.substring(0, 300)}`);
  }

  const data = await response.json();
  return { text: data.candidates?.[0]?.content?.parts?.[0]?.text || '' };
}

// ── Main handler ──

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, requestType, imageData, url, currentHtml, currentCss, userFullName, isGuest } = await req.json();

    // Auth check
    const supabaseAdmin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

    if (!isGuest) {
      const authHeader = req.headers.get('Authorization');
      if (!authHeader?.startsWith('Bearer ')) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
      const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, { global: { headers: { Authorization: authHeader } } });
      const token = authHeader.replace('Bearer ', '');
      const { error } = await supabase.auth.getClaims(token);
      if (error) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
    }

    // Fetch active provider from app_settings
    const { data: settingData } = await supabaseAdmin.from('app_settings').select('value').eq('key', 'ai_provider').single();
    const providerConfig = settingData?.value as { provider: string; model: string } || { provider: 'anthropic', model: 'claude-sonnet-4-20250514' };
    const { provider, model } = providerConfig;

    console.log(`Using AI provider: ${provider}, model: ${model}`);

    // Determine mode: DSL (new diplomas) vs iteration (editing existing HTML/CSS)
    const isIteration = !!(currentHtml && currentCss) && requestType !== 'image' && requestType !== 'url';

    let systemPrompt: string;
    let aiMessages: any[];

    if (isIteration) {
      // ITERATION MODE: Keep old HTML/CSS approach for editing
      systemPrompt = ITERATION_SYSTEM_PROMPT + `\n\nCURRENT HTML:\n${currentHtml}\nCURRENT CSS:\n${currentCss}\nMake only the specific changes requested.`;
      const userMessages = (messages || []).filter((msg: any) => msg.role !== 'system');
      aiMessages = userMessages;
    } else if (requestType === 'image') {
      systemPrompt = IMAGE_SYSTEM_PROMPT;
      aiMessages = [{
        role: 'user',
        content: [
          { type: 'text', text: 'Analyze this image and create a diploma design inspired by its visual style. Return JSON matching the DSL schema.' },
          { type: 'image', source: { type: 'base64', media_type: imageData.type, data: imageData.data } }
        ]
      }];
    } else if (requestType === 'url') {
      systemPrompt = URL_SYSTEM_PROMPT;
      const websiteData = await scrapeWebsiteData(url);
      if (websiteData) {
        systemPrompt += `\n\nWEBSITE DATA:\n- Brand: ${websiteData.brandName}\n- Colors: ${websiteData.colors.join(', ')}\n- Fonts: ${websiteData.fonts.join(', ')}\n- Theme: ${websiteData.themeColor}`;
      }
      aiMessages = [{ role: 'user', content: `Create a diploma for the brand at: ${url}. Return JSON matching the DSL schema.` }];
    } else {
      // DSL MODE: New diploma from chat
      systemPrompt = DSL_SYSTEM_PROMPT;
      const userMessages = (messages || []).filter((msg: any) => msg.role !== 'system');
      aiMessages = userMessages;
    }

    // Call the selected provider
    let result: AIResponse;
    switch (provider) {
      case 'openai':
        result = await callOpenAI(systemPrompt, aiMessages, model);
        break;
      case 'gemini':
        result = await callGemini(systemPrompt, aiMessages, model);
        break;
      case 'anthropic':
      default:
        result = await callAnthropic(systemPrompt, aiMessages, model);
        break;
    }

    const responseText = result.text;

    if (isIteration) {
      // Parse old-style MESSAGE/HTML/CSS response
      const stripFences = (s: string) => s.replace(/```(?:html|css|)\s*/gi, '').replace(/```\s*/g, '').trim();
      const messagePart = responseText.match(/MESSAGE:\s*(.*?)(?=HTML:|$)/s)?.[1]?.trim() || "I've updated the diploma!";
      const htmlPart = stripFences(responseText.match(/HTML:\s*(.*?)(?=CSS:|$)/s)?.[1]?.trim() || '');
      const cssPart = stripFences(responseText.match(/CSS:\s*(.*?)$/s)?.[1]?.trim() || '');

      return new Response(JSON.stringify({ message: messagePart, html: htmlPart, css: cssPart, provider, model }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } else {
      // Parse DSL JSON and render
      const dsl = extractJson(responseText);
      console.log('DSL parsed:', JSON.stringify(dsl).substring(0, 200));
      const rendered = renderDSL(dsl);

      return new Response(JSON.stringify({
        message: `Diploma designed with ${dsl.header?.style || 'classic'} header, ${dsl.border?.style || 'classical'} border, ${dsl.seal?.style || 'no'} seal, and ${dsl.background?.style || 'clean'} background.`,
        html: rendered.html,
        css: rendered.css,
        dsl,
        provider,
        model,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    console.error('Error in generate-diploma:', error);
    return new Response(JSON.stringify({
      error: error.message,
      message: 'Sorry, an error occurred while generating your diploma. Please try again.'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
