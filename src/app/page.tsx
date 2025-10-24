'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { StoryInput } from '../components/StoryInput';
import { CharacterTagging } from '../components/CharacterTagging';
import { StyleSelector } from '../components/StyleSelector';
import { ComicPreview } from '../components/ComicPreview';
import { Character, ComicStyle, ComicPanel } from '../types';
import { ComicStyleName, ColorPalette, BorderStyle } from '../types';
import { AIExtractCharacters, AIGenerateComicPanels, initializeAI } from '../ai';

const steps = [
  { id: 1, name: 'Story', icon: '📝' },
  { id: 2, name: 'Characters', icon: '🦸' },
  { id: 3, name: 'Style', icon: '🎨' },
  { id: 4, name: 'Generate', icon: '⚡' },
];

export default function Home() {
  const [currentStep, setCurrentStep] = useState(1);
  const [story, setStory] = useState('');
  const [characters, setCharacters] = useState<Character[]>([]);
  const [style, setStyle] = useState<ComicStyle>({
    style: ComicStyleName.ComicBook,
    palette: ColorPalette.Vibrant,
    border: BorderStyle.Sharp,
  });
  const [panels, setPanels] = useState<ComicPanel[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState({ current: 0, total: 0 });

  useEffect(() => {
    // Initialize AI services on mount
    initializeAI().catch(console.error);
  }, []);

  useEffect(() => {
    if (story.length > 100) {
      const extractChars = async () => {
        try {
          const extractedNames = await AIExtractCharacters(story);
          const newCharacters = extractedNames
            .filter(name => !characters.some(char => char.name.toLowerCase() === name.toLowerCase()))
            .map(name => ({
              id: Math.random().toString(36).substr(2, 9),
              name,
              photos: [],
            }));
          if (newCharacters.length > 0) {
            setCharacters(prev => [...prev, ...newCharacters]);
          }
        } catch (error) {
          console.error('Error extracting characters:', error);
        }
      };
      extractChars();
    }
  }, [story]);

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepId: number) => {
    if (stepId <= currentStep) {
      setCurrentStep(stepId);
    }
  };

  const handleGenerateComic = async () => {
    if (story.trim() && characters.length > 0) {
      setIsGenerating(true);
      setGenerationProgress({ current: 0, total: 0 });

      try {
        const generatedPanels = await AIGenerateComicPanels(
          story,
          characters,
          style,
          (current, total) => {
            setGenerationProgress({ current, total });
          }
        );
        setPanels(generatedPanels);
        setCurrentStep(4);
      } catch (error) {
        console.error('Error generating comic:', error);
        alert('Failed to generate comic. Please try again.');
      } finally {
        setIsGenerating(false);
      }
    }
  };

  const handleRegenerate = () => {
    setPanels([]);
    setCurrentStep(3);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <StoryInput
            story={story}
            onStoryChange={setStory}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 2:
        return (
          <CharacterTagging
            characters={characters}
            onCharactersChange={setCharacters}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <StyleSelector
            style={style}
            onStyleChange={setStyle}
            onNext={handleGenerateComic}
            onBack={handleBack}
          />
        );
      case 4:
        return (
          <ComicPreview
            panels={panels}
            progress={generationProgress}
            onRegenerate={handleRegenerate}
            onBack={handleBack}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background-dark halftone-bg relative overflow-hidden">
      {/* Background comic texture */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIgLz48L3N2Zz4=')]"></div>

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b-4 border-black bg-background-dark">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-lg bg-primary shadow-pop-out border-4 border-black flex items-center justify-center transform hover:-translate-y-1 transition-transform">
                  <Sparkles className="text-black" size={28} strokeWidth={3} />
                </div>
                <h1 className="text-4xl font-display tracking-wider text-primary text-shadow-comic">
                  COMIC CRAFT
                </h1>
              </div>

              {/* Progress Steps */}
              <div className="hidden md:flex items-center gap-4">
                {steps.map((step, index) => (
                  <React.Fragment key={step.id}>
                    <button
                      onClick={() => handleStepClick(step.id)}
                      disabled={step.id > currentStep}
                      className={`px-4 py-2 rounded-lg border-2 border-black font-bold transition-all duration-200 ease-in-out ${
                        step.id === currentStep
                          ? 'bg-primary text-text-light shadow-pop-out-dark hover:-translate-y-1'
                          : step.id < currentStep
                          ? 'bg-secondary text-white shadow-pop-out-dark hover:-translate-y-1'
                          : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      <span className="text-sm">{step.name}</span>
                    </button>
                    {index < steps.length - 1 && (
                      <div className="w-8 h-0.5 bg-gray-500"></div>
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Mobile Step Indicator */}
              <div className="md:hidden px-4 py-2 bg-primary text-text-light rounded-lg border-2 border-black font-bold text-sm shadow-pop-out-dark">
                STEP {currentStep}/4
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-6 py-12">
          {renderCurrentStep()}
        </main>
      </div>

      {/* Loading Overlay */}
      {isGenerating && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 halftone-bg">
          <div className="bg-background-dark border-4 border-primary rounded-2xl p-12 text-center max-w-md mx-4 shadow-pop-out-xl">
            <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mx-auto mb-6 animate-bounce border-4 border-black">
              <Sparkles className="text-black" size={40} strokeWidth={3} />
            </div>
            <h3 className="text-4xl font-display text-primary mb-4 text-shadow-comic">CRAFTING!</h3>
            <p className="text-text-dark/80 mb-8 text-lg font-semibold">Your comic is being crafted...</p>

            {/* Progress Bar */}
            <div className="w-full h-6 bg-gray-800 rounded-full border-2 border-black overflow-hidden shadow-inner">
              <div
                className="bg-gradient-to-r from-primary via-primary-dark to-primary h-full rounded-full transition-all duration-500 border-r-2 border-black"
                style={{ width: `${generationProgress.total > 0 ? (generationProgress.current / generationProgress.total) * 100 : 0}%` }}
              />
            </div>
            <p className="text-primary font-bold mt-4 text-lg">
              {generationProgress.current} / {generationProgress.total} PANELS
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
