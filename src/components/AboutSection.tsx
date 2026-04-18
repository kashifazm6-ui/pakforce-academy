'use client';

export default function AboutSection() {
  return (
    <section
      id="about"
      className="diagonal-texture"
      style={{ backgroundColor: '#0a0f1e', paddingTop: '80px', paddingBottom: '80px' }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="gold-divider mb-12" />

        <div className="text-center mb-8">
          <span className="military-badge mb-4 inline-block">About the Platform</span>
        </div>

        <h2 className="font-playfair font-bold text-4xl sm:text-5xl text-white text-center mb-8">
          About PakForce Academy
        </h2>

        <div
          className="border border-[#c9a84c]/20 p-8 sm:p-10"
          style={{ backgroundColor: '#1a2035' }}
        >
          <p className="font-inter text-base sm:text-lg leading-relaxed" style={{ color: '#8a9ab5' }}>
            PakForce Academy is a dedicated preparation platform for candidates appearing in the
            Pakistan Army Medical Corps (AMC) Initial Test. The platform delivers AI-generated
            Verbal Intelligence, Non-Verbal Intelligence, and Academic assessments aligned with
            the official AMC testing format — covering 84 verbal MCQs, 64 non-verbal MCQs, and
            50 academic MCQs across Biology, Chemistry, and Physics at FSc and MDCAT level.
            Every question is generated fresh via the Anthropic Claude AI model, ensuring
            no repetition within a session and consistent alignment with the standard of
            an official military examination. The platform is built for discipline, accuracy,
            and serious preparation — no shortcuts, only results.
          </p>
        </div>

        <div className="gold-divider mt-12" />

        <div className="text-center mt-8">
          <p className="font-inter text-xs uppercase tracking-widest" style={{ color: '#c9a84c' }}>
            PakForce Academy — Prepared for Service
          </p>
        </div>
      </div>
    </section>
  );
}
