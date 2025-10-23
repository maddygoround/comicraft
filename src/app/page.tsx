'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  BookOpen,
  Users,
  Wand2,
  Eye,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { StoryInput } from '../components/StoryInput';
import { CharacterTagging } from '../components/CharacterTagging';
import { StyleSelector } from '../components/StyleSelector';
import { ComicPreview } from '../components/ComicPreview';
import { Stepper } from '../components/ui/Stepper';
import { Character, ComicStyle, ComicPanel } from '../types';
import { ComicStyleName, ColorPalette, BorderStyle } from '../types';
import { extractCharacters, generateComicPanels } from '../services/geminiService';

const steps = [
  {
    id: 1,
    name: 'Write Story',
    description: 'Tell your amazing story',
    icon: <BookOpen size={20} />,
  },
  {
    id: 2,
    name: 'Define Characters',
    description: 'Add character photos',
    icon: <Users size={20} />,
  },
  {
    id: 3,
    name: 'Choose Style',
    description: 'Select visual style',
    icon: <Wand2 size={20} />,
  },
  {
    id: 4,
    name: 'Generate Comic',
    description: 'Create your comic',
    icon: <Eye size={20} />,
  },
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

  // Auto-extract characters when story changes
  useEffect(() => {
    if (story.length > 100) {
      const extractChars = async () => {
        try {
          const extractedNames = await extractCharacters(story);
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
        const generatedPanels = await generateComicPanels(
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
    <div className="min-h-screen bg-gradient-to-br from-purple-dark via-purple-soft to-purple-medium">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#A183B8]/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#806294]/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#E3C5F0]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 flex h-screen">
        {/* Sidebar */}
        <div className="hidden lg:flex w-80 flex-col p-8 border-r border-white/10">
          {/* Logo */}
          <div className="flex items-center gap-4 mb-12">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#A183B8] to-[#806294] flex items-center justify-center">
              <Sparkles className="text-white" size={24} />
            </div>
            <h1 className="text-2xl font-bold font-space-grotesk bg-clip-text text-transparent bg-gradient-to-r from-[#A183B8] via-[#806294] to-[#E3C5F0]">
              ComicGenius
            </h1>
          </div>

          {/* Steps */}
          <div className="flex-1">
            <Stepper
              steps={steps}
              currentStep={currentStep}
              onStepClick={handleStepClick}
            />
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <div className="w-2 h-2 bg-[#A183B8] rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-[#806294] rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-[#E3C5F0] rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              <span className="ml-2">AI Powered</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Mobile Header */}
          <div className="lg:hidden p-4 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#A183B8] to-[#806294] flex items-center justify-center">
                  <Sparkles className="text-white" size={20} />
                </div>
                <h1 className="text-xl font-bold text-white">ComicGenius</h1>
              </div>
              <div className="text-sm text-gray-400">
                Step {currentStep} of {steps.length}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-8">
            <div className="max-w-7xl mx-auto h-full">
              {renderCurrentStep()}
            </div>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {isGenerating && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="glass rounded-2xl border border-white/10 p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#A183B8] to-[#806294] flex items-center justify-center mx-auto mb-4">
              <Sparkles className="text-white animate-spin" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Generating Your Comic</h3>
            <p className="text-gray-300 mb-4">This may take a few minutes...</p>
            <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#A183B8] via-[#806294] to-[#E3C5F0] h-full rounded-full transition-all duration-500"
                style={{ width: `${(generationProgress.current / generationProgress.total) * 100}%` }}
              />
            </div>
            <p className="text-sm text-gray-400 mt-2">
              {generationProgress.current} / {generationProgress.total} panels
            </p>
          </div>
        </div>
      )}
    </div>
  );
}