import { useForm } from "react-hook-form";
import { motion } from "motion/react";
import { SEOHead } from "../../components/SEOHead";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { trackApplicationStarted, trackApplicationSubmitted } from "../../lib/analytics-events";

export default function Candidature() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Formspree endpoint (configure in .env or replace with your actual endpoint)
  const formspreeEndpoint = import.meta.env.VITE_FORMSPREE_ENDPOINT || 'YOUR_FORMSPREE_ID';
  
  // Mock active call for demonstration
  const activeCall = {
    title: "Summer Residency 2025",
    description: "Una residenza artistica di 4 settimane immersa nella natura rurale, dedicata ad artisti emergenti che desiderano esplorare il rapporto tra arte, territorio e comunità.",
    deadline: "15 Marzo 2025",
    isActive: true
  };

  // Track when user opens the application form
  useEffect(() => {
    trackApplicationStarted(activeCall.title, 2025);
  }, []);

  // Submit handler with Formspree integration
  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`https://formspree.io/f/${formspreeEndpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success('Candidatura inviata con successo! Ti contatteremo presto.');
        
        // Track successful application submission
        trackApplicationSubmitted(activeCall.title, 2025);
        
        reset();
      } else {
        throw new Error('Failed to submit');
      }
    } catch (error) {
      toast.error('Errore durante l\'invio. Riprova o contattaci via email.');
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
      <SEOHead
        title="Candidature Aperte - Summer Residency 2025"
        description="Partecipa alla Summer Residency 2025, una residenza artistica di 4 settimane immersa nella natura rurale, dedicata ad artisti emergenti che desiderano esplorare il rapporto tra arte, territorio e comunità."
        keywords="Summer Residency 2025, candidature aperte, residenza artistica, natura rurale, artisti emergenti, arte, territorio, comunità"
      />
      <div className="text-center mb-16">
        <span className="text-[#B5DAD9] text-xs uppercase tracking-[0.2em] mb-4 block">Partecipa</span>
        <h1 className="text-4xl md:text-5xl font-light text-[#F5F5F0]">Candidature Aperte</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
        {/* Left Column: Call Info */}
        {activeCall ? (
          <div>
            <div className="bg-[#F5F5F0] p-8 mb-8 border-l-4 border-[#B5DAD9]">
              <h3 className="text-2xl font-light text-[#333] mb-4">{activeCall.title}</h3>
              <p className="text-[#555] mb-6">{activeCall.description}</p>
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#888]">
                <span className="font-bold text-[#333]">Deadline:</span> {activeCall.deadline}
              </div>
            </div>
            
            <h4 className="text-lg font-light text-[#F5F5F0] mb-4 uppercase tracking-wide">Requisiti</h4>
            <ul className="list-disc pl-5 space-y-2 text-[#F5F5F0]/80 mb-8 marker:text-[#B5DAD9]">
              <li>Portfolio aggiornato (PDF, max 10MB)</li>
              <li>Statement artistico (max 500 parole)</li>
              <li>CV (max 2 pagine)</li>
              <li>Proposta progettuale specifica per il contesto rurale</li>
            </ul>
          </div>
        ) : (
           <div className="bg-[#F5F5F0]/10 p-8 text-center text-[#F5F5F0] col-span-2 border border-[#F5F5F0]/20">
             <h3 className="text-xl font-light mb-2">Nessuna open call attiva al momento.</h3>
             <p className="opacity-80">Iscriviti alla newsletter per ricevere aggiornamenti sulle prossime opportunità.</p>
           </div>
        )}

        {/* Right Column: Form */}
        {activeCall && (
          <form onSubmit={handleSubmit(onSubmit)} className="bg-white border border-gray-200 p-8 shadow-sm">
            <h3 className="text-xl font-light text-[#333] mb-6 uppercase tracking-wide border-b pb-4">Modulo di Candidatura</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-xs uppercase tracking-widest text-[#666] mb-2">Nome Completo</label>
                <input 
                  {...register("fullName", { required: true })} 
                  className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-[#6A746C] transition-colors bg-gray-50 text-[#333]"
                  placeholder="Mario Rossi"
                />
                {errors.fullName && <span className="text-red-500 text-xs mt-1 block">Campo obbligatorio</span>}
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-[#666] mb-2">Email</label>
                <input 
                  {...register("email", { required: true, pattern: /^\S+@\S+$/i })} 
                  className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-[#6A746C] transition-colors bg-gray-50 text-[#333]"
                  placeholder="mario@example.com"
                />
                 {errors.email && <span className="text-red-500 text-xs mt-1 block">Email non valida</span>}
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-[#666] mb-2">Link al Portfolio</label>
                <input 
                  {...register("portfolioLink", { required: true })} 
                  className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-[#6A746C] transition-colors bg-gray-50 text-[#333]"
                  placeholder="https://..."
                />
                 {errors.portfolioLink && <span className="text-red-500 text-xs mt-1 block">Campo obbligatorio</span>}
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-[#666] mb-2">Messaggio / Statement</label>
                <textarea 
                  {...register("message", { required: true })} 
                  rows={4}
                  className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-[#6A746C] transition-colors bg-gray-50 text-[#333]"
                  placeholder="Raccontaci brevemente il tuo progetto..."
                ></textarea>
                 {errors.message && <span className="text-red-500 text-xs mt-1 block">Campo obbligatorio</span>}
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit" 
                className="w-full bg-[#6A746C] text-white py-4 uppercase tracking-widest text-xs hover:bg-[#4A544C] transition-colors font-semibold"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Invio in corso...' : 'Invia Candidatura'}
              </motion.button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}