'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, BookOpen, Lightbulb, BarChart3 } from 'lucide-react';
import { Card } from './ui/Card';
import { STORY_MIN_LENGTH, STORY_MAX_LENGTH } from '../constants';

interface StoryInputProps {
    story: string;
    onStoryChange: (story: string) => void;
    onNext: () => void;
    onBack: () => void;
}

export const StoryInput: React.FC<StoryInputProps> = ({
    story,
    onStoryChange,
    onNext,
    onBack,
}) => {
    const [charCount, setCharCount] = useState(story.length);

    useEffect(() => {
        setCharCount(story.length);
    }, [story]);

    const isValid = charCount >= STORY_MIN_LENGTH && charCount <= STORY_MAX_LENGTH;
    const progress = Math.min((charCount / STORY_MAX_LENGTH) * 100, 100);

    const handleStoryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        if (value.length <= STORY_MAX_LENGTH) {
            onStoryChange(value);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8 h-full">
            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#B7A3E3] to-[#FF8F8F] flex items-center justify-center">
                        <Sparkles className="text-white" size={24} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Tell Your Story</h1>
                        <p className="text-gray-300 text-lg">
                            Write your story and we'll turn it into an amazing comic!
                        </p>
                    </div>
                </div>

                {/* Story Input */}
                <div className="flex-1 flex flex-col">
                    <div className="flex-1 relative">
                        <textarea
                            value={story}
                            onChange={handleStoryChange}
                            placeholder="Once upon a time, in a magical kingdom far, far away..."
                            className="w-full h-full p-6 rounded-xl glass border border-white/10 text-gray-100 placeholder:text-gray-500 focus:ring-2 focus:ring-[#B7A3E3] focus:border-transparent focus:outline-none transition-all duration-300 resize-none text-base leading-relaxed"
                        />

                        {/* Character Count */}
                        <div className="absolute bottom-4 right-4 flex items-center gap-2 text-sm">
                            <span className={charCount >= STORY_MIN_LENGTH ? 'text-[#C2E2FA]' : 'text-gray-400'}>
                                {charCount}
                            </span>
                            <span className="text-gray-500">/ {STORY_MAX_LENGTH}</span>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4">
                        <div className="flex justify-between text-sm text-gray-400 mb-2">
                            <span>Story Progress</span>
                            <span>{Math.round(progress)}%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-500 ${isValid
                                    ? 'bg-gradient-to-r from-[#B7A3E3] via-[#FF8F8F] to-[#C2E2FA]'
                                    : 'bg-gradient-to-r from-gray-500 to-gray-600'
                                    }`}
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex justify-between mt-8">
                    <button
                        onClick={onBack}
                        className="px-6 py-3 glass border border-white/10 text-gray-300 hover:text-white hover:border-white/20 rounded-xl transition-all duration-300"
                    >
                        Back
                    </button>
                    <button
                        onClick={onNext}
                        disabled={!isValid}
                        className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${isValid
                            ? 'bg-gradient-to-r from-[#C2E2FA] to-[#B7A3E3] hover:from-[#C2E2FA]/80 hover:to-[#B7A3E3]/80 text-gray-800 hover:scale-105 shadow-lg'
                            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        Next: Define Characters
                    </button>
                </div>
            </div>

            {/* Right Sidebar */}
            <div className="w-full lg:w-80 space-y-6">
                {/* Writing Tips */}
                <Card>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#C2E2FA] to-[#B7A3E3] flex items-center justify-center">
                            <Lightbulb className="text-white" size={16} />
                        </div>
                        <h3 className="text-lg font-semibold text-white">Writing Tips</h3>
                    </div>
                    <ul className="space-y-3 text-sm text-gray-300">
                        <li className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-[#B7A3E3] rounded-full mt-2 shrink-0"></div>
                            <span>Include dialogue between characters</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-[#FF8F8F] rounded-full mt-2 shrink-0"></div>
                            <span>Describe actions and scenes visually</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-[#C2E2FA] rounded-full mt-2 shrink-0"></div>
                            <span>Keep it engaging and dynamic</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-[#FFF1CB] rounded-full mt-2 shrink-0"></div>
                            <span>Minimum 100 characters required</span>
                        </li>
                    </ul>
                </Card>

                {/* Example Story */}
                <Card>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF8F8F] to-[#B7A3E3] flex items-center justify-center">
                            <BookOpen className="text-white" size={16} />
                        </div>
                        <h3 className="text-lg font-semibold text-white">Example Story</h3>
                    </div>
                    <div className="text-sm text-gray-300 italic leading-relaxed">
                        "Sarah walked into the mysterious forest, her heart pounding. 'Who's there?' she called out. A voice echoed back, 'Welcome, brave traveler...'"
                    </div>
                </Card>

                {/* Story Progress */}
                <Card>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#B7A3E3] to-[#FF8F8F] flex items-center justify-center">
                            <BarChart3 className="text-white" size={16} />
                        </div>
                        <h3 className="text-lg font-semibold text-white">Story Progress</h3>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-300">Characters</span>
                            <span className="text-[#C2E2FA]">Ready</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-300">Length</span>
                            <span className={charCount >= STORY_MIN_LENGTH ? 'text-[#C2E2FA]' : 'text-[#FF8F8F]'}>
                                {charCount >= STORY_MIN_LENGTH ? 'Good' : 'Too Short'}
                            </span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-300">Style</span>
                            <span className="text-gray-400">Next Step</span>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};
