// Diploma DSL Type Definitions
// These types define the structured format that the AI generates,
// which is then rendered into HTML/CSS by the renderer.

export interface DiplomaDSL {
  brand?: BrandConfig;
  layout: LayoutConfig;
  header: HeaderBlock;
  border: BorderBlock;
  body: BodyBlock;
  seal?: SealBlock;
  signature: SignatureBlock;
  background: BackgroundBlock;
  footer?: FooterBlock;
  customCss?: string; // Escape hatch for additional styling
}

// ── Brand Configuration ──

export interface BrandConfig {
  name: string;
  primaryColor: string;   // e.g. "#1a365d"
  accentColor: string;    // e.g. "#c6a961"
  fontFamily?: string;    // Custom brand font
}

// ── Layout ──

export type LayoutOrientation = 'landscape' | 'portrait';

export interface LayoutConfig {
  orientation: LayoutOrientation;
  padding: 'compact' | 'normal' | 'spacious';
}

// ── Header Block ──

export type HeaderStyle = 
  | 'serif-centered'
  | 'modern-left'
  | 'elegant-script'
  | 'bold-caps'
  | 'minimal'
  | 'monumental';

export interface HeaderBlock {
  style: HeaderStyle;
  institutionName: string;
  subtitle?: string;      // e.g. "School of Engineering"
}

// ── Border Block ──

export type BorderStyle = 
  | 'ornamental'
  | 'double-line'
  | 'modern'
  | 'minimal'
  | 'classical'
  | 'art-deco'
  | 'celtic-knot'
  | 'botanical-vine'
  | 'wave'
  | 'geometric-deco'
  | 'none';

export interface BorderBlock {
  style: BorderStyle;
  color?: string;         // Override color, defaults to brand
}

// ── Body Block ──

export interface BodyBlock {
  title: string;          // e.g. "Certificate of Completion"
  preText?: string;       // e.g. "This is to certify that"
  recipientName: string;
  description: string;    // Main achievement text
  date?: string;
  courseOrProgram?: string;
  additionalFields?: { label: string; value: string }[];
}

// ── Seal Block ──

export type SealStyle = 
  | 'classical-round'
  | 'star'
  | 'shield'
  | 'ribbon'
  | 'modern-circle'
  | 'rosette'
  | 'compass'
  | 'laurel-wreath'
  | 'none';

export type SealPosition = 'bottom-right' | 'bottom-left' | 'bottom-center' | 'top-right';

export interface SealBlock {
  style: SealStyle;
  position: SealPosition;
  text?: string;          // Text inside the seal
}

// ── Signature Block ──

export type SignatureStyle = 
  | 'handwriting'
  | 'formal'
  | 'elegant'
  | 'stamp'
  | 'digital';

export interface SignatureBlock {
  style: SignatureStyle;
  name: string;           // Default: "Mr Diploma"
  title?: string;         // e.g. "Director of Education"
}

// ── Background Block ──

export type BackgroundStyle = 
  | 'parchment'
  | 'clean-white'
  | 'ivory'
  | 'gradient-warm'
  | 'gradient-cool'
  | 'linen'
  | 'marble'
  | 'ocean-deep'
  | 'cosmic-dark'
  | 'botanical-green'
  | 'vintage-sepia'
  | 'watercolor-soft'
  | 'royal-burgundy';

export interface BackgroundBlock {
  style: BackgroundStyle;
}

// ── Footer Block ──

export interface FooterBlock {
  verificationUrl?: string;
  diplomaId?: string;
  additionalText?: string;
}

// ── Available block options (for AI prompt) ──

export const DSL_BLOCK_OPTIONS = {
  headerStyles: ['serif-centered', 'modern-left', 'elegant-script', 'bold-caps', 'minimal', 'monumental'] as const,
  borderStyles: ['ornamental', 'double-line', 'modern', 'minimal', 'classical', 'art-deco', 'celtic-knot', 'botanical-vine', 'wave', 'geometric-deco', 'none'] as const,
  sealStyles: ['classical-round', 'star', 'shield', 'ribbon', 'modern-circle', 'rosette', 'compass', 'laurel-wreath', 'none'] as const,
  sealPositions: ['bottom-right', 'bottom-left', 'bottom-center', 'top-right'] as const,
  signatureStyles: ['handwriting', 'formal', 'elegant', 'stamp', 'digital'] as const,
  backgroundStyles: ['parchment', 'clean-white', 'ivory', 'gradient-warm', 'gradient-cool', 'linen', 'marble', 'ocean-deep', 'cosmic-dark', 'botanical-green', 'vintage-sepia', 'watercolor-soft', 'royal-burgundy'] as const,
  layoutOrientations: ['landscape', 'portrait'] as const,
  layoutPaddings: ['compact', 'normal', 'spacious'] as const,
};
