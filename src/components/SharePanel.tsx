import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Share2, Mail, Copy, Check } from 'lucide-react';
import { useDiploma } from '@/contexts/DiplomaContext';
import { supabase } from '@/integrations/supabase/client';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { QRCodeGenerator } from '@/components/QRCodeGenerator';
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsappIcon
} from 'react-share';

export const SharePanel = () => {
  const { diplomaHtml, diplomaCss } = useDiploma();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [copied, setCopied] = useState(false);
  const [diplomaUrl, setDiplomaUrl] = useState('');
  const [currentDiplomaId, setCurrentDiplomaId] = useState('');

  useEffect(() => {
    const fetchLastDiplomaUrl = async () => {
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Get the most recent diploma URL for this user
        const { data, error } = await supabase
          .from('signed_diplomas')
          .select('diploma_url, blockchain_id')
          .eq('issuer_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (data && data.diploma_url) {
          setDiplomaUrl(data.diploma_url);
          setCurrentDiplomaId(data.blockchain_id);
        } else {
          // Fallback to sessionStorage if no diploma found in database
          const savedDiplomaUrl = sessionStorage.getItem('lastDiplomaUrl');
          const savedDiplomaId = sessionStorage.getItem('lastDiplomaId');
          if (savedDiplomaUrl) {
            setDiplomaUrl(savedDiplomaUrl);
            setCurrentDiplomaId(savedDiplomaId || '');
          } else {
            setDiplomaUrl(window.location.href);
          }
        }
      } catch (error) {
        console.error('Error fetching diploma URL:', error);
        // Fallback to sessionStorage
        const savedDiplomaUrl = sessionStorage.getItem('lastDiplomaUrl');
        const savedDiplomaId = sessionStorage.getItem('lastDiplomaId');
        if (savedDiplomaUrl) {
          setDiplomaUrl(savedDiplomaUrl);
          setCurrentDiplomaId(savedDiplomaId || '');
        } else {
          setDiplomaUrl(window.location.href);
        }
      }
    };

    fetchLastDiplomaUrl();
  }, []);

  const shareUrl = diplomaUrl || window.location.href;
  const shareTitle = "Check out my diploma created with Diploma Generator!";

  const generatePDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const verificationUrl = currentDiplomaId 
        ? `${window.location.origin}/verify/${currentDiplomaId}`
        : shareUrl;
      
      // Create a temporary div with balanced containment
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = `
        <div style="width: 800px; height: 600px; padding: 20px; background: white; position: relative; overflow: hidden;">
          <style>
            ${diplomaCss}
            /* Balanced containment styles */
            * {
              box-sizing: border-box !important;
            }
            .diploma-container {
              width: 100% !important;
              height: 100% !important;
              position: relative !important;
              overflow: hidden !important;
            }
            .diploma-container * {
              max-width: 95% !important;
              box-sizing: border-box !important;
            }
            /* Handle absolutely positioned elements */
            .diploma-container [style*="position: absolute"],
            .diploma-container [style*="position:absolute"] {
              max-width: 90% !important;
            }
          </style>
          <div class="diploma-container">
            ${diplomaHtml}
          </div>
          
          <!-- Verification Badge -->
          <div style="position: absolute; top: 12px; right: 12px; background: rgba(37, 99, 235, 0.95); color: white; padding: 6px 12px; border-radius: 15px; font-size: 11px; font-weight: 600; display: flex; align-items: center; gap: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.15); z-index: 1000; backdrop-filter: blur(4px);">
            <span style="font-size: 12px;">🛡️</span>
            Verified by Diplomator
          </div>
          
          ${currentDiplomaId ? `
          <!-- QR Code and ID -->
          <div style="position: absolute; bottom: 12px; left: 12px; text-align: center; z-index: 1000;">
            <div style="background: rgba(255, 255, 255, 0.95); padding: 6px; border-radius: 6px; border: 2px solid #e5e7eb; margin-bottom: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); backdrop-filter: blur(4px);">
              <div id="qr-code-container" style="width: 60px; height: 60px; display: flex; align-items: center; justify-content: center;"></div>
            </div>
            <div style="font-size: 8px; color: #444; font-family: 'Courier New', monospace; word-break: break-all; max-width: 72px; background: rgba(255, 255, 255, 0.9); padding: 2px 4px; border-radius: 3px; border: 1px solid #d1d5db; font-weight: 500;">
              ${currentDiplomaId}
            </div>
          </div>
          ` : ''}
        </div>
      `;
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '0';
      document.body.appendChild(tempDiv);

      // Add QR code if available
      if (currentDiplomaId) {
        const qrContainer = tempDiv.querySelector('#qr-code-container') as HTMLElement;
        if (qrContainer) {
          const qrDiv = document.createElement('div');
          qrDiv.innerHTML = `
            <svg width="60" height="60" viewBox="0 0 60 60" style="background: white;">
              <rect width="60" height="60" fill="white"/>
              <rect x="5" y="5" width="50" height="50" fill="none" stroke="black" stroke-width="1"/>
              <rect x="8" y="8" width="12" height="12" fill="black"/>
              <rect x="40" y="8" width="12" height="12" fill="black"/>
              <rect x="8" y="40" width="12" height="12" fill="black"/>
              <rect x="26" y="26" width="8" height="8" fill="black"/>
              <text x="30" y="32" text-anchor="middle" font-size="3" fill="white">QR</text>
            </svg>
          `;
          qrContainer.appendChild(qrDiv.firstElementChild as HTMLElement);
        }
      }

      // Convert to canvas with improved settings
      const canvas = await html2canvas(tempDiv.firstElementChild as HTMLElement, {
        width: 800,
        height: 600,
        scale: 2.5,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        removeContainer: true,
        onclone: (clonedDoc) => {
          const clonedContainer = clonedDoc.querySelector('.diploma-container') as HTMLElement;
          if (clonedContainer) {
            clonedContainer.style.overflow = 'hidden';
          }
        }
      });

      // Create PDF with better proportions
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png', 0.95);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const aspectRatio = 600 / 800;
      let finalWidth = pdfWidth;
      let finalHeight = pdfWidth * aspectRatio;
      
      if (finalHeight > pdfHeight) {
        finalHeight = pdfHeight;
        finalWidth = pdfHeight / aspectRatio;
      }
      
      const xOffset = (pdfWidth - finalWidth) / 2;
      const yOffset = (pdfHeight - finalHeight) / 2;
      
      pdf.addImage(imgData, 'PNG', xOffset, yOffset, finalWidth, finalHeight);
      pdf.save('diploma.pdf');

      document.body.removeChild(tempDiv);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent(shareTitle);
    const body = encodeURIComponent(`I created this diploma using the Diploma Generator. Check it out: ${shareUrl}`);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          url: shareUrl
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
  };

  const hasContent = diplomaHtml || diplomaCss;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Share2 className="w-5 h-5" />
          Share & Export
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Download your diploma or share it with others
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Note about signing */}
        {hasContent && !diplomaUrl.includes('/diploma/') && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              💡 Sign your diploma to the blockchain first to get a shareable link and QR code for CVs and LinkedIn
            </p>
          </div>
        )}

        {/* PDF Download */}
        <div>
          <h4 className="text-sm font-medium mb-2">Export</h4>
          <Button
            onClick={generatePDF}
            disabled={!hasContent || isGeneratingPDF}
            className="w-full"
          >
            <Download className="w-4 h-4 mr-2" />
            {isGeneratingPDF ? 'Generating PDF...' : 'Download as PDF'}
          </Button>
          {hasContent && (
            <p className="text-xs text-muted-foreground mt-1">
              PDF will include "Verified by Diplomator" badge{currentDiplomaId ? ' and QR code for verification' : ''}
            </p>
          )}
        </div>

        {/* Copy Link */}
        <div>
          <h4 className="text-sm font-medium mb-2">
            {diplomaUrl.includes('/diploma/') ? 'Share Diploma Link' : 'Copy Link'}
          </h4>
          <Button
            variant="outline"
            onClick={copyToClipboard}
            className="w-full"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                Copy Link
              </>
            )}
          </Button>
          {diplomaUrl.includes('/diploma/') && (
            <div className="mt-2">
              <p className="text-xs text-green-600 mb-1">
                ✅ This is a direct diploma viewing link with QR verification
              </p>
              {currentDiplomaId && (
                <div className="text-center p-2 bg-gray-50 rounded border">
                  <div className="mb-2">
                    <QRCodeGenerator 
                      value={`${window.location.origin}/verify/${currentDiplomaId}`}
                      size={60}
                    />
                  </div>
                  <p className="text-xs text-gray-600 font-mono">
                    {currentDiplomaId}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    QR leads to verification page
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Social Sharing */}
        <div>
          <h4 className="text-sm font-medium mb-2">Share on Social Media</h4>
          <div className="grid grid-cols-2 gap-2">
            <FacebookShareButton url={shareUrl} hashtag="#diploma">
              <div className="flex items-center gap-2 p-2 rounded border hover:bg-muted transition-colors w-full">
                <FacebookIcon size={20} round />
                <span className="text-sm">Facebook</span>
              </div>
            </FacebookShareButton>

            <TwitterShareButton url={shareUrl} title={shareTitle}>
              <div className="flex items-center gap-2 p-2 rounded border hover:bg-muted transition-colors w-full">
                <TwitterIcon size={20} round />
                <span className="text-sm">Twitter</span>
              </div>
            </TwitterShareButton>

            <LinkedinShareButton url={shareUrl} title={shareTitle}>
              <div className="flex items-center gap-2 p-2 rounded border hover:bg-muted transition-colors w-full">
                <LinkedinIcon size={20} round />
                <span className="text-sm">LinkedIn</span>
              </div>
            </LinkedinShareButton>

            <WhatsappShareButton url={shareUrl} title={shareTitle}>
              <div className="flex items-center gap-2 p-2 rounded border hover:bg-muted transition-colors w-full">
                <WhatsappIcon size={20} round />
                <span className="text-sm">WhatsApp</span>
              </div>
            </WhatsappShareButton>
          </div>
        </div>

        {/* Email & Native Share */}
        <div className="space-y-2">
          <Button
            variant="outline"
            onClick={shareViaEmail}
            className="w-full"
          >
            <Mail className="w-4 h-4 mr-2" />
            Share via Email
          </Button>

          {navigator.share && (
            <Button
              variant="outline"
              onClick={nativeShare}
              className="w-full"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
