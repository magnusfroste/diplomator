
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
        // HTML comments first
        .replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span style="color: #6a737d; font-style: italic;">$1</span>')
        // HTML tags - simplified approach
        .replace(/(&lt;\/?)([a-zA-Z][a-zA-Z0-9-]*)(.*?)(&gt;)/g, (match, openTag, tagName, attributes, closeTag) => {
          const styledTag = `<span style="color: #22863a; font-weight: 600;">${openTag}${tagName}</span>`;
          const styledAttributes = attributes.replace(/([a-zA-Z-]+)=(&quot;[^&]*?&quot;|&#x27;[^&]*?&#x27;)/g, 
            '<span style="color: #6f42c1;">$1</span>=<span style="color: #032f62;">$2</span>');
          const styledClose = `<span style="color: #22863a; font-weight: 600;">${closeTag}</span>`;
          return styledTag + styledAttributes + styledClose;
        });
    } else if (lang === 'css') {
      return code
        // CSS comments first
        .replace(/(\/\*[\s\S]*?\*\/)/g, '<span style="color: #6a737d; font-style: italic;">$1</span>')
        // CSS selectors (simplified)
        .replace(/^(\s*)([.#]?[a-zA-Z][a-zA-Z0-9_-]*|\*|::[a-zA-Z-]+|:[a-zA-Z-]+)(\s*\{)/gm, 
          '$1<span style="color: #6f42c1; font-weight: 600;">$2</span>$3')
        // CSS properties (property: value;)
        .replace(/(\s+)([a-zA-Z-]+)(\s*:\s*)([^;}]+)(;?)/g, 
          '$1<span style="color: #005cc5; font-weight: 500;">$2</span><span style="color: #6f42c1;">$3</span><span style="color: #032f62;">$4</span>$5')
        // !important
        .replace(/(!important)/g, '<span style="color: #d73a49; font-weight: 700;">$1</span>');
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
      <div className="absolute inset-0 bg-slate-50 dark:bg-slate-900 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
        {/* Syntax highlighting overlay */}
        <pre
          ref={highlightRef}
          className="absolute inset-0 p-4 m-0 text-transparent bg-transparent overflow-auto whitespace-pre-wrap break-words pointer-events-none z-10 font-mono text-sm leading-6 tab-size-2"
          style={{ 
            fontFamily: "'JetBrains Mono', 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace",
            tabSize: 2 
          }}
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
        />
        
        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onScroll={syncScroll}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="absolute inset-0 p-4 m-0 border-0 outline-0 bg-transparent resize-none overflow-auto whitespace-pre-wrap break-words z-20 font-mono text-sm leading-6 text-slate-900 dark:text-slate-100 tab-size-2"
          style={{ 
            fontFamily: "'JetBrains Mono', 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace",
            tabSize: 2,
            caretColor: '#3b82f6'
          }}
          spellCheck={false}
        />
        
        {/* Placeholder styling */}
        {!value && (
          <div className="absolute inset-0 p-4 pointer-events-none text-slate-400 dark:text-slate-500 font-mono text-sm leading-6 z-5">
            {placeholder}
          </div>
        )}
      </div>
    </div>
  );
};
