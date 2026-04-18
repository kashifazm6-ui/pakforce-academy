'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface NavbarProps {
  onNavigate: (section: string) => void;
  currentSection: string;
}

export default function Navbar({ onNavigate, currentSection }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', section: 'home' },
    { label: 'Tests', section: 'dashboard' },
    { label: 'Results', section: 'results' },
    { label: 'About', section: 'about' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-[#c9a84c]'
          : 'border-b border-transparent'
      }`}
      style={{ backgroundColor: '#0a0f1e', backdropFilter: 'blur(8px)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo + Brand */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 focus:outline-none"
          >
            <Image
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Pakistan_Army_logo.svg/800px-Pakistan_Army_logo.svg.png"
              alt="Pakistan Army"
              width={38}
              height={38}
              className="object-contain"
              unoptimized
            />
            <span
              className="font-playfair font-bold text-lg tracking-wide"
              style={{ color: '#c9a84c' }}
            >
              PakForce Academy
            </span>
          </button>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.section}
                onClick={() => onNavigate(link.section)}
                className={`font-inter text-sm tracking-widest uppercase transition-colors duration-200 focus:outline-none ${
                  currentSection === link.section
                    ? 'text-[#c9a84c]'
                    : 'text-[#8a9ab5] hover:text-[#c9a84c]'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Mobile menu — hamburger */}
          <MobileMenu navLinks={navLinks} onNavigate={onNavigate} currentSection={currentSection} />
        </div>
      </div>
    </nav>
  );
}

function MobileMenu({
  navLinks,
  onNavigate,
  currentSection,
}: {
  navLinks: { label: string; section: string }[];
  onNavigate: (section: string) => void;
  currentSection: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden relative">
      <button
        onClick={() => setOpen(!open)}
        className="focus:outline-none text-[#8a9ab5] hover:text-[#c9a84c] transition-colors"
        aria-label="Toggle menu"
      >
        <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          {open ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {open && (
        <div
          className="absolute right-0 top-10 w-52 py-2 rounded border border-[#c9a84c]/30"
          style={{ backgroundColor: '#1a2035' }}
        >
          {navLinks.map((link) => (
            <button
              key={link.section}
              onClick={() => {
                onNavigate(link.section);
                setOpen(false);
              }}
              className={`block w-full text-left px-4 py-3 font-inter text-sm tracking-widest uppercase transition-colors ${
                currentSection === link.section
                  ? 'text-[#c9a84c]'
                  : 'text-[#8a9ab5] hover:text-[#c9a84c]'
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
