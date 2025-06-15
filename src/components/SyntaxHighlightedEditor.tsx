
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
        // HTML comments first (to avoid interfering with other patterns)
        .replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span style="color: #6B7280; font-style: italic; opacity: 0.8;">$1</span>')
        // HTML tags with attributes
        .replace(/(&lt;\/?)([a-zA-Z][a-zA-Z0-9]*)((?:\s+[a-zA-Z-]+=(?:&quot;[^&]*?&quot;|&#x27;[^&]*?&#x27;))*?)(\s*\/?)(&gt;)/g, 
          '<span style="color: #8B5CF6; font-weight: 500;">$1</span><span style="color: #2563EB; font-weight: 600;">$2</span><span style="color: #D97706; font-weight: 500;">$3</span><span style="color: #8B5CF6; font-weight: 500;">$4$5</span>')
        // Attribute values
        .replace(/(&quot;[^&]*?&quot;|&#x27;[^&]*?&#x27;)/g, '<span style="color: #059669; font-weight: 500;">$1</span>');
    } else if (lang === 'css') {
      return code
        // CSS comments first
        .replace(/(\/\*[\s\S]*?\*\/)/g, '<span style="color: #6B7280; font-style: italic; opacity: 0.8;">$1</span>')
        // CSS selectors (at start of line, before {)
        .replace(/^(\s*)([.#]?[a-zA-Z][a-zA-Z0-9_-]*|\*|::?[a-zA-Z-]+)(\s*\{)/gm, 
          '$1<span style="color: #7C3AED; font-weight: 600;">$2</span>$3')
        // CSS properties
        .replace(/(\s+)([a-zA-Z-]+)(\s*:)/g, '$1<span style="color: #2563EB; font-weight: 500;">$2</span><span style="color: #8B5CF6; font-weight: 500;">$3</span>')
        // CSS values
        .replace(/(:\s*)([^;{}]+)(;?)/g, '$1<span style="color: #059669; font-weight: 500;">$2</span>$3')
        // Important declarations
        .replace(/(!important)/g, '<span style="color: #DC2626; font-weight: 700;">$1</span>');
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
