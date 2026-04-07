import { Link, Outlet, useLocation } from "react-router";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Logo } from "../components/Logo";
import { Instagram, Facebook, Youtube, Mail } from "lucide-react";
const volavanLogo = "/logo-circular.svg";
const footerLogo = "/favicon.svg";
import { ScrollToTop } from "../components/ScrollToTop";
import { LanguageSwitcher } from "../components/LanguageSwitcher";
import { useLanguage } from "../contexts/LanguageContext";
import { useAnalytics } from "../hooks/useAnalytics";
import { NewsletterForm } from "../components/NewsletterForm";

export function PublicLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { t } = useLanguage();

  // Track pageviews automatically
  useAnalytics();

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  const navLinks = [
    { name: t.nav.about, path: "/about" },
    { name: t.nav.artists, path: "/artists" },
    { name: t.nav.residencies, path: "/residencies" },
    { name: t.nav.journal, path: "/journal" },
  ];

  const isActive = (path: string) => location.pathname.startsWith(path);
  const isFormPage = location.pathname.startsWith('/candidature') || location.pathname.startsWith('/apply');

  return (
    <div className="min-h-screen flex flex-col bg-volavan-earth text-volavan-cream">
      {/* Header - Minimalist & Fixed */}
      <header className="fixed top-0 left-0 right-0 z-50 text-volavan-cream bg-gradient-to-b from-volavan-earth/50 to-transparent backdrop-blur-[2px]">
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="relative z-50 group pt-[15px]" 
            onClick={() => setIsMenuOpen(false)}
          >
            <img 
              src={volavanLogo} 
              alt="Volavan" 
              className="h-[80px] w-auto object-contain transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110 group-hover:brightness-110" 
            />
          </Link>

          {/* Right Side: Language Switcher + Menu Toggle */}
          <div className="flex items-center gap-4 md:gap-6 relative z-50">
            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-3 group focus:outline-none"
              aria-label="Toggle Menu"
            >
              <span className="hidden sm:block text-sm uppercase tracking-[0.2em] font-['Manrope'] font-medium group-hover:opacity-70 transition-opacity">
                {isMenuOpen ? "Close" : "Menu"}
              </span>
              <div className="w-8 h-8 flex flex-col items-center justify-center gap-1.5">
                <motion.span
                  animate={isMenuOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
                  className="w-full h-[1px] bg-volavan-cream block transition-colors"
                />
                <motion.span
                  animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                  className="w-full h-[1px] bg-volavan-cream block transition-colors"
                />
                <motion.span
                  animate={isMenuOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
                  className="w-full h-[1px] bg-volavan-cream block transition-colors"
                />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Full Screen Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} // Bezier for smooth "award winning" feel
            className="fixed inset-0 z-40 bg-volavan-earth flex flex-col justify-center"
          >
            <div className="max-w-7xl mx-auto px-6 w-full h-full flex flex-col md:flex-row md:items-center">
              
              {/* Left Column: Navigation Links */}
              <div className="flex-1 flex flex-col justify-center items-start space-y-4 md:space-y-6 pt-24 md:pt-0">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: 0.3 + i * 0.1, duration: 0.5, ease: "easeOut" }}
                    className="overflow-hidden"
                  >
                    <Link
                      to={link.path}
                      className={`block font-['Cormorant_Garamond'] text-5xl md:text-7xl lg:text-8xl italic tracking-tight transition-all duration-300 hover:ml-4 ${
                        isActive(link.path) ? "text-volavan-aqua" : "text-volavan-cream hover:text-volavan-aqua"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Right Column: Info (Desktop) / Bottom (Mobile) */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="md:w-1/3 mt-12 md:mt-0 flex flex-col gap-8 md:border-l md:border-volavan-cream/10 md:pl-12 py-8 md:py-0"
              >
                <div className="flex flex-col items-start gap-4">
                  <a href="https://www.facebook.com/volavan.coop" target="_blank" rel="noopener noreferrer" className="text-volavan-cream/40 hover:text-volavan-aqua transition-all duration-300 transform hover:scale-110" aria-label="Facebook">
                    <Facebook size={22} strokeWidth={1} />
                  </a>
                  <a href="https://www.instagram.com/volavan.rural/" target="_blank" rel="noopener noreferrer" className="text-volavan-cream/40 hover:text-volavan-aqua transition-all duration-300 transform hover:scale-110" aria-label="Instagram">
                    <Instagram size={22} strokeWidth={1} />
                  </a>
                  <a href="https://www.youtube.com/@wearevolavan" target="_blank" rel="noopener noreferrer" className="text-volavan-cream/40 hover:text-volavan-aqua transition-all duration-300 transform hover:scale-110" aria-label="YouTube">
                    <Youtube size={22} strokeWidth={1} />
                  </a>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-grow pt-24">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-volavan-earth text-volavan-cream py-20 px-6 md:px-6 border-t border-volavan-cream/10 mt-auto">
        <div className="max-w-3xl mx-auto flex flex-col items-center text-center gap-10">
          
          {/* Logo */}
          <img src={footerLogo} alt="VOLAVAN" className="h-[117.9px] w-auto mt-[100px]" />

          {/* Mission Statement */}
          

          {/* Newsletter */}
          {!isFormPage && (
            <div className="w-full flex flex-col items-center gap-4">
              <p className="font-['Manrope'] text-[9px] uppercase tracking-[0.25em] text-volavan-cream/30">Stay Connected</p>
              <NewsletterForm variant="footer" className="max-w-sm" />
            </div>
          )}

          {/* Navigation */}
          <nav className="flex flex-col md:flex-row md:flex-wrap justify-center gap-4 md:gap-x-8 md:gap-y-4 my-2">
            {navLinks.map((link) => (
              <Link 
                key={link.path}
                to={link.path}
                className="font-['Manrope'] text-xs uppercase tracking-[0.15em] text-volavan-cream/70 hover:text-volavan-aqua hover:opacity-100 transition-all"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Contact Details */}
          <div className="flex flex-col gap-3 font-['Manrope'] text-xs leading-relaxed tracking-wide text-volavan-cream/40 uppercase">
            <p className="normal-case">Volavan cooperativa cultural CRL • Fermil • Portugal</p>
            
          </div>

          {/* Socials */}
          <div className="flex gap-6 opacity-40">
            <a href="https://www.facebook.com/volavan.coop" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-volavan-aqua hover:opacity-100 transition-all duration-300 transform hover:scale-110">
              <Facebook size={22} strokeWidth={1} />
            </a>
            <a href="https://www.instagram.com/volavan.rural/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-volavan-aqua hover:opacity-100 transition-all duration-300 transform hover:scale-110">
              <Instagram size={22} strokeWidth={1} />
            </a>
            <a href="https://www.youtube.com/@wearevolavan" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="hover:text-volavan-aqua hover:opacity-100 transition-all duration-300 transform hover:scale-110">
              <Youtube size={22} strokeWidth={1} />
            </a>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 w-full border-t border-volavan-cream/5 flex flex-col md:flex-row justify-center items-center gap-6 text-xs tracking-widest text-volavan-cream/30 font-['Manrope'] uppercase mt-4">
            <span>© {new Date().getFullYear()} Volavan</span>
            <div className="flex gap-6">
              <Link to="/privacy" className="hover:text-volavan-cream transition-colors">Privacy</Link>
              <Link to="/terms" className="hover:text-volavan-cream transition-colors">Terms</Link>
            </div>
          </div>

        </div>
      </footer>
      <ScrollToTop />
    </div>
  );
}