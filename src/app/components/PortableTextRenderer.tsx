import { PortableText, PortableTextComponents } from '@portabletext/react';
import type { PortableTextBlock } from '../lib/sanity';

interface PortableTextRendererProps {
  value: PortableTextBlock[] | undefined;
  className?: string;
}

/**
 * Custom components for rendering Portable Text with Volavan styling
 */
const components: PortableTextComponents = {
  block: {
    // Headings
    h1: ({ children }) => (
      <h1 className="font-['Cormorant_Garamond'] text-5xl md:text-6xl italic text-[#F5F5F0] mb-8">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="font-['Cormorant_Garamond'] text-4xl md:text-5xl italic text-[#F5F5F0] mb-6 mt-12">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl italic text-[#F5F5F0] mb-4 mt-10">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="font-['Manrope'] text-xl font-medium text-[#F5F5F0] mb-4 mt-8 uppercase tracking-wider">
        {children}
      </h4>
    ),
    
    // Paragraphs
    normal: ({ children }) => (
      <p className="font-['Manrope'] text-lg md:text-xl leading-relaxed text-[#F5F5F0]/80 mb-0 indent-8 first:indent-0">
        {children}
      </p>
    ),
    
    // Blockquote
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-[#B5DAD9]/40 pl-6 my-8 italic text-[#F5F5F0]/70 font-['Cormorant_Garamond'] text-xl">
        {children}
      </blockquote>
    ),
  },
  
  list: {
    // Bullet list
    bullet: ({ children }) => (
      <ul className="list-disc list-outside ml-6 mb-6 space-y-3 text-[#F5F5F0]/80 font-['Manrope']">
        {children}
      </ul>
    ),
    
    // Numbered list
    number: ({ children }) => (
      <ol className="list-decimal list-outside ml-6 mb-6 space-y-3 text-[#F5F5F0]/80 font-['Manrope']">
        {children}
      </ol>
    ),
  },
  
  listItem: {
    bullet: ({ children }) => (
      <li className="leading-relaxed">
        {children}
      </li>
    ),
    number: ({ children }) => (
      <li className="leading-relaxed">
        {children}
      </li>
    ),
  },
  
  marks: {
    // Strong/Bold
    strong: ({ children }) => (
      <strong className="font-semibold text-[#F5F5F0]">
        {children}
      </strong>
    ),
    
    // Emphasis/Italic
    em: ({ children }) => (
      <em className="italic text-[#B5DAD9]">
        {children}
      </em>
    ),
    
    // Links
    link: ({ children, value }) => {
      const target = value?.href?.startsWith('http') ? '_blank' : undefined;
      const rel = target === '_blank' ? 'noopener noreferrer' : undefined;
      
      return (
        <a
          href={value?.href}
          target={target}
          rel={rel}
          className="text-[#B5DAD9] hover:text-[#F5F5F0] underline decoration-[#B5DAD9]/40 hover:decoration-[#F5F5F0] transition-colors"
        >
          {children}
        </a>
      );
    },
    
    // Code
    code: ({ children }) => (
      <code className="bg-[#F5F5F0]/10 px-2 py-1 rounded text-sm font-mono text-[#B5DAD9]">
        {children}
      </code>
    ),
  },
};

/**
 * Component to render Sanity Portable Text content
 * with custom Volavan styling
 */
export function PortableTextRenderer({ value, className = '' }: PortableTextRendererProps) {
  if (!value || value.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      <PortableText value={value} components={components} />
    </div>
  );
}