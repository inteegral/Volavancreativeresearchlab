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
      <form onSubmit={handleSubmit} className={}>
        <input
          type=email
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder=your@email.com
          className=flex-1
