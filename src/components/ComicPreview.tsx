'use client';

import React, { useState } from 'react';
import {
    Sparkles,
    Download,
    Share2,
    RotateCcw,
    MessageSquare,
    X,
    AlertTriangle
} from 'lucide-react';
import { Card } from './ui/Card';
import { ComicPanel } from '../types';
import { downloadComicPDF } from '../services/pdfService';

interface ComicPreviewProps {
    panels: ComicPanel[];
    progress: { current: number; total: number };
    onRegenerate: () => void;
    onBack: () => void;
}

interface ComicPanelDisplayProps {
    panel: ComicPanel;
    onClick: () => void;
}

const ComicPanelDisplay: React.FC<ComicPanelDisplayProps> = ({ panel, onClick }) => {
    return (
        <div
            className="bg-background-dark rounded-lg overflow-hidden border-2 border-primary shadow-pop-out-dark flex flex-col group transition-all duration-200 hover:-translate-y-1 cursor-pointer"
            onClick={onClick}
        >
            <div className="relative">
                <img
                    src={panel.generatedImage}
                    alt={`Panel ${panel.panelNumber}`}
                    className="w-full h-64 object-cover"
                />
                <div className="absolute top-3 left-3 bg-primary text-text-light text-xs font-bold px-3 py-1.5 rounded-lg border-2 border-black shadow-pop-out z-10">
                    Panel {panel.panelNumber}
                </div>
            </div>

            <div className="p-4 flex-1 flex flex-col">
                <p className="text-sm font-medium italic text-text-dark/80 mb-4 leading-relaxed border-l-2 border-primary pl-3">
                    "{panel.narration}"
                </p>

                {panel.characters.length > 0 && (
                    <div className="space-y-2">
                        {panel.characters.map((character, index) => (
                            <div key={index} className="flex items-start gap-2">
                                <MessageSquare size={16} className="text-primary mt-1 shrink-0" />
                                <p className="text-sm text-text-dark font-medium leading-relaxed">
                                    <span className="font-bold text-primary">{character.name}:</span> {character.dialogue}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export const ComicPreview: React.FC<ComicPreviewProps> = ({
    panels,
    progress,
    onRegenerate,
    onBack,
}) => {
    const [selectedPanel, setSelectedPanel] = useState<ComicPanel | null>(null);

    const handleDownload = async () => {
        try {
            const filename = `comicgenius-comic-${new Date().toISOString().split('T')[0]}.pdf`;
            await downloadComicPDF(panels, filename, {
                title: 'ComicGenius Comic',
                author: 'ComicGenius',
                includePageNumbers: true,
                includeTitlePage: true
            });
        } catch (error) {
            console.error('Error downloading PDF:', error);
            alert('Failed to download PDF. Please try again.');
        }
    };

    const handleShare = () => {
        // TODO: Implement share functionality
        console.log('Share comic');
    };

    if (panels.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-24 h-24 rounded-lg bg-accent-red border-2 border-black flex items-center justify-center mb-6 shadow-pop-out-dark">
                    <AlertTriangle className="text-text-light" size={32} strokeWidth={2.5} />
                </div>
                <h2 className="text-4xl font-display text-primary mb-4 text-shadow-comic">No Comic Generated Yet</h2>
                <p className="text-text-dark/80 font-medium mb-8 max-w-md">
                    Complete the previous steps to generate your comic. Make sure you have a story, characters, and style selected.
                </p>
                <button
                    onClick={onBack}
                    className="px-8 py-4 bg-secondary text-white rounded-lg border-2 border-black font-bold text-xl shadow-pop-out-dark hover:-translate-y-1 transition-all duration-200"
                >
                    Go Back to Setup
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg bg-primary border-2 border-black flex items-center justify-center shadow-pop-out-dark">
                        <Sparkles className="text-text-light" size={32} strokeWidth={2.5} />
                    </div>
                    <div>
                        <h1 className="text-5xl font-display text-primary text-shadow-comic">Your Comic is Ready!</h1>
                        <p className="text-text-dark/80 font-medium text-lg">
                            {panels.length} panel{panels.length > 1 ? 's' : ''} generated successfully
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleDownload}
                        className="px-6 py-3 bg-accent-green text-text-light rounded-lg border-2 border-black font-bold shadow-pop-out-dark hover:-translate-y-1 transition-all duration-200 flex items-center gap-2"
                    >
                        <Download size={20} strokeWidth={2.5} />
                        Download
                    </button>
                    <button
                        onClick={handleShare}
                        className="px-6 py-3 bg-secondary text-white rounded-lg border-2 border-black font-bold shadow-pop-out-dark hover:-translate-y-1 transition-all duration-200 flex items-center gap-2"
                    >
                        <Share2 size={20} strokeWidth={2.5} />
                        Share
                    </button>
                </div>
            </div>

            {/* Progress Bar */}
            {progress.current < progress.total && (
                <div className="mb-8">
                    <div className="flex justify-between text-sm text-text-dark/80 font-medium mb-2">
                        <span>Generating comic panels...</span>
                        <span className="text-primary font-bold">{progress.current} / {progress.total}</span>
                    </div>
                    <div className="w-full h-4 bg-gray-800 rounded-lg border-2 border-black overflow-hidden shadow-pop-out-dark">
                        <div
                            className="bg-gradient-to-r from-accent-green to-primary h-4 rounded-lg transition-all duration-500"
                            style={{ width: `${(progress.current / progress.total) * 100}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Comic Panels */}
            <div className="flex-1 overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                    {panels.map((panel) => (
                        <ComicPanelDisplay
                            key={panel.panelNumber}
                            panel={panel}
                            onClick={() => setSelectedPanel(panel)}
                        />
                    ))}
                </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between mt-8">
                <button
                    onClick={onBack}
                    className="px-8 py-4 bg-gray-700 text-white rounded-lg border-2 border-black font-bold text-xl shadow-pop-out-dark hover:-translate-y-1 transition-all duration-200"
                >
                    Back
                </button>
                <button
                    onClick={onRegenerate}
                    className="px-8 py-4 bg-secondary text-white rounded-lg border-2 border-black font-bold text-xl shadow-pop-out-dark hover:-translate-y-1 transition-all duration-200 flex items-center gap-2"
                >
                    <RotateCcw size={20} strokeWidth={2.5} />
                    Regenerate
                </button>
            </div>

            {/* Full Screen Modal */}
            {selectedPanel && (
                <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
                    <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <div className="bg-background-dark rounded-lg border-2 border-primary overflow-hidden shadow-pop-out-dark">
                            {/* Modal Header */}
                            <div className="p-6 border-b-2 border-primary flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-primary border-2 border-black flex items-center justify-center text-text-light font-bold shadow-pop-out">
                                        {selectedPanel.panelNumber}
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-primary">Panel {selectedPanel.panelNumber}</h3>
                                        <p className="text-text-dark/60 font-medium">Click to view full details</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedPanel(null)}
                                    className="p-2 rounded-lg bg-gray-700 text-white border-2 border-black hover:-translate-y-0.5 transition-all duration-200 shadow-pop-out"
                                >
                                    <X size={24} strokeWidth={2.5} />
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="p-6">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {/* Image */}
                                    <div>
                                        <img
                                            src={selectedPanel.generatedImage}
                                            alt={`Panel ${selectedPanel.panelNumber}`}
                                            className="w-full h-auto rounded-lg border-2 border-black shadow-pop-out-dark"
                                        />
                                    </div>

                                    {/* Text Content */}
                                    <div className="space-y-6">
                                        {/* Narration */}
                                        <div>
                                            <h4 className="text-xl font-bold text-secondary mb-3">Narration</h4>
                                            <p className="text-text-dark/80 font-medium leading-relaxed border-l-2 border-primary pl-4 italic">
                                                "{selectedPanel.narration}"
                                            </p>
                                        </div>

                                        {/* Dialogue */}
                                        {selectedPanel.characters.length > 0 && (
                                            <div>
                                                <h4 className="text-xl font-bold text-secondary mb-3">Dialogue</h4>
                                                <div className="space-y-3">
                                                    {selectedPanel.characters.map((character, index) => (
                                                        <div key={index} className="flex items-start gap-3">
                                                            <MessageSquare size={20} className="text-primary mt-1 shrink-0" strokeWidth={2.5} />
                                                            <div>
                                                                <p className="font-bold text-primary text-lg">{character.name}</p>
                                                                <p className="text-text-dark/80 font-medium leading-relaxed">{character.dialogue}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
