
import React, { useRef, useEffect, useState } from 'react';

interface SyntaxHighlightedEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: 'html' | 'css';
  placeholder?: string;
}

export const SyntaxHighlightedEditor: React.FC<SyntaxHighlightedEditorProps> = ({
  value,
  onChange,
  language,
  placeholder
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLPreElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  const highlightSyntax = (code: string, lang: 'html' | 'css') => {
    if (!code) return '';

    if (lang === 'html') {
      return code
        // HTML tags
        .replace(/(&lt;\/?)([a-zA-Z][a-zA-Z0-9]*)(.*?)(&gt;)/g, 
          '<span class="tag-bracket">$1</span><span class="tag-name">$2</span><span class="attr">$3</span><span class="tag-bracket">$4</span>')
        // Attributes
        .replace(/(\s+)([a-zA-Z-]+)(=)/g, '$1<span class="attr-name">$2</span><span class="operator">$3</span>')
        // Attribute values
        .replace(/(=)(&quot;[^&]*?&quot;|&#x27;[^&]*?&#x27;)/g, '$1<span class="string">$2</span>')
        // Comments
        .replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span class="comment">$1</span>');
    } else if (lang === 'css') {
      return code
        // CSS selectors
        .replace(/^(\s*)([.#]?[a-zA-Z][a-zA-Z0-9_-]*|\*|::?[a-zA-Z-]+)(\s*{)/gm, 
          '$1<span class="selector">$2</span>$3')
        // CSS properties
        .replace(/(\s+)([a-zA-Z-]+)(\s*:)/g, '$1<span class="property">$2</span><span class="operator">$3</span>')
        // CSS values
        .replace(/(:\s*)([^;{}]+)(;?)/g, '$1<span class="value">$2</span>$3')
        // Comments
        .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="comment">$1</span>')
        // Important
        .replace(/(!important)/g, '<span class="important">$1</span>');
    }

    return code;
  };

  const escapeHtml = (unsafe: string) => {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;");
  };

  const syncScroll = () => {
    if (textareaRef.current && highlightRef.current) {
      highlightRef.current.scrollTop = textareaRef.current.scrollTop;
      highlightRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  useEffect(() => {
    syncScroll();
  }, [value]);

  const highlightedCode = highlightSyntax(escapeHtml(value), language);

  return (
    <div className="relative h-full">
      <style>{`
        .syntax-editor {
          position: relative;
          font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', 'Source Code Pro', monospace;
          font-size: 14px;
          line-height: 1.5;
          border-radius: 8px;
          overflow: hidden;
          background: hsl(var(--background));
          height: 100%;
          min-height: 400px;
        }
        
        .syntax-highlight {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          padding: 20px;
          margin: 0;
          color: transparent;
          background: transparent;
          overflow: auto;
          white-space: pre-wrap;
          word-wrap: break-word;
          pointer-events: none;
          z-index: 1;
          tab-size: 2;
          font-family: inherit;
          font-size: inherit;
          line-height: inherit;
        }
        
        .syntax-textarea {
          position: relative;
          width: 100%;
          height: 100%;
          padding: 20px;
          margin: 0;
          border: none;
          outline: none;
          background: transparent;
          color: hsl(var(--foreground));
          font-family: inherit;
          font-size: inherit;
          line-height: inherit;
          white-space: pre-wrap;
          word-wrap: break-word;
          overflow: auto;
          resize: none;
          z-index: 2;
          tab-size: 2;
        }
        
        .syntax-textarea::placeholder {
          color: hsl(var(--muted-foreground));
          opacity: 0.7;
        }
        
        .syntax-textarea:focus {
          outline: none;
        }
        
        /* Enhanced Syntax highlighting colors */
        .tag-bracket { 
          color: #8B5CF6; 
          font-weight: 500; 
        }
        .tag-name { 
          color: #2563EB; 
          font-weight: 600; 
        }
        .attr-name { 
          color: #D97706; 
          font-weight: 500; 
        }
        .string { 
          color: #059669; 
          font-weight: 500; 
        }
        .comment { 
          color: #6B7280; 
          font-style: italic; 
          opacity: 0.8;
        }
        .operator { 
          color: #8B5CF6; 
          font-weight: 500; 
        }
        .selector { 
          color: #7C3AED; 
          font-weight: 600; 
        }
        .property { 
          color: #2563EB; 
          font-weight: 500; 
        }
        .value { 
          color: #059669; 
          font-weight: 500; 
        }
        .important { 
          color: #DC2626; 
          font-weight: 700; 
        }
        
        /* Dark mode adjustments */
        .dark .tag-bracket { color: #A78BFA; }
        .dark .tag-name { color: #60A5FA; }
        .dark .attr-name { color: #FBBF24; }
        .dark .string { color: #34D399; }
        .dark .comment { color: #9CA3AF; }
        .dark .operator { color: #A78BFA; }
        .dark .selector { color: #A78BFA; }
        .dark .property { color: #60A5FA; }
        .dark .value { color: #34D399; }
        .dark .important { color: #F87171; }
      `}</style>
      
      <div className="syntax-editor">
        <pre
          ref={highlightRef}
          className="syntax-highlight"
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
        />
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onScroll={syncScroll}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="syntax-textarea"
          spellCheck={false}
        />
      </div>
    </div>
  );
};
