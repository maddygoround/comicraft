'use client';

import React, { useState, useEffect } from 'react';
import { BookOpen, Lightbulb } from 'lucide-react';
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
        <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-lg border-2 border-black shadow-pop-out-dark">
                        <BookOpen className="text-text-light" size={40} strokeWidth={2.5} />
                    </div>
                    <h2 className="text-6xl md:text-7xl font-display text-primary text-shadow-comic-lg tracking-wider">
                        TELL YOUR STORY!
                    </h2>
                    <p className="text-xl text-text-dark/80 font-medium max-w-2xl mx-auto">
                        Write an amazing story and we'll turn it into a comic book!
                    </p>
                </div>

                {/* Story Input */}
                <div className="relative">
                    <textarea
                        value={story}
                        onChange={handleStoryChange}
                        placeholder="Once upon a time in a galaxy far, far away..."
                        className="w-full h-96 p-6 bg-background-dark border-2 border-primary rounded-lg text-text-dark text-lg placeholder:text-text-dark/40 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none transition-all duration-200 resize-none font-medium leading-relaxed shadow-pop-out-dark"
                    />

                    {/* Character Count Badge */}
                    <div className={`absolute bottom-6 right-6 px-4 py-2 rounded-lg border-2 border-black font-bold shadow-pop-out-dark ${
                        charCount >= STORY_MIN_LENGTH ? 'bg-accent-green text-text-light' : 'bg-gray-700 text-gray-400'
                    }`}>
                        {charCount} / {STORY_MAX_LENGTH}
                    </div>
                </div>

                {/* Progress Bar */}
                <div>
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-text-dark font-bold text-lg">Story Progress</span>
                        <span className="text-primary font-bold text-lg">{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full h-4 bg-gray-800 rounded-lg border-2 border-black overflow-hidden shadow-pop-out-dark">
                        <div
                            className={`h-full transition-all duration-500 ${
                                isValid
                                    ? 'bg-gradient-to-r from-accent-green to-primary'
                                    : 'bg-gray-600'
                            }`}
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex justify-center gap-4">
                    <button
                        onClick={onNext}
                        disabled={!isValid}
                        className={`px-12 py-4 rounded-lg border-2 border-black font-bold text-xl transition-all duration-200 ease-in-out ${
                            isValid
                                ? 'bg-primary text-text-light shadow-pop-out-dark hover:-translate-y-1'
                                : 'bg-gray-700 text-gray-500 cursor-not-allowed shadow-pop-out'
                        }`}
                    >
                        Next: Define Characters
                    </button>
                </div>
        </div>
    );
};
