
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
          '<span class="tag">$1</span><span class="tag-name">$2</span><span class="attr">$3</span><span class="tag">$4</span>')
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
    <div className="relative">
      <style>{`
        .syntax-editor {
          position: relative;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace;
          font-size: 12px;
          line-height: 1.5;
          border-radius: 6px;
          overflow: hidden;
          border: 1px solid #e2e8f0;
        }
        
        .syntax-highlight {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          padding: 12px;
          margin: 0;
          color: transparent;
          background: white;
          overflow: auto;
          white-space: pre-wrap;
          word-wrap: break-word;
          pointer-events: none;
          z-index: 1;
        }
        
        .syntax-textarea {
          position: relative;
          width: 100%;
          height: 150px;
          padding: 12px;
          margin: 0;
          border: none;
          outline: none;
          background: transparent;
          color: #1a202c;
          font-family: inherit;
          font-size: inherit;
          line-height: inherit;
          white-space: pre-wrap;
          word-wrap: break-word;
          overflow: auto;
          resize: vertical;
          z-index: 2;
        }
        
        .syntax-textarea::placeholder {
          color: #a0aec0;
        }
        
        /* Syntax highlighting colors */
        .tag { color: #e53e3e; }
        .tag-name { color: #3182ce; font-weight: 600; }
        .attr-name { color: #d69e2e; }
        .string { color: #38a169; }
        .comment { color: #718096; font-style: italic; }
        .operator { color: #4a5568; }
        .selector { color: #805ad5; font-weight: 600; }
        .property { color: #3182ce; }
        .value { color: #38a169; }
        .important { color: #e53e3e; font-weight: 600; }
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
