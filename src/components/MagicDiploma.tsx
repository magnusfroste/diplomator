
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

  const getRandomTemplate = () => {
    const templates = [
      // Template 1: Classic Elegance (Original)
      {
        name: "Classic Elegance",
        html: `
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
        `,
        css: `
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
        `
      },
      
      // Template 2: Modern Minimalist
      {
        name: "Modern Minimalist",
        html: `
          <div class="diploma-container">
            <div class="diploma-paper">
              <div class="geometric-pattern">
                <div class="triangle triangle-1"></div>
                <div class="triangle triangle-2"></div>
                <div class="triangle triangle-3"></div>
              </div>
              
              <div class="diploma-content">
                <div class="modern-header">
                  <div class="header-line"></div>
                  <h1 class="diploma-title">ACHIEVEMENT AWARD</h1>
                  <div class="header-line"></div>
                </div>
                
                <div class="diploma-body">
                  <p class="presentation-text">Presented to</p>
                  <h2 class="recipient-name">${recipientName}</h2>
                  <div class="achievement-box">
                    <p class="achievement-text">
                      ${achievement || 'For outstanding performance and exceptional contribution to excellence'}
                    </p>
                  </div>
                  
                  <div class="signature-section">
                    <div class="signature-group">
                      <div class="signature-line"></div>
                      <p class="signature-label">Authorized Signature</p>
                    </div>
                    <div class="date-stamp">
                      <p class="date-text">${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `,
        css: `
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&family=Montserrat:wght@400;700&display=swap');

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

          .diploma-paper {
            width: 800px;
            height: 600px;
            background: #ffffff;
            border-radius: 8px;
            box-shadow: 
              0 20px 40px rgba(0, 0, 0, 0.15),
              0 8px 16px rgba(0, 0, 0, 0.1);
            position: relative;
            overflow: hidden;
            animation: slideUp 0.8s ease-out;
          }

          @keyframes slideUp {
            from { transform: translateY(30px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }

          .geometric-pattern {
            position: absolute;
            top: 0;
            right: 0;
            width: 200px;
            height: 200px;
            pointer-events: none;
          }

          .triangle {
            position: absolute;
            width: 0;
            height: 0;
            opacity: 0.1;
          }

          .triangle-1 {
            border-left: 60px solid transparent;
            border-right: 60px solid #667eea;
            border-bottom: 60px solid transparent;
            top: 20px;
            right: 20px;
            animation: triangleFloat 6s ease-in-out infinite;
          }

          .triangle-2 {
            border-left: 40px solid transparent;
            border-right: 40px solid #764ba2;
            border-bottom: 40px solid transparent;
            top: 80px;
            right: 60px;
            animation: triangleFloat 6s ease-in-out infinite 2s;
          }

          .triangle-3 {
            border-left: 30px solid transparent;
            border-right: 30px solid #667eea;
            border-bottom: 30px solid transparent;
            top: 40px;
            right: 100px;
            animation: triangleFloat 6s ease-in-out infinite 4s;
          }

          @keyframes triangleFloat {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-10px) rotate(5deg); }
          }

          .diploma-content {
            padding: 80px 60px;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }

          .modern-header {
            text-align: center;
            display: flex;
            align-items: center;
            gap: 20px;
            margin-bottom: 40px;
          }

          .header-line {
            flex: 1;
            height: 2px;
            background: linear-gradient(90deg, transparent, #333, transparent);
          }

          .diploma-title {
            font-family: 'Inter', sans-serif;
            font-size: 32px;
            font-weight: 700;
            color: #333;
            margin: 0;
            letter-spacing: 3px;
            white-space: nowrap;
          }

          .diploma-body {
            text-align: center;
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            gap: 30px;
          }

          .presentation-text {
            font-family: 'Inter', sans-serif;
            font-size: 18px;
            color: #666;
            margin: 0;
            font-weight: 300;
            text-transform: uppercase;
            letter-spacing: 2px;
          }

          .recipient-name {
            font-family: 'Montserrat', sans-serif;
            font-size: 56px;
            font-weight: 700;
            color: #667eea;
            margin: 20px 0;
            position: relative;
          }

          .recipient-name::after {
            content: '';
            position: absolute;
            bottom: -15px;
            left: 50%;
            transform: translateX(-50%);
            width: 100px;
            height: 4px;
            background: linear-gradient(90deg, #667eea, #764ba2);
            border-radius: 2px;
          }

          .achievement-box {
            background: rgba(102, 126, 234, 0.05);
            border-left: 4px solid #667eea;
            padding: 30px;
            margin: 0 auto;
            max-width: 600px;
          }

          .achievement-text {
            font-family: 'Inter', sans-serif;
            font-size: 16px;
            color: #333;
            line-height: 1.6;
            margin: 0;
            font-weight: 400;
          }

          .signature-section {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 50px;
          }

          .signature-group {
            text-align: left;
          }

          .signature-line {
            width: 200px;
            height: 1px;
            background: #333;
            margin-bottom: 10px;
          }

          .signature-label {
            font-family: 'Inter', sans-serif;
            font-size: 14px;
            color: #666;
            margin: 0;
            text-transform: uppercase;
            letter-spacing: 1px;
          }

          .date-stamp {
            text-align: right;
          }

          .date-text {
            font-family: 'Inter', sans-serif;
            font-size: 16px;
            color: #333;
            margin: 0;
            padding: 15px 25px;
            border: 2px solid #667eea;
            border-radius: 4px;
            font-weight: 600;
          }

          @media (max-width: 768px) {
            .diploma-paper {
              width: 95%;
              height: 80vh;
            }
            
            .diploma-title {
              font-size: 24px;
            }
            
            .recipient-name {
              font-size: 40px;
            }
            
            .achievement-text {
              font-size: 14px;
            }
          }
        `
      },

      // Template 3: Royal Vintage
      {
        name: "Royal Vintage",
        html: `
          <div class="diploma-container">
            <div class="diploma-paper">
              <div class="vintage-border">
                <div class="border-corner tl"></div>
                <div class="border-corner tr"></div>
                <div class="border-corner bl"></div>
                <div class="border-corner br"></div>
              </div>
              
              <div class="diploma-content">
                <div class="royal-crown">
                  <div class="crown-shape"></div>
                </div>
                
                <div class="diploma-header">
                  <h1 class="diploma-title">DIPLOMA OF HONOR</h1>
                  <div class="royal-divider">
                    <div class="divider-ornament"></div>
                  </div>
                </div>
                
                <div class="diploma-body">
                  <p class="latin-text">Universitas Excellentiae</p>
                  <p class="presentation-text">Hereby confers upon</p>
                  <h2 class="recipient-name">${recipientName}</h2>
                  <p class="achievement-text">
                    ${achievement || 'The highest honors in recognition of outstanding academic achievement and scholarly excellence'}
                  </p>
                  
                  <div class="signature-section">
                    <div class="signature-area">
                      <div class="wax-seal"></div>
                      <div class="signature-line"></div>
                      <p class="signature-label">Chancellor</p>
                    </div>
                    <div class="date-scroll">
                      <p class="date-text">${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                  </div>
                </div>
                
                <div class="decorative-elements">
                  <div class="laurel-left"></div>
                  <div class="laurel-right"></div>
                </div>
              </div>
            </div>
          </div>
        `,
        css: `
          @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Cinzel+Decorative:wght@700&family=Cormorant+Garamond:ital,wght@0,400;1,400&display=swap');

          .diploma-container {
            width: 100%;
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            background: linear-gradient(135deg, #8B4513 0%, #D2691E 100%);
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
            background: url('data:image/svg+xml,<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
            opacity: 0.3;
            pointer-events: none;
          }

          .diploma-paper {
            width: 800px;
            height: 600px;
            background: linear-gradient(145deg, #faf7f2, #f5f2e8);
            border-radius: 15px;
            box-shadow: 
              0 30px 60px rgba(0, 0, 0, 0.3),
              0 15px 30px rgba(0, 0, 0, 0.2),
              inset 0 2px 0 rgba(255, 255, 255, 0.9);
            position: relative;
            overflow: hidden;
            animation: royalEntry 1s ease-out;
          }

          @keyframes royalEntry {
            from { transform: scale(0.8) rotateY(10deg); opacity: 0; }
            to { transform: scale(1) rotateY(0deg); opacity: 1; }
          }

          .vintage-border {
            position: absolute;
            top: 25px;
            left: 25px;
            right: 25px;
            bottom: 25px;
            border: 4px solid;
            border-image: linear-gradient(45deg, #8B4513, #D2691E, #8B4513) 1;
            border-radius: 10px;
          }

          .border-corner {
            position: absolute;
            width: 50px;
            height: 50px;
            background: radial-gradient(circle, #D2691E, #8B4513);
            border-radius: 50%;
            border: 2px solid #8B4513;
          }

          .border-corner.tl { top: -25px; left: -25px; }
          .border-corner.tr { top: -25px; right: -25px; }
          .border-corner.bl { bottom: -25px; left: -25px; }
          .border-corner.br { bottom: -25px; right: -25px; }

          .diploma-content {
            padding: 70px 50px;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-between;
            position: relative;
          }

          .royal-crown {
            position: absolute;
            top: 30px;
            left: 50%;
            transform: translateX(-50%);
          }

          .crown-shape {
            width: 60px;
            height: 40px;
            background: linear-gradient(145deg, #FFD700, #FFA500);
            clip-path: polygon(50% 0%, 0% 100%, 20% 80%, 35% 90%, 50% 75%, 65% 90%, 80% 80%, 100% 100%);
            animation: crownGlow 3s ease-in-out infinite;
          }

          @keyframes crownGlow {
            0%, 100% { filter: brightness(1) drop-shadow(0 0 5px rgba(255, 215, 0, 0.5)); }
            50% { filter: brightness(1.2) drop-shadow(0 0 15px rgba(255, 215, 0, 0.8)); }
          }

          .diploma-header {
            text-align: center;
            margin-bottom: 30px;
          }

          .diploma-title {
            font-family: 'Cinzel Decorative', serif;
            font-size: 40px;
            font-weight: 700;
            color: #2F1B14;
            margin: 0;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
            letter-spacing: 2px;
          }

          .royal-divider {
            margin: 20px 0;
            display: flex;
            justify-content: center;
          }

          .divider-ornament {
            width: 150px;
            height: 6px;
            background: linear-gradient(90deg, transparent 0%, #8B4513 20%, #D2691E 50%, #8B4513 80%, transparent 100%);
            border-radius: 3px;
            position: relative;
          }

          .divider-ornament::before,
          .divider-ornament::after {
            content: '';
            position: absolute;
            top: -3px;
            width: 12px;
            height: 12px;
            background: #D2691E;
            border-radius: 50%;
          }

          .divider-ornament::before { left: 30px; }
          .divider-ornament::after { right: 30px; }

          .diploma-body {
            text-align: center;
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            gap: 25px;
          }

          .latin-text {
            font-family: 'Cinzel', serif;
            font-size: 16px;
            color: #8B4513;
            margin: 0;
            font-style: italic;
            text-transform: uppercase;
            letter-spacing: 1px;
          }

          .presentation-text {
            font-family: 'Cormorant Garamond', serif;
            font-size: 22px;
            color: #5D4037;
            margin: 0;
            font-style: italic;
          }

          .recipient-name {
            font-family: 'Cinzel', serif;
            font-size: 52px;
            font-weight: 600;
            color: #8B4513;
            margin: 25px 0;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
            position: relative;
          }

          .recipient-name::before,
          .recipient-name::after {
            content: '❦';
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            color: #D2691E;
            font-size: 24px;
          }

          .recipient-name::before { left: -50px; }
          .recipient-name::after { right: -50px; }

          .achievement-text {
            font-family: 'Cormorant Garamond', serif;
            font-size: 18px;
            color: #5D4037;
            line-height: 1.7;
            max-width: 600px;
            margin: 0 auto;
            font-style: italic;
          }

          .signature-section {
            display: flex;
            justify-content: space-between;
            align-items: end;
            margin-top: 40px;
            width: 100%;
          }

          .signature-area {
            display: flex;
            align-items: end;
            gap: 20px;
          }

          .wax-seal {
            width: 50px;
            height: 50px;
            background: radial-gradient(circle, #8B0000, #A0522D);
            border-radius: 50%;
            position: relative;
            border: 3px solid #654321;
          }

          .wax-seal::before {
            content: 'S';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: #FFD700;
            font-family: 'Cinzel Decorative', serif;
            font-size: 24px;
            font-weight: bold;
          }

          .signature-line {
            width: 180px;
            height: 2px;
            background: linear-gradient(90deg, transparent, #8B4513, transparent);
            margin-bottom: 10px;
          }

          .signature-label {
            font-family: 'Cinzel', serif;
            font-size: 14px;
            color: #5D4037;
            margin: 0;
            text-transform: uppercase;
            letter-spacing: 1px;
          }

          .date-scroll {
            background: linear-gradient(145deg, #f5f2e8, #ede7d3);
            padding: 15px 25px;
            border: 2px solid #8B4513;
            border-radius: 20px;
            box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
          }

          .date-text {
            font-family: 'Cinzel', serif;
            font-size: 16px;
            color: #2F1B14;
            margin: 0;
            font-weight: 600;
          }

          .decorative-elements {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            pointer-events: none;
          }

          .laurel-left,
          .laurel-right {
            position: absolute;
            width: 80px;
            height: 120px;
            background: linear-gradient(45deg, rgba(139, 69, 19, 0.1), rgba(210, 105, 30, 0.1));
            border-radius: 40px 10px;
          }

          .laurel-left {
            top: 50%;
            left: 20px;
            transform: translateY(-50%) rotate(-15deg);
            animation: laurelSway 8s ease-in-out infinite;
          }

          .laurel-right {
            top: 50%;
            right: 20px;
            transform: translateY(-50%) rotate(15deg) scaleX(-1);
            animation: laurelSway 8s ease-in-out infinite 4s;
          }

          @keyframes laurelSway {
            0%, 100% { transform: translateY(-50%) rotate(-15deg); }
            50% { transform: translateY(-50%) rotate(-10deg); }
          }

          @media (max-width: 768px) {
            .diploma-paper {
              width: 95%;
              height: 80vh;
            }
            
            .diploma-title {
              font-size: 28px;
            }
            
            .recipient-name {
              font-size: 36px;
            }
            
            .achievement-text {
              font-size: 16px;
            }
          }
        `
      }
    ];

    return templates[Math.floor(Math.random() * templates.length)];
  };

  const generateMagicDiploma = () => {
    if (!recipientName.trim()) return;
    
    setIsGenerating(true);
    
    const selectedTemplate = getRandomTemplate();
    
    // Set the generated diploma
    setDiplomaHtml(selectedTemplate.html);
    setDiplomaCss(selectedTemplate.css);

    // Add a message to show what was generated
    const newMessage = {
      id: Date.now().toString(),
      content: `✨ Magic diploma created for ${recipientName}! Generated "${selectedTemplate.name}" template with premium styling, unique animations, and professional design elements.`,
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
              Create instantly impressive diplomas with randomly selected premium templates
            </p>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-900">Random Premium Templates</span>
            </div>
            <ul className="text-xs text-purple-800 space-y-1">
              <li className="flex items-center gap-2">
                <Crown className="w-3 h-3" />
                Classic Elegance - Golden ornate design
              </li>
              <li className="flex items-center gap-2">
                <Star className="w-3 h-3" />
                Modern Minimalist - Clean geometric style
              </li>
              <li className="flex items-center gap-2">
                <Award className="w-3 h-3" />
                Royal Vintage - Regal historical theme
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
                Leave blank for template-specific default message
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
