import { useState, FormEvent } from 'react';
import { toast } from 'sonner';
import { trackEvent } from '../hooks/useAnalytics';

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

    try {
      const res = await fetch('https://submit-form.com/Ny0WsV0JU', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) throw new Error();

      toast.success('You are now subscribed!');
      trackEvent('newsletter_signup', { source: variant });
      setEmail('');
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (variant === 'inline') {
    return (
      <form onSubmit={handleSubmit} className={`flex gap-3 w-full ${className}`}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="flex-1 bg-transparent border-b border-volavan-cream/20 focus:border-volavan-aqua outline-none py-2 font-['Manrope'] text-sm text-volavan-cream placeholder:text-volavan-cream/30 transition-colors"
          required
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="font-['Manrope'] text-[10px] uppercase tracking-[0.2em] text-volavan-aqua hover:text-volavan-cream transition-colors disabled:opacity-40"
        >
          {isSubmitting ? '...' : 'Subscribe'}
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`flex gap-3 w-full ${className}`}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        className="flex-1 bg-transparent border-b border-volavan-cream/20 focus:border-volavan-aqua outline-none py-2 font-['Manrope'] text-sm text-volavan-cream placeholder:text-volavan-cream/30 transition-colors"
        required
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="font-['Manrope'] text-[10px] uppercase tracking-[0.2em] text-volavan-aqua hover:text-volavan-cream transition-colors disabled:opacity-40"
      >
        {isSubmitting ? '...' : 'Subscribe'}
      </button>
    </form>
  );
}
