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
            className="glass rounded-xl overflow-hidden border border-white/10 hover:border-[#B7A3E3]/50 shadow-2xl flex flex-col group transition-all duration-300 hover:scale-[1.02] hover:shadow-[#B7A3E3]/20 cursor-pointer"
            onClick={onClick}
        >
            <div className="relative">
                <img
                    src={panel.generatedImage}
                    alt={`Panel ${panel.panelNumber}`}
                    className="w-full h-64 object-cover"
                />
                <div className="absolute top-3 left-3 bg-gradient-to-r from-[#B7A3E3] to-[#FF8F8F] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg z-10">
                    Panel {panel.panelNumber}
                </div>
            </div>

            <div className="p-4 flex-1 flex flex-col">
                <p className="text-sm italic text-gray-300 mb-4 leading-relaxed border-l-2 border-[#B7A3E3]/50 pl-3">
                    "{panel.narration}"
                </p>

                {panel.characters.length > 0 && (
                    <div className="space-y-2">
                        {panel.characters.map((character, index) => (
                            <div key={index} className="flex items-start gap-2">
                                <MessageSquare size={16} className="text-[#B7A3E3] mt-1 shrink-0" />
                                <p className="text-sm text-white leading-relaxed">
                                    <span className="font-bold text-[#B7A3E3]">{character.name}:</span> {character.dialogue}
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
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#FFF1CB] to-[#FF8F8F] flex items-center justify-center mb-6">
                    <AlertTriangle className="text-white" size={32} />
                </div>
                <h2 className="text-2xl font-bold text-white mb-4">No Comic Generated Yet</h2>
                <p className="text-gray-300 mb-8 max-w-md">
                    Complete the previous steps to generate your comic. Make sure you have a story, characters, and style selected.
                </p>
                <button
                    onClick={onBack}
                    className="px-8 py-3 bg-gradient-to-r from-[#C2E2FA] to-[#B7A3E3] hover:from-[#C2E2FA]/80 hover:to-[#B7A3E3]/80 text-gray-800 font-semibold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
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
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#C2E2FA] to-[#B7A3E3] flex items-center justify-center">
                        <Sparkles className="text-white" size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Your Comic is Ready!</h1>
                        <p className="text-gray-300 text-lg">
                            {panels.length} panel{panels.length > 1 ? 's' : ''} generated successfully
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleDownload}
                        className="px-4 py-2 glass border border-white/10 text-gray-300 hover:text-white hover:border-white/20 rounded-xl transition-all duration-300 flex items-center gap-2"
                    >
                        <Download size={16} />
                        Download
                    </button>
                    <button
                        onClick={handleShare}
                        className="px-4 py-2 glass border border-white/10 text-gray-300 hover:text-white hover:border-white/20 rounded-xl transition-all duration-300 flex items-center gap-2"
                    >
                        <Share2 size={16} />
                        Share
                    </button>
                </div>
            </div>

            {/* Progress Bar */}
            {progress.current < progress.total && (
                <div className="mb-8">
                    <div className="flex justify-between text-sm text-gray-400 mb-2">
                        <span>Generating comic panels...</span>
                        <span>{progress.current} / {progress.total}</span>
                    </div>
                    <div className="w-full h-4 bg-gray-700 rounded-full overflow-hidden">
                        <div
                            className="bg-gradient-to-r from-[#B7A3E3] via-[#FF8F8F] to-[#C2E2FA] h-4 rounded-full transition-all duration-500 relative overflow-hidden"
                            style={{ width: `${(progress.current / progress.total) * 100}%` }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                        </div>
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
                    className="px-6 py-3 glass border border-white/10 text-gray-300 hover:text-white hover:border-white/20 rounded-xl transition-all duration-300"
                >
                    Back
                </button>
                <button
                    onClick={onRegenerate}
                    className="px-6 py-3 glass border border-white/10 text-gray-300 hover:text-white hover:border-white/20 rounded-xl transition-all duration-300 flex items-center gap-2"
                >
                    <RotateCcw size={16} />
                    Regenerate
                </button>
            </div>

            {/* Full Screen Modal */}
            {selectedPanel && (
                <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
                    <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <div className="glass rounded-2xl border border-white/10 overflow-hidden">
                            {/* Modal Header */}
                            <div className="p-6 border-b border-white/10 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#B7A3E3] to-[#FF8F8F] flex items-center justify-center text-white font-bold">
                                        {selectedPanel.panelNumber}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white">Panel {selectedPanel.panelNumber}</h3>
                                        <p className="text-gray-300">Click to view full details</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedPanel(null)}
                                    className="p-2 text-gray-400 hover:text-white transition-colors"
                                >
                                    <X size={24} />
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
                                            className="w-full h-auto rounded-xl shadow-2xl"
                                        />
                                    </div>

                                    {/* Text Content */}
                                    <div className="space-y-6">
                                        {/* Narration */}
                                        <div>
                                            <h4 className="text-lg font-semibold text-white mb-3">Narration</h4>
                                            <p className="text-gray-300 leading-relaxed border-l-2 border-[#B7A3E3]/50 pl-4 italic">
                                                "{selectedPanel.narration}"
                                            </p>
                                        </div>

                                        {/* Dialogue */}
                                        {selectedPanel.characters.length > 0 && (
                                            <div>
                                                <h4 className="text-lg font-semibold text-white mb-3">Dialogue</h4>
                                                <div className="space-y-3">
                                                    {selectedPanel.characters.map((character, index) => (
                                                        <div key={index} className="flex items-start gap-3">
                                                            <MessageSquare size={20} className="text-[#B7A3E3] mt-1 shrink-0" />
                                                            <div>
                                                                <p className="font-bold text-[#B7A3E3] text-lg">{character.name}</p>
                                                                <p className="text-gray-300 leading-relaxed">{character.dialogue}</p>
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
