import { PortableText, PortableTextComponents } from '@portabletext/react';
import type { PortableTextBlock } from '../lib/sanity';

interface PortableTextRendererProps {
  value: PortableTextBlock[] | undefined;
  className?: string;
}

const EMOJI_RE = /[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}\u{FE00}-\u{FEFF}]/gu;

function cleanBlocks(blocks: PortableTextBlock[]): PortableTextBlock[] {
  return blocks.map(block => {
    if (!('style' in block) || !block.style || block.style === 'normal' || block.style === 'blockquote') return block;
    return {
      ...block,
      children: block.children.map(child =>
        typeof child.text === 'string'
          ? { ...child, text: child.text.replace(EMOJI_RE, '').trim() }
          : child
      ),
    };
  });
}

const components: PortableTextComponents = {
  block: {
    // Section divider label — "Concept", "The Process", "The Ethos"
    h2: ({ children }) => (
      <h2 className="font-['Manrope'] text-[9px] uppercase tracking-[0.35em] text-volavan-aqua/60 mt-14 mb-5 flex items-center gap-4 after:content-[''] after:flex-1 after:h-px after:bg-volavan-aqua/15">
        {children}
      </h2>
    ),

    // Chapter heading — larger editorial title
    h3: ({ children }) => (
      <h3 className="font-['Cormorant_Garamond'] text-2xl md:text-3xl italic text-volavan-cream leading-[1.1] mt-10 mb-4">
        {children}
      </h3>
    ),

    // Sub-label — inline callout
    h4: ({ children }) => (
      <h4 className="font-['Manrope'] text-[10px] uppercase tracking-[0.25em] text-volavan-aqua mt-8 mb-3">
        {children}
      </h4>
    ),

    // Body — editorial serif for literary feel.
    // If every span in the block is bold, treat it as a day/section sub-title
    // (common pattern when editors use bold paragraphs as schedule headers).
    normal: ({ children, value }) => {
      const spans = value?.children ?? [];
      const isAllBold =
        spans.length > 0 &&
        spans.every((s: any) => s._type !== 'block' && Array.isArray(s.marks) && s.marks.includes('strong') && s.text?.trim());
      if (isAllBold) {
        return (
          <p className="font-['Manrope'] text-[10px] uppercase tracking-[0.25em] text-volavan-cream/60 mt-10 mb-3">
            {children}
          </p>
        );
      }
      return (
        <p className="font-['Cormorant_Garamond'] text-lg md:text-xl leading-[1.85] text-volavan-cream/70 mb-4 last:mb-0">
          {children}
        </p>
      );
    },

    // Pull quote — centered, no border, poetic
    blockquote: ({ children }) => (
      <blockquote className="my-10 mx-auto max-w-[48ch] text-center font-['Cormorant_Garamond'] text-xl md:text-2xl italic text-volavan-cream/55 leading-[1.6] before:content-[''] before:block before:w-6 before:h-px before:bg-volavan-aqua/40 before:mx-auto before:mb-6 after:content-[''] after:block after:w-6 after:h-px after:bg-volavan-aqua/40 after:mx-auto after:mt-6">
        {children}
      </blockquote>
    ),
  },

  list: {
    bullet: ({ children }) => (
      <ul className="mb-4 space-y-1.5 max-w-[65ch] pl-3 border-l border-volavan-cream/10">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="mb-4 space-y-1.5 max-w-[65ch] pl-3 border-l border-volavan-cream/10">
        {children}
      </ol>
    ),
  },

  listItem: {
    bullet: ({ children }) => (
      <li className="font-['Cormorant_Garamond'] text-base md:text-lg leading-[1.7] text-volavan-cream/65">
        {children}
      </li>
    ),
    number: ({ children }) => (
      <li className="font-['Cormorant_Garamond'] text-base md:text-lg leading-[1.7] text-volavan-cream/65">
        {children}
      </li>
    ),
  },

  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-volavan-cream">
        {children}
      </strong>
    ),
    em: ({ children }) => (
      <em className="italic text-volavan-cream/90 not-italic">
        {children}
      </em>
    ),
    link: ({ children, value }) => {
      const target = value?.href?.startsWith('http') ? '_blank' : undefined;
      const rel = target === '_blank' ? 'noopener noreferrer' : undefined;
      return (
        <a
          href={value?.href}
          target={target}
          rel={rel}
          className="text-volavan-aqua hover:text-volavan-cream underline underline-offset-4 decoration-volavan-aqua/30 hover:decoration-volavan-cream transition-colors"
        >
          {children}
        </a>
      );
    },
    code: ({ children }) => (
      <code className="bg-volavan-cream/10 px-2 py-0.5 rounded text-sm font-mono text-volavan-aqua">
        {children}
      </code>
    ),
  },
};

export function PortableTextRenderer({ value, className = '' }: PortableTextRendererProps) {
  if (!value || value.length === 0) return null;

  return (
    <div className={`overflow-x-hidden break-words ${className}`}>
      <PortableText value={cleanBlocks(value)} components={components} />
    </div>
  );
}
