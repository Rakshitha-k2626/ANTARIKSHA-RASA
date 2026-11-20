import {Check, Link2} from 'lucide-react';
import {useState} from 'react';
import {type PageRoute} from './Navbar';

interface FooterProps {
  onNavigate: (route: PageRoute) => void;
}

const OFFICIAL_SITE_URL =
  'https://ais-pre-f6mpsli47gjk47xw4rqcta-562386129428.asia-east1.run.app';

const FOOTER_LINKS: {label: string; route: PageRoute}[] = [
  {label: 'Home', route: '/'},
  {label: 'Experience', route: '/experience'},
  {label: 'Cosmic Menu', route: '/menu'},
  {label: 'Delivery & Reviews', route: '/delivery'},
  {label: 'Our Story', route: '/story'},
  {label: 'Reserve', route: '/reserve'},
];

const SOCIAL_LINKS = [
  {label: 'Instagram · @antariksharasa', href: 'https://instagram.com/antariksharasa'},
  {label: 'X · @antariksharasa', href: 'https://x.com/antariksharasa'},
  {label: 'YouTube · @antariksharasa', href: 'https://youtube.com/@antariksharasa'},
];

export function Footer({onNavigate}: FooterProps) {
  const [copiedUrl, setCopiedUrl] = useState(false);

  const handleCopyOfficialLink = async () => {
    try {
      await navigator.clipboard.writeText(OFFICIAL_SITE_URL);
      setCopiedUrl(true);
      window.setTimeout(() => setCopiedUrl(false), 2200);
    } catch {
      setCopiedUrl(false);
    }
  };

  return (
    <footer className="relative z-20 border-t border-white/10 bg-[#03050b]">
      <div className="mx-auto max-w-[1200px] px-5 py-16 sm:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:items-start">
          {/* Brand Column */}
          <div className="md:col-span-5">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('/');
              }}
              className="font-display text-xl font-bold tracking-[0.18em] text-white">
              ANTARIKSHA RASA
            </a>
            <p
              lang="sa"
              className="font-devanagari mt-1.5 text-base text-amber-200/90">
              अन्तरिक्ष रस
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-300">
              Made for explorers. Inspired by the universe.
            </p>
            <button
              type="button"
              onClick={handleCopyOfficialLink}
              className="mt-5 inline-flex min-h-[40px] cursor-pointer items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-medium whitespace-nowrap text-slate-200 transition-colors hover:border-cyan-400/50 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400">
              {copiedUrl ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-300" aria-hidden="true" />
                  <span>Official Link Copied</span>
                </>
              ) : (
                <>
                  <Link2 className="h-3.5 w-3.5 text-cyan-300" aria-hidden="true" />
                  <span>Copy Official Link</span>
                </>
              )}
            </button>
          </div>

          {/* Navigation Column */}
          <div className="md:col-span-4">
            <p className="font-mono text-xs tracking-wider text-slate-400 uppercase">
              Pages
            </p>
            <ul className="mt-4 flex flex-col gap-2.5">
              {FOOTER_LINKS.map((link) => (
                <li key={link.route}>
                  <a
                    href={link.route}
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate(link.route);
                    }}
                    className="text-sm text-slate-300 transition-colors hover:text-cyan-300">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Column */}
          <div className="md:col-span-3">
            <p className="font-mono text-xs tracking-wider text-slate-400 uppercase">
              Social Channels
            </p>
            <ul className="mt-4 flex flex-col gap-2.5">
              {SOCIAL_LINKS.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-slate-300 transition-colors hover:text-cyan-300">
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-8 text-xs text-slate-400 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} ANTARIKSHA RASA. Low Earth Orbit Hospitality.</p>
          <p className="text-slate-400">
            Made for explorers. Inspired by the universe.
          </p>
        </div>
      </div>
    </footer>
  );
}
