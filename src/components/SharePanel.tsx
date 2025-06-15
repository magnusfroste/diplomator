
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Share2, Mail, Copy, Check } from 'lucide-react';
import { useDiploma } from '@/contexts/DiplomaContext';
import { supabase } from '@/integrations/supabase/client';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
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

  useEffect(() => {
    const fetchLastDiplomaUrl = async () => {
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Get the most recent diploma URL for this user
        const { data, error } = await supabase
          .from('signed_diplomas')
          .select('diploma_url')
          .eq('issuer_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (data && data.diploma_url) {
          setDiplomaUrl(data.diploma_url);
        } else {
          // Fallback to sessionStorage if no diploma found in database
          const savedDiplomaUrl = sessionStorage.getItem('lastDiplomaUrl');
          if (savedDiplomaUrl) {
            setDiplomaUrl(savedDiplomaUrl);
          } else {
            setDiplomaUrl(window.location.href);
          }
        }
      } catch (error) {
        console.error('Error fetching diploma URL:', error);
        // Fallback to sessionStorage
        const savedDiplomaUrl = sessionStorage.getItem('lastDiplomaUrl');
        if (savedDiplomaUrl) {
          setDiplomaUrl(savedDiplomaUrl);
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
      // Create a temporary div with the diploma content + verification badge
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = `
        <div style="width: 800px; height: 600px; padding: 40px; background: white; position: relative;">
          <style>${diplomaCss}</style>
          ${diplomaHtml}
          <div style="position: absolute; bottom: 20px; right: 20px; background: #2563eb; color: white; padding: 8px 16px; border-radius: 20px; font-size: 12px; font-weight: 600; display: flex; align-items: center; gap: 6px;">
            <span style="font-size: 14px;">🛡️</span>
            Verified by Diplomator
          </div>
        </div>
      `;
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      document.body.appendChild(tempDiv);

      // Convert to canvas
      const canvas = await html2canvas(tempDiv.firstElementChild as HTMLElement, {
        width: 800,
        height: 600,
        scale: 2,
        useCORS: true,
        allowTaint: true
      });

      // Create PDF
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('diploma.pdf');

      // Clean up
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
              💡 Sign your diploma to the blockchain first to get a shareable link for CVs and LinkedIn
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
              PDF will include "Verified by Diplomator" badge
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
            <p className="text-xs text-green-600 mt-1">
              ✅ This is a direct diploma viewing link
            </p>
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
