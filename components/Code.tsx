'use client';

import React from 'react';
import { CopyBlock, monokai } from 'react-code-blocks';

type CodeProps = {
  language: string;
  text: string;
};

const Code: React.FC<CodeProps> = ({ language, text }) => {
  const processedText = text.trim().replace(/^`+|`+$/g, '');

  // Responsive styles for the container
  const containerStyle: React.CSSProperties = {
    fontFamily: 'monospace',
    maxWidth: '100%', // Ensures the container does not overflow the viewport width
  };

  // Responsive styles for the CopyBlock component
  const copyBlockStyle = {
    overflowY: 'scroll',
    overflowX: 'none',
    maxHeight: '500px',
    width: 'auto', // Allows the component to adjust its width as needed
    maxWidth: '100%', // Prevents the component from exceeding the viewport width
    whiteSpace: 'pre-wrap', // Ensures text wraps instead of extending out of the block
    wordBreak: 'break-all', // Allows text to wrap at any point, not just at whitespace
  };

  return (
    <div className="not-prose text-sm">
      <CopyBlock
        text={processedText}
        language={language}
        showLineNumbers={false}
        codeBlock
        theme={monokai}
        customStyle={copyBlockStyle}
        codeContainerStyle={containerStyle}
        wrapLongLines
      />
    </div>
  );
};

export default Code;
