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
    // Headings — usati raramente dentro il testo, ma supportati
    h1: ({ children }) => (
      <h1 className="font-['Cormorant_Garamond'] text-4xl md:text-5xl italic text-volavan-cream mt-12 mb-4">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl italic text-volavan-cream mt-10 mb-3">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-['Cormorant_Garamond'] text-2xl md:text-3xl italic text-volavan-cream mt-8 mb-3">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="font-['Manrope'] text-xs uppercase tracking-[0.2em] font-medium text-volavan-aqua mt-8 mb-2">
        {children}
      </h4>
    ),

    // Paragrafo — spaziatura verticale, larghezza ottimale per leggibilità
    normal: ({ children }) => (
      <p className="font-['Manrope'] text-sm md:text-base leading-[1.8] text-volavan-cream/75 mb-5 last:mb-0 max-w-[65ch]">
        {children}
      </p>
    ),

    // Blockquote — citazione editoriale
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-volavan-aqua/50 pl-6 my-8 font-['Cormorant_Garamond'] text-xl italic text-volavan-cream/70 max-w-[55ch]">
        {children}
      </blockquote>
    ),
  },

  list: {
    bullet: ({ children }) => (
      <ul className="mb-5 ml-4 space-y-2 text-volavan-cream/75 font-['Manrope'] text-sm md:text-base max-w-[65ch]">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="mb-5 ml-4 space-y-2 text-volavan-cream/75 font-['Manrope'] text-sm md:text-base list-decimal max-w-[65ch]">
        {children}
      </ol>
    ),
  },

  listItem: {
    bullet: ({ children }) => (
      <li className="leading-[1.7] pl-1 flex gap-3 before:content-['—'] before:text-volavan-aqua/50 before:shrink-0 before:mt-px">
        <span>{children}</span>
      </li>
    ),
    number: ({ children }) => (
      <li className="leading-[1.7] pl-1">
        {children}
      </li>
    ),
  },
  
  marks: {
    // Strong/Bold
    strong: ({ children }) => (
      <strong style={{ fontWeight: 700 }} className="text-volavan-cream">
        {children}
      </strong>
    ),
    
    // Emphasis/Italic
    em: ({ children }) => (
      <em className="italic text-volavan-aqua">
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
          className="text-volavan-aqua hover:text-volavan-cream underline decoration-volavan-aqua/40 hover:decoration-volavan-cream transition-colors"
        >
          {children}
        </a>
      );
    },
    
    // Code
    code: ({ children }) => (
      <code className="bg-volavan-cream/10 px-2 py-1 rounded text-sm font-mono text-volavan-aqua">
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
    <div className={`space-y-1 ${className}`}>
      <PortableText value={value} components={components} />
    </div>
  );
}