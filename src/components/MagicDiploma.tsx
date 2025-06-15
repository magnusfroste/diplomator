
import React, { useState } from 'react';
import { Wand2, Sparkles, Award, Crown, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDiploma } from '@/contexts/DiplomaContext';

export const MagicDiploma = () => {
  const [recipientName, setRecipientName] = useState('');
  const [achievement, setAchievement] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  const { setDiplomaHtml, setDiplomaCss, setMessages } = useDiploma();

  const generateMagicDiploma = () => {
    if (!recipientName.trim()) return;
    
    setIsGenerating(true);
    
    // Create an impressive, elegant diploma
    const magicHtml = `
      <div class="diploma-container">
        <div class="diploma-paper">
          <div class="ornate-border">
            <div class="corner-decoration top-left"></div>
            <div class="corner-decoration top-right"></div>
            <div class="corner-decoration bottom-left"></div>
            <div class="corner-decoration bottom-right"></div>
          </div>
          
          <div class="diploma-content">
            <div class="institution-seal">
              <div class="seal-outer">
                <div class="seal-inner">
                  <div class="seal-star"></div>
                  <div class="seal-text">EXCELLENCE</div>
                </div>
              </div>
            </div>
            
            <div class="diploma-header">
              <h1 class="diploma-title">Certificate of Excellence</h1>
              <div class="title-underline"></div>
            </div>
            
            <div class="diploma-body">
              <p class="presentation-text">This is to certify that</p>
              <h2 class="recipient-name">${recipientName}</h2>
              <p class="achievement-text">
                ${achievement || 'has demonstrated exceptional dedication, skill, and achievement in their chosen field of study'}
              </p>
              <div class="signature-section">
                <div class="signature-line">
                  <div class="signature-placeholder"></div>
                  <p class="signature-label">Director</p>
                </div>
                <div class="date-section">
                  <p class="date-text">${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
              </div>
            </div>
            
            <div class="floating-elements">
              <div class="floating-star star-1"></div>
              <div class="floating-star star-2"></div>
              <div class="floating-star star-3"></div>
            </div>
          </div>
        </div>
      </div>
    `;

    const magicCss = `
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Dancing+Script:wght@700&display=swap');

      .diploma-container {
        width: 100%;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 20px;
        position: relative;
        overflow: hidden;
      }

      .diploma-container::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: 
          radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
        pointer-events: none;
      }

      .diploma-paper {
        width: 800px;
        height: 600px;
        background: linear-gradient(145deg, #ffffff, #f8f9fa);
        border-radius: 20px;
        box-shadow: 
          0 25px 50px rgba(0, 0, 0, 0.2),
          0 10px 20px rgba(0, 0, 0, 0.1),
          inset 0 1px 0 rgba(255, 255, 255, 0.8);
        position: relative;
        overflow: hidden;
        transform: perspective(1000px) rotateX(5deg);
        animation: diplomaFloat 6s ease-in-out infinite;
      }

      @keyframes diplomaFloat {
        0%, 100% { transform: perspective(1000px) rotateX(5deg) translateY(0px); }
        50% { transform: perspective(1000px) rotateX(5deg) translateY(-10px); }
      }

      .ornate-border {
        position: absolute;
        top: 20px;
        left: 20px;
        right: 20px;
        bottom: 20px;
        border: 3px solid;
        border-image: linear-gradient(45deg, #d4af37, #ffd700, #d4af37) 1;
        border-radius: 15px;
      }

      .corner-decoration {
        position: absolute;
        width: 40px;
        height: 40px;
        background: radial-gradient(circle, #d4af37, #ffd700);
        border-radius: 50%;
      }

      .corner-decoration.top-left { top: -20px; left: -20px; }
      .corner-decoration.top-right { top: -20px; right: -20px; }
      .corner-decoration.bottom-left { bottom: -20px; left: -20px; }
      .corner-decoration.bottom-right { bottom: -20px; right: -20px; }

      .diploma-content {
        padding: 60px 40px;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        position: relative;
      }

      .institution-seal {
        position: absolute;
        top: 20px;
        right: 40px;
      }

      .seal-outer {
        width: 80px;
        height: 80px;
        border: 3px solid #d4af37;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        background: linear-gradient(145deg, #ffffff, #f0f0f0);
        animation: sealSpin 20s linear infinite;
      }

      @keyframes sealSpin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }

      .seal-inner {
        width: 60px;
        height: 60px;
        border: 2px solid #d4af37;
        border-radius: 50%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background: linear-gradient(145deg, #ffd700, #d4af37);
      }

      .seal-star {
        width: 20px;
        height: 20px;
        background: #fff;
        clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
        margin-bottom: 2px;
      }

      .seal-text {
        font-size: 8px;
        font-weight: bold;
        color: #fff;
        text-align: center;
      }

      .diploma-header {
        text-align: center;
        margin-bottom: 20px;
      }

      .diploma-title {
        font-family: 'Playfair Display', serif;
        font-size: 42px;
        font-weight: 700;
        color: #2c3e50;
        margin: 0;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
        background: linear-gradient(135deg, #2c3e50, #3498db);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .title-underline {
        width: 200px;
        height: 3px;
        background: linear-gradient(90deg, transparent, #d4af37, transparent);
        margin: 10px auto;
        border-radius: 2px;
      }

      .diploma-body {
        text-align: center;
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 20px;
      }

      .presentation-text {
        font-family: 'Playfair Display', serif;
        font-size: 24px;
        color: #34495e;
        margin: 0;
        font-style: italic;
      }

      .recipient-name {
        font-family: 'Dancing Script', cursive;
        font-size: 48px;
        font-weight: 700;
        color: #e74c3c;
        margin: 20px 0;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
        position: relative;
      }

      .recipient-name::after {
        content: '';
        position: absolute;
        bottom: -10px;
        left: 50%;
        transform: translateX(-50%);
        width: 80%;
        height: 2px;
        background: linear-gradient(90deg, transparent, #e74c3c, transparent);
      }

      .achievement-text {
        font-family: 'Playfair Display', serif;
        font-size: 18px;
        color: #2c3e50;
        line-height: 1.6;
        max-width: 600px;
        margin: 0 auto;
      }

      .signature-section {
        display: flex;
        justify-content: space-between;
        align-items: end;
        margin-top: 40px;
        width: 100%;
      }

      .signature-line {
        text-align: center;
      }

      .signature-placeholder {
        width: 200px;
        height: 2px;
        background: linear-gradient(90deg, transparent, #2c3e50, transparent);
        margin-bottom: 10px;
      }

      .signature-label {
        font-family: 'Playfair Display', serif;
        font-size: 16px;
        color: #2c3e50;
        margin: 0;
      }

      .date-section {
        text-align: center;
      }

      .date-text {
        font-family: 'Playfair Display', serif;
        font-size: 16px;
        color: #2c3e50;
        margin: 0;
        padding: 10px 20px;
        border: 2px solid #d4af37;
        border-radius: 10px;
        background: linear-gradient(145deg, #ffffff, #f8f9fa);
      }

      .floating-elements {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        pointer-events: none;
      }

      .floating-star {
        position: absolute;
        width: 12px;
        height: 12px;
        background: linear-gradient(45deg, #ffd700, #d4af37);
        clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
        animation: starFloat 8s ease-in-out infinite;
      }

      .star-1 {
        top: 20%;
        left: 10%;
        animation-delay: 0s;
      }

      .star-2 {
        top: 60%;
        right: 15%;
        animation-delay: 2s;
      }

      .star-3 {
        bottom: 20%;
        left: 20%;
        animation-delay: 4s;
      }

      @keyframes starFloat {
        0%, 100% { 
          transform: translateY(0px) rotate(0deg); 
          opacity: 0.7;
        }
        50% { 
          transform: translateY(-20px) rotate(180deg); 
          opacity: 1;
        }
      }

      @media (max-width: 768px) {
        .diploma-paper {
          width: 95%;
          height: 80vh;
          transform: none;
        }
        
        .diploma-title {
          font-size: 32px;
        }
        
        .recipient-name {
          font-size: 36px;
        }
        
        .achievement-text {
          font-size: 16px;
        }
      }
    `;

    // Set the generated diploma
    setDiplomaHtml(magicHtml);
    setDiplomaCss(magicCss);

    // Add a message to show what was generated
    const newMessage = {
      id: Date.now().toString(),
      content: `✨ Magic diploma created for ${recipientName}! This elegant certificate features premium styling with golden accents, floating animations, and a professional layout that's sure to impress.`,
      isUser: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setIsGenerating(false);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-md mx-auto space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wand2 className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Magic Diploma</h2>
            <p className="text-gray-600 text-sm">
              Create an instantly impressive, elegant diploma with premium styling and animations
            </p>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-900">Premium Features</span>
            </div>
            <ul className="text-xs text-purple-800 space-y-1">
              <li className="flex items-center gap-2">
                <Crown className="w-3 h-3" />
                Golden ornate borders & decorations
              </li>
              <li className="flex items-center gap-2">
                <Star className="w-3 h-3" />
                Floating animations & visual effects
              </li>
              <li className="flex items-center gap-2">
                <Award className="w-3 h-3" />
                Professional institutional seal
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recipient Name *
              </label>
              <Input
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="Enter the recipient's name"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Achievement (Optional)
              </label>
              <Input
                value={achievement}
                onChange={(e) => setAchievement(e.target.value)}
                placeholder="Custom achievement description"
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">
                Leave blank for default excellence message
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-gray-200">
        <Button
          onClick={generateMagicDiploma}
          disabled={!recipientName.trim() || isGenerating}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-3"
        >
          {isGenerating ? (
            <>
              <Sparkles className="w-4 h-4 mr-2 animate-spin" />
              Creating Magic...
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4 mr-2" />
              Create Magic Diploma
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
