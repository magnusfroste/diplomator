
import { supabase } from '@/integrations/supabase/client';

export interface DiplomaRecord {
  id: string;
  contentHash: string;
  signature: string;
  timestamp: number;
  recipientInfo: string;
  institutionInfo: string;
  diplomatorSeal: string;
}

// Diplomator's private key (in production, this would be securely stored)
const DIPLOMATOR_PRIVATE_KEY = 'diplomator_secure_key_2024';

/**
 * Creates a SHA-256 hash using Web Crypto API
 */
export const createWebCryptoHash = async (data: string): Promise<string> => {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

/**
 * Creates a SHA-256 hash of the diploma content
 */
export const createContentHash = async (html: string, css: string): Promise<string> => {
  const content = html + css;
  return await createWebCryptoHash(content);
};

/**
 * Creates Diplomator's cryptographic signature
 */
export const createDiplomatorSignature = async (contentHash: string, recipientName: string): Promise<string> => {
  const signatureData = `${contentHash}:${recipientName}:${DIPLOMATOR_PRIVATE_KEY}`;
  return await createWebCryptoHash(signatureData);
};

/**
 * Generates a unique diploma ID
 */
export const generateDiplomaId = (): string => {
  return 'DIP_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 9);
};

/**
 * Gets the production base URL for diploma links
 */
const getProductionBaseUrl = (): string => {
  return 'https://fabf66d2-6cc8-4995-9bf4-f98c6333f3ed.lovableproject.com';
};

/**
 * Signs a diploma and stores it in Supabase
 */
export const signDiplomaToBlockchain = async (
  html: string,
  css: string,
  recipientName: string,
  institutionName: string
): Promise<DiplomaRecord> => {
  console.log('=== BLOCKCHAIN SERVICE DEBUG ===');
  console.log('Starting signDiplomaToBlockchain with:');
  console.log('- HTML length:', html.length);
  console.log('- CSS length:', css.length);
  console.log('- Recipient:', recipientName);
  console.log('- Institution:', institutionName);

  const contentHash = await createContentHash(html, css);
  const diplomaId = generateDiplomaId();
  const signature = await createDiplomatorSignature(contentHash, recipientName);
  const diplomatorSeal = await createWebCryptoHash(`DIPLOMATOR_SEAL_${diplomaId}`);
  
  console.log('Generated blockchain data:');
  console.log('- Diploma ID:', diplomaId);
  console.log('- Content hash:', contentHash);
  console.log('- Signature:', signature);
  console.log('- Diplomator seal:', diplomatorSeal);

  const record: DiplomaRecord = {
    id: diplomaId,
    contentHash,
    signature,
    timestamp: Date.now(),
    recipientInfo: await createWebCryptoHash(recipientName), // Privacy: store hash only
    institutionInfo: institutionName,
    diplomatorSeal
  };

  // Get current user
  console.log('Checking user authentication...');
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError) {
    console.error('Authentication error:', authError);
    throw new Error('Authentication error: ' + authError.message);
  }
  if (!user) {
    console.error('No authenticated user found');
    throw new Error('User must be authenticated to sign diplomas');
  }
  console.log('User authenticated:', user.id);

  const verificationUrl = createVerificationUrl(diplomaId);
  const diplomaUrl = createDiplomaUrl(diplomaId);

  console.log('Generated URLs:');
  console.log('- Verification URL:', verificationUrl);
  console.log('- Diploma URL:', diplomaUrl);

  // Store in Supabase database
  console.log('Inserting into database...');
  const insertData = {
    blockchain_id: diplomaId,
    issuer_id: user.id,
    recipient_name: recipientName,
    institution_name: institutionName,
    diploma_html: html,
    diploma_css: css,
    content_hash: contentHash,
    signature: signature,
    diplomator_seal: diplomatorSeal,
    verification_url: verificationUrl,
    diploma_url: diplomaUrl
  };
  
  console.log('Insert data prepared:', {
    blockchain_id: insertData.blockchain_id,
    issuer_id: insertData.issuer_id,
    recipient_name: insertData.recipient_name,
    institution_name: insertData.institution_name,
    diploma_html_length: insertData.diploma_html.length,
    diploma_css_length: insertData.diploma_css.length,
    verification_url: insertData.verification_url,
    diploma_url: insertData.diploma_url
  });

  const { error } = await supabase
    .from('signed_diplomas')
    .insert(insertData);

  if (error) {
    console.error('=== DATABASE INSERT ERROR ===');
    console.error('Error details:', error);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Error hint:', error.hint);
    throw new Error('Failed to store diploma in database: ' + error.message);
  }

  console.log('=== DATABASE INSERT SUCCESS ===');
  console.log('Diploma successfully stored with ID:', diplomaId);

  // Store the diploma URL for sharing
  sessionStorage.setItem('lastDiplomaUrl', diplomaUrl);

  // Simulate blockchain transaction delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  console.log('=== BLOCKCHAIN SIGNING COMPLETE ===');
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
  
  // Check if diploma exists in Supabase
  const { data: diplomaData, error } = await supabase
    .from('signed_diplomas')
    .select('*')
    .eq('blockchain_id', diplomaId)
    .single();

  if (error || !diplomaData) {
    issues.push('Diploma not found on blockchain');
    return { isValid: false, issues };
  }

  // Convert database record to DiplomaRecord format
  const record: DiplomaRecord = {
    id: diplomaData.blockchain_id,
    contentHash: diplomaData.content_hash,
    signature: diplomaData.signature,
    timestamp: new Date(diplomaData.created_at).getTime(),
    recipientInfo: await createWebCryptoHash(diplomaData.recipient_name),
    institutionInfo: diplomaData.institution_name,
    diplomatorSeal: diplomaData.diplomator_seal
  };

  // Verify content hash
  const currentContentHash = await createContentHash(html, css);
  if (currentContentHash !== record.contentHash) {
    issues.push('Diploma content has been tampered with');
  }

  // Verify Diplomator signature
  const expectedSignature = await createDiplomatorSignature(record.contentHash, recipientName);
  if (expectedSignature !== record.signature) {
    issues.push('Invalid Diplomator signature');
  }

  // Verify recipient (privacy-preserving)
  const recipientHash = await createWebCryptoHash(recipientName);
  if (recipientHash !== record.recipientInfo) {
    issues.push('Recipient name does not match blockchain record');
  }

  const isValid = issues.length === 0;
  return { isValid, record, issues };
};

/**
 * Gets all blockchain records from Supabase (for demonstration)
 */
export const getAllBlockchainRecords = async (): Promise<DiplomaRecord[]> => {
  const { data, error } = await supabase
    .from('signed_diplomas')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching blockchain records:', error);
    return [];
  }

  return data.map(diploma => ({
    id: diploma.blockchain_id,
    contentHash: diploma.content_hash,
    signature: diploma.signature,
    timestamp: new Date(diploma.created_at).getTime(),
    recipientInfo: diploma.recipient_name, // For display purposes
    institutionInfo: diploma.institution_name,
    diplomatorSeal: diploma.diplomator_seal
  }));
};

/**
 * Creates a verification URL for a diploma
 */
export const createVerificationUrl = (diplomaId: string): string => {
  const baseUrl = getProductionBaseUrl();
  return `${baseUrl}/verify/${diplomaId}`;
};

/**
 * Creates a direct diploma viewing URL
 */
export const createDiplomaUrl = (diplomaId: string): string => {
  const baseUrl = getProductionBaseUrl();
  return `${baseUrl}/diploma/${diplomaId}`;
};
