import { useState, FormEvent } from 'react';
import { toast } from 'sonner';
import { trackEvent } from '../hooks/useAnalytics';
import { Mail } from 'lucide-react';

/**
 * Newsletter Signup Form
 * 
 * TODO: Implementare con una delle seguenti opzioni sicure:
 * 1. MailerLite Embedded Form (consigliato)
 * 2. Serverless Function (Netlify/Vercel) come proxy
 * 3. Formspree + Zapier/Make integration
 * 
 * NON usare API key direttamente nel frontend!
 */

interface NewsletterFormProps {
  className?: string;
  variant?: 'footer' | 'inline';
}

export function NewsletterForm({ className = '', variant = 'footer' }: NewsletterFormProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    // TODO: Implementare integrazione sicura (vedi opzioni sopra)
    // Per ora: solo demo mode
    
    setTimeout(() => {
      toast.success('Newsletter subscription successful! (Demo mode - da implementare)');
      trackEvent('newsletter_signup', { source: variant, mode: 'demo' });
      setEmail('');
      setIsSubmitting(false);
    }, 1000);
  };

  if (variant === 'inline') {
    return (
      <div className={`bg-volavan-cream/5 border border-volavan-cream/10 rounded-lg p-8 ${className}`}>
        <div className="flex items-center gap-3 mb-4">
          <Mail size={24} className="text-volavan-aqua" />
          <h3 className="font-['Cormorant_Garamond'] text-2xl italic text-volavan-cream">
            Stay Updated
          </h3>
        </div>
        <p className="font-['Manrope'] text-sm text-volavan-cream/70 mb-6 leading-relaxed">
          Subscribe to receive news about upcoming residencies, artist calls, and events.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="flex-1 px-4 py-3 bg-volavan-earth/30 border border-volavan-cream/20 rounded text-volavan-cream placeholder:text-volavan-cream/40 font-['Manrope'] text-sm focus:outline-none focus:border-volavan-aqua/60 transition-colors"
            disabled={isSubmitting}
            required
          />
          <button
            type="submit"
            className="px-6 py-3 bg-volavan-aqua text-volavan-earth rounded font-['Manrope'] text-xs font-medium uppercase tracking-[0.15em] hover:bg-volavan-aqua/90 transition-all whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>
      </div>
    );
  }

  // Footer variant (default)
  return (
    <form 
      onSubmit={handleSubmit} 
      className={`w-full flex flex-col sm:flex-row gap-3 sm:gap-2 ${className}`}
    >
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email"
        className="flex-1 px-4 py-3 bg-transparent border border-volavan-cream/20 rounded-full text-volavan-cream placeholder:text-volavan-cream/40 font-['Manrope'] text-sm focus:outline-none focus:border-volavan-aqua/60 transition-colors"
        disabled={isSubmitting}
        required
      />
      <button
        type="submit"
        className="px-6 py-3 bg-volavan-aqua/10 border border-volavan-aqua/30 rounded-full text-volavan-aqua font-['Manrope'] text-xs uppercase tracking-[0.15em] hover:bg-volavan-aqua/20 hover:border-volavan-aqua/50 transition-all whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Subscribing...' : 'Subscribe'}
      </button>
    </form>
  );
}