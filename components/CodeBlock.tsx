
import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language = 'bash', title }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-4 rounded-xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl">
      <div className="bg-slate-800/80 px-4 py-2 flex items-center justify-between">
        <span className="text-xs font-mono text-slate-400 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            {title || language.toUpperCase()}
        </span>
        <button 
          onClick={handleCopy}
          className="text-slate-400 hover:text-white transition-colors p-1 rounded hover:bg-slate-700"
        >
          {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
        </button>
      </div>
      <div className="p-4 overflow-x-auto">
        <pre className="text-sm font-mono text-slate-300 whitespace-pre">
          {code}
        </pre>
      </div>
    </div>
  );
};

export default CodeBlock;
