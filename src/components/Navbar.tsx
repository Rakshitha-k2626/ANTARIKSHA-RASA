import {Menu, X} from 'lucide-react';
import {useEffect, useState} from 'react';

export type PageRoute =
  | '/'
  | '/experience'
  | '/menu'
  | '/delivery'
  | '/story'
  | '/reserve';

interface NavbarProps {
  currentRoute: PageRoute;
  onNavigate: (route: PageRoute) => void;
}

const NAV_LINKS: {label: string; route: PageRoute}[] = [
  {label: 'Home', route: '/'},
  {label: 'Experience', route: '/experience'},
  {label: 'Cosmic Menu', route: '/menu'},
  {label: 'Delivery', route: '/delivery'},
  {label: 'Our Story', route: '/story'},
];

export function Navbar({currentRoute, onNavigate}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, {passive: true});
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = (route: PageRoute) => {
    setMobileMenuOpen(false);
    onNavigate(route);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-200 ${
        scrolled || currentRoute !== '/'
          ? 'glass-surface border-b border-white/10 shadow-[0_12px_40px_rgba(4,6,14,0.55)]'
          : 'border-b border-transparent bg-gradient-to-b from-[#04060e]/85 via-[#04060e]/40 to-transparent'
      }`}>
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-8 px-5 sm:px-8">
        {/* Zone 1: Single-element Wordmark */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('/');
          }}
          className="font-display shrink-0 text-base font-semibold tracking-[0.18em] whitespace-nowrap text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-400 sm:text-lg">
          ANTARIKSHA RASA
        </a>

        {/* Zone 2: 5 Clean Single-Line Nav Links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden items-center gap-6 lg:flex">
          {NAV_LINKS.map((link) => {
            const isActive = currentRoute === link.route;
            return (
              <a
                key={link.route}
                href={link.route}
                aria-current={isActive ? 'page' : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.route);
                }}
                className={`group relative shrink-0 py-1 text-sm font-medium whitespace-nowrap transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-400 ${
                  isActive ? 'text-white' : 'text-slate-300 hover:text-white'
                }`}>
                {link.label}
                <span
                  aria-hidden="true"
                  className={`prismatic-gradient absolute inset-x-0 -bottom-0.5 h-[1.5px] origin-left transition-transform duration-200 ${
                    isActive
                      ? 'scale-x-100'
                      : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                />
              </a>
            );
          })}
        </nav>

        {/* Zone 3: 1 Primary Action + Mobile Menu Trigger */}
        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            onClick={() => handleNavClick('/reserve')}
            className="prismatic-gradient hidden shrink-0 cursor-pointer rounded-full px-5 py-2 text-xs font-semibold tracking-wider whitespace-nowrap text-slate-950 uppercase shadow-[0_0_24px_rgba(56,189,248,0.28)] transition-transform duration-150 hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300 lg:inline-flex">
            Reserve
          </button>

          <button
            type="button"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 lg:hidden">
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="glass-surface border-t border-white/10 px-5 py-5 lg:hidden">
          <nav aria-label="Mobile Navigation" className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = currentRoute === link.route;
              return (
                <a
                  key={link.route}
                  href={link.route}
                  aria-current={isActive ? 'page' : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.route);
                  }}
                  className={`flex min-h-[44px] items-center rounded-lg px-3 text-base font-medium transition-colors ${
                    isActive
                      ? 'bg-white/10 text-cyan-300'
                      : 'text-slate-100 hover:bg-white/5 hover:text-cyan-300'
                  }`}>
                  {link.label}
                </a>
              );
            })}
            <button
              type="button"
              onClick={() => handleNavClick('/reserve')}
              className="prismatic-gradient mt-3 flex min-h-[44px] w-full items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold tracking-wider whitespace-nowrap text-slate-950 uppercase">
              Reserve
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
