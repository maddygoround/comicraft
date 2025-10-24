'use client';

import React, { useState } from 'react';
import {
    Sparkles,
    Download,
    Share2,
    RotateCcw,
    MessageSquare,
    X,
    AlertTriangle,
    Video,
    Loader2
} from 'lucide-react';
import { Card } from './ui/Card';
import { ComicPanel } from '../types';
import { downloadComicPDF } from '../services/pdfService';
import { AIGenerateVideo, AIDownloadVideo } from '../ai';

interface ComicPreviewProps {
    panels: ComicPanel[];
    progress: { current: number; total: number };
    onRegenerate: () => void;
    onBack: () => void;
}

interface ComicPanelDisplayProps {
    panel: ComicPanel;
    onClick: () => void;
    onGenerateVideo: () => void;
    isGeneratingVideo: boolean;
    hasGeneratedVideo: boolean;
    onViewVideo: () => void;
}

const ComicPanelDisplay: React.FC<ComicPanelDisplayProps> = ({ panel, onClick, onGenerateVideo, isGeneratingVideo, hasGeneratedVideo, onViewVideo }) => {
    return (
        <div
            className="bg-background-dark rounded-lg overflow-hidden border-2 border-primary shadow-pop-out-dark flex flex-col group transition-all duration-200 hover:-translate-y-1"
        >
            <div className="relative">
                <img
                    src={panel.generatedImage}
                    alt={`Panel ${panel.panelNumber}`}
                    className="w-full h-64 object-cover cursor-pointer"
                    onClick={onClick}
                />
                <div className="absolute top-3 left-3 bg-primary text-text-light text-xs font-bold px-3 py-1.5 rounded-lg border-2 border-black shadow-pop-out z-10">
                    Panel {panel.panelNumber}
                </div>
                {hasGeneratedVideo ? (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onViewVideo();
                        }}
                        className="absolute top-3 right-3 bg-secondary text-text-light px-3 py-2 rounded-lg border-2 border-black font-bold shadow-pop-out hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2 z-10"
                        title="View generated video"
                    >
                        <Video size={16} strokeWidth={2.5} />
                        <span className="text-xs">View Video</span>
                    </button>
                ) : (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onGenerateVideo();
                        }}
                        disabled={isGeneratingVideo}
                        className="absolute top-3 right-3 bg-accent-green text-text-light px-3 py-2 rounded-lg border-2 border-black font-bold shadow-pop-out hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed z-10"
                        title="Generate video from this panel"
                    >
                        {isGeneratingVideo ? (
                            <>
                                <Loader2 size={16} className="animate-spin" strokeWidth={2.5} />
                                <span className="text-xs">Generating...</span>
                            </>
                        ) : (
                            <>
                                <Video size={16} strokeWidth={2.5} />
                                <span className="text-xs">Generate Video</span>
                            </>
                        )}
                    </button>
                )}
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
    const [generatingVideoForPanel, setGeneratingVideoForPanel] = useState<number | null>(null);
    const [videoProgress, setVideoProgress] = useState<string>('');
    const [generatedVideos, setGeneratedVideos] = useState<Map<number, string>>(new Map());
    const [videoError, setVideoError] = useState<string | null>(null);
    const [viewingVideoPanel, setViewingVideoPanel] = useState<number | null>(null);

    const handleDownload = async () => {
        try {
            const filename = `comic-craft-comic-${new Date().toISOString().split('T')[0]}.pdf`;
            await downloadComicPDF(panels, filename, {
                title: 'Comic Craft Comic',
                author: 'Comic Craft',
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

    const handleGenerateVideo = async (panel: ComicPanel) => {
        try {
            setGeneratingVideoForPanel(panel.panelNumber);
            setVideoError(null);
            setVideoProgress('Starting video generation...');

            const videoBlobUrl = await AIGenerateVideo(
                panel.generatedImage,
                panel.narration,
                panel.characters,
                (status) => {
                    setVideoProgress(status);
                }
            );

            // Store the generated video blob URL
            setGeneratedVideos(prev => new Map(prev).set(panel.panelNumber, videoBlobUrl));
            setVideoProgress('');

            // Show success message and automatically open video viewer
            setViewingVideoPanel(panel.panelNumber);
        } catch (error) {
            console.error('Error generating video:', error);
            setVideoError(error instanceof Error ? error.message : 'Failed to generate video');
            alert(`Failed to generate video: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setGeneratingVideoForPanel(null);
        }
    };

    const handleDownloadVideo = async (panelNumber: number) => {
        const videoUrl = generatedVideos.get(panelNumber);
        if (videoUrl) {
            try {
                const filename = `comic-panel-${panelNumber}-video-${new Date().toISOString().split('T')[0]}.mp4`;
                await AIDownloadVideo(videoUrl, filename);
            } catch (error) {
                console.error('Error downloading video:', error);
                alert('Failed to download video. Please try again.');
            }
        }
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

            {/* Video Generation Progress */}
            {generatingVideoForPanel !== null && videoProgress && (
                <div className="mb-4 p-4 bg-accent-green/20 border-2 border-accent-green rounded-lg">
                    <div className="flex items-center gap-3">
                        <Loader2 size={20} className="animate-spin text-accent-green" strokeWidth={2.5} />
                        <div>
                            <p className="text-sm font-bold text-text-dark">
                                Generating video for Panel {generatingVideoForPanel}
                            </p>
                            <p className="text-xs text-text-dark/70">{videoProgress}</p>
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
                            onGenerateVideo={() => handleGenerateVideo(panel)}
                            isGeneratingVideo={generatingVideoForPanel === panel.panelNumber}
                            hasGeneratedVideo={generatedVideos.has(panel.panelNumber)}
                            onViewVideo={() => setViewingVideoPanel(panel.panelNumber)}
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
                                    {/* Image or Video */}
                                    <div>
                                        <img
                                            src={selectedPanel.generatedImage}
                                            alt={`Panel ${selectedPanel.panelNumber}`}
                                            className="w-full h-auto rounded-lg border-2 border-black shadow-pop-out-dark"
                                        />
                                        {generatedVideos.has(selectedPanel.panelNumber) && (
                                            <button
                                                onClick={() => {
                                                    setViewingVideoPanel(selectedPanel.panelNumber);
                                                    setSelectedPanel(null);
                                                }}
                                                className="w-full mt-4 px-4 py-3 bg-secondary text-white rounded-lg border-2 border-black font-bold shadow-pop-out hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
                                            >
                                                <Video size={20} strokeWidth={2.5} />
                                                Watch Generated Video
                                            </button>
                                        )}
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

            {/* Video Viewer Modal */}
            {viewingVideoPanel !== null && generatedVideos.has(viewingVideoPanel) && (
                <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
                    <div className="w-full max-w-5xl max-h-[90vh] overflow-y-auto">
                        <div className="bg-background-dark rounded-lg border-2 border-primary overflow-hidden shadow-pop-out-dark">
                            {/* Modal Header */}
                            <div className="p-6 border-b-2 border-primary flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-secondary border-2 border-black flex items-center justify-center shadow-pop-out">
                                        <Video className="text-text-light" size={24} strokeWidth={2.5} />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-primary">Panel {viewingVideoPanel} - Video</h3>
                                        <p className="text-text-dark/60 font-medium">Generated with dialogue and narration</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setViewingVideoPanel(null)}
                                    className="p-2 rounded-lg bg-gray-700 text-white border-2 border-black hover:-translate-y-0.5 transition-all duration-200 shadow-pop-out"
                                >
                                    <X size={24} strokeWidth={2.5} />
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="p-6">
                                <video
                                    src={generatedVideos.get(viewingVideoPanel)}
                                    controls
                                    autoPlay
                                    className="w-full h-auto rounded-lg border-2 border-black shadow-pop-out-dark"
                                >
                                    Your browser does not support the video tag.
                                </video>

                                {/* Video Actions */}
                                <div className="flex gap-4 mt-6">
                                    <button
                                        onClick={() => handleDownloadVideo(viewingVideoPanel)}
                                        className="flex-1 px-6 py-3 bg-accent-green text-text-light rounded-lg border-2 border-black font-bold shadow-pop-out hover:-translate-y-1 transition-all duration-200 flex items-center justify-center gap-2"
                                    >
                                        <Download size={20} strokeWidth={2.5} />
                                        Download Video
                                    </button>
                                    <button
                                        onClick={() => {
                                            const panel = panels.find(p => p.panelNumber === viewingVideoPanel);
                                            if (panel) {
                                                setViewingVideoPanel(null);
                                                setSelectedPanel(panel);
                                            }
                                        }}
                                        className="flex-1 px-6 py-3 bg-secondary text-white rounded-lg border-2 border-black font-bold shadow-pop-out hover:-translate-y-1 transition-all duration-200"
                                    >
                                        View Panel Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
