'use client';

import Image from 'next/image';

interface HeroSectionProps {
  onBeginAssessment: () => void;
}

export default function HeroSection({ onBeginAssessment }: HeroSectionProps) {
  const stats = [
    { label: 'Verbal MCQs', count: '84', desc: 'Intelligence Assessment' },
    { label: 'Non-Verbal MCQs', count: '64', desc: 'Pattern & Reasoning' },
    { label: 'Academic MCQs', count: '50', desc: 'Science Disciplines' },
  ];

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center diagonal-texture overflow-hidden"
      style={{ backgroundColor: '#0a0f1e', paddingTop: '64px' }}
    >
      {/* Watermark crest */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <Image
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Pakistan_Army_logo.svg/800px-Pakistan_Army_logo.svg.png"
          alt=""
          width={520}
          height={520}
          className="object-contain opacity-[0.04]"
          unoptimized
          aria-hidden="true"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto section-transition">
        {/* Pakistan Army crest */}
        <div className="flex justify-center mb-8">
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Pakistan_Army_logo.svg/800px-Pakistan_Army_logo.svg.png"
            alt="Pakistan Army"
            width={96}
            height={96}
            className="object-contain"
            unoptimized
          />
        </div>

        {/* Military badge */}
        <div className="flex justify-center mb-6">
          <span className="military-badge">Official AMC Preparation Platform</span>
        </div>

        {/* Headline */}
        <h1
          className="font-playfair font-bold text-5xl sm:text-6xl lg:text-7xl mb-4 tracking-tight"
          style={{ color: '#c9a84c' }}
        >
          PakForce Academy
        </h1>

        {/* Subheadline */}
        <p
          className="font-inter text-lg sm:text-xl mb-10 tracking-wide"
          style={{ color: '#8a9ab5' }}
        >
          Official AMC Initial Test Preparation Platform
        </p>

        {/* CTA Button */}
        <button
          onClick={onBeginAssessment}
          className="font-inter font-semibold uppercase tracking-widest text-sm px-10 py-4 border-2 transition-all duration-200 hover:bg-[#c9a84c] hover:text-[#0a0f1e] focus:outline-none mb-16"
          style={{
            borderColor: '#c9a84c',
            color: '#c9a84c',
          }}
        >
          Begin Assessment
        </button>

        {/* Gold divider */}
        <div className="gold-divider mb-12 mx-auto max-w-2xl" />

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="steel-card px-6 py-6 text-center"
            >
              <div
                className="font-playfair font-bold text-4xl mb-1"
                style={{ color: '#c9a84c' }}
              >
                {stat.count}
              </div>
              <div className="font-inter font-semibold text-white text-sm uppercase tracking-wider mb-1">
                {stat.label}
              </div>
              <div className="font-inter text-xs" style={{ color: '#8a9ab5' }}>
                {stat.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
