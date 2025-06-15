
import { createHash } from 'crypto';

export interface DiplomaRecord {
  id: string;
  contentHash: string;
  signature: string;
  timestamp: number;
  recipientInfo: string;
  institutionInfo: string;
  diplomatorSeal: string;
}

// Simulated blockchain storage (in production, this would be a real blockchain)
const blockchainStorage = new Map<string, DiplomaRecord>();

// Diplomator's private key (in production, this would be securely stored)
const DIPLOMATOR_PRIVATE_KEY = 'diplomator_secure_key_2024';

/**
 * Creates a SHA-256 hash of the diploma content
 */
export const createContentHash = (html: string, css: string): string => {
  const content = html + css;
  return createHash('sha256').update(content).digest('hex');
};

/**
 * Creates Diplomator's cryptographic signature
 */
export const createDiplomatorSignature = (contentHash: string, recipientName: string): string => {
  const signatureData = `${contentHash}:${recipientName}:${DIPLOMATOR_PRIVATE_KEY}`;
  return createHash('sha256').update(signatureData).digest('hex');
};

/**
 * Generates a unique diploma ID
 */
export const generateDiplomaId = (): string => {
  return 'DIP_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 9);
};

/**
 * Signs a diploma and stores it on the blockchain
 */
export const signDiplomaToBlockchain = async (
  html: string,
  css: string,
  recipientName: string,
  institutionName: string
): Promise<DiplomaRecord> => {
  const contentHash = createContentHash(html, css);
  const diplomaId = generateDiplomaId();
  const signature = createDiplomatorSignature(contentHash, recipientName);
  const diplomatorSeal = createHash('sha256').update(`DIPLOMATOR_SEAL_${diplomaId}`).digest('hex');
  
  const record: DiplomaRecord = {
    id: diplomaId,
    contentHash,
    signature,
    timestamp: Date.now(),
    recipientInfo: createHash('sha256').update(recipientName).digest('hex'), // Privacy: store hash only
    institutionInfo: institutionName,
    diplomatorSeal
  };

  // Store on "blockchain" (simulated)
  blockchainStorage.set(diplomaId, record);
  
  // Simulate blockchain transaction delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return record;
};

/**
 * Verifies a diploma against blockchain records
 */
export const verifyDiplomaFromBlockchain = async (
  diplomaId: string,
  html: string,
  css: string,
  recipientName: string
): Promise<{
  isValid: boolean;
  record?: DiplomaRecord;
  issues: string[];
}> => {
  const issues: string[] = [];
  
  // Check if diploma exists on blockchain
  const record = blockchainStorage.get(diplomaId);
  if (!record) {
    issues.push('Diploma not found on blockchain');
    return { isValid: false, issues };
  }

  // Verify content hash
  const currentContentHash = createContentHash(html, css);
  if (currentContentHash !== record.contentHash) {
    issues.push('Diploma content has been tampered with');
  }

  // Verify Diplomator signature
  const expectedSignature = createDiplomatorSignature(record.contentHash, recipientName);
  if (expectedSignature !== record.signature) {
    issues.push('Invalid Diplomator signature');
  }

  // Verify recipient (privacy-preserving)
  const recipientHash = createHash('sha256').update(recipientName).digest('hex');
  if (recipientHash !== record.recipientInfo) {
    issues.push('Recipient name does not match blockchain record');
  }

  const isValid = issues.length === 0;
  return { isValid, record, issues };
};

/**
 * Gets all blockchain records (for demonstration)
 */
export const getAllBlockchainRecords = (): DiplomaRecord[] => {
  return Array.from(blockchainStorage.values()).sort((a, b) => b.timestamp - a.timestamp);
};

/**
 * Creates a verification URL for a diploma
 */
export const createVerificationUrl = (diplomaId: string): string => {
  const baseUrl = window.location.origin;
  return `${baseUrl}/verify/${diplomaId}`;
};
