'use client';

import { useState } from 'react';
import { Section, TestType, TestResults } from '@/types';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import TestDashboard from '@/components/TestDashboard';
import TestInterface from '@/components/TestInterface';
import ResultsPage from '@/components/ResultsPage';
import AboutSection from '@/components/AboutSection';

export default function Home() {
  const [currentSection, setCurrentSection] = useState<Section>('home');
  const [activeTest, setActiveTest] = useState<TestType | null>(null);
  const [testResults, setTestResults] = useState<TestResults | null>(null);

  const navigateTo = (section: string) => {
    if (section === 'about') {
      setCurrentSection('home');
      setTimeout(() => {
        document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return;
    }
    if (section === 'results' && testResults) {
      setCurrentSection('results');
      return;
    }
    if (section === 'dashboard' || section === 'tests') {
      setCurrentSection('dashboard');
      return;
    }
    setCurrentSection('home');
  };

  const handleBeginAssessment = () => {
    setCurrentSection('dashboard');
  };

  const handleStartTest = (type: TestType) => {
    setActiveTest(type);
    setCurrentSection('test');
    setTestResults(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTestComplete = (results: TestResults) => {
    setTestResults(results);
    setCurrentSection('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAbortTest = () => {
    setCurrentSection('dashboard');
    setActiveTest(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRetake = () => {
    if (activeTest) {
      setCurrentSection('test');
      setTestResults(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleTryAnother = () => {
    setCurrentSection('dashboard');
    setActiveTest(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showNavbar = currentSection !== 'test';

  return (
    <>
      {showNavbar && (
        <Navbar onNavigate={navigateTo} currentSection={currentSection} />
      )}

      <main>
        {currentSection === 'home' && (
          <>
            <HeroSection onBeginAssessment={handleBeginAssessment} />
            <AboutSection />
          </>
        )}

        {currentSection === 'dashboard' && (
          <TestDashboard onStartTest={handleStartTest} />
        )}

        {currentSection === 'test' && activeTest && (
          <TestInterface
            key={`${activeTest}-${testResults ? 'new' : 'active'}`}
            testType={activeTest}
            onComplete={handleTestComplete}
            onAbort={handleAbortTest}
          />
        )}

        {currentSection === 'results' && testResults && (
          <ResultsPage
            results={testResults}
            onRetake={handleRetake}
            onTryAnother={handleTryAnother}
          />
        )}
      </main>
    </>
  );
}

