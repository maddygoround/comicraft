'use client';

import React, { useState } from 'react';
import { Users, Plus, Wand2, Upload, X } from 'lucide-react';
import { Character } from '../types';
import { generateAnimeCharacter } from '../services/geminiService';

interface CharacterTaggingProps {
  characters: Character[];
  onCharactersChange: (characters: Character[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export const CharacterTagging: React.FC<CharacterTaggingProps> = ({
  characters,
  onCharactersChange,
  onNext,
  onBack,
}) => {
  const [showAddCharacter, setShowAddCharacter] = useState(false);
  const [newCharacterName, setNewCharacterName] = useState('');
  const [isGeneratingAnime, setIsGeneratingAnime] = useState<string | null>(null);

  const handleAddCharacter = () => {
    if (newCharacterName.trim()) {
      const newCharacter: Character = {
        id: Math.random().toString(36).substr(2, 9),
        name: newCharacterName.trim(),
        photos: [],
      };
      onCharactersChange([...characters, newCharacter]);
      setNewCharacterName('');
      setShowAddCharacter(false);
    }
  };

  const handleDeleteCharacter = (id: string) => {
    onCharactersChange(characters.filter(char => char.id !== id));
  };

  const handleFileUpload = (id: string, files: FileList) => {
    const character = characters.find(c => c.id === id);
    if (!character) return;

    const newPhotos: Character['photos'] = Array.from(files).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      url: URL.createObjectURL(file),
      file,
    }));

    const updated = characters.map(char =>
      char.id === id ? { ...char, photos: [...char.photos, ...newPhotos] } : char
    );
    onCharactersChange(updated);
  };

  const handleGenerateAnime = async (id: string, name: string) => {
    setIsGeneratingAnime(id);
    try {
      const generatedImage = await generateAnimeCharacter(name);
      const character = characters.find(c => c.id === id);
      if (character) {
        const newPhoto = {
          id: Math.random().toString(36).substr(2, 9),
          url: generatedImage,
        };
        const updated = characters.map(char =>
          char.id === id ? { ...char, photos: [...char.photos, newPhoto] } : char
        );
        onCharactersChange(updated);
      }
    } catch (error) {
      console.error('Error generating anime character:', error);
      alert('Failed to generate character. Please try again.');
    } finally {
      setIsGeneratingAnime(null);
    }
  };

  const removePhoto = (charId: string, photoId: string) => {
    const updated = characters.map(char =>
      char.id === charId
        ? { ...char, photos: char.photos.filter(p => p.id !== photoId) }
        : char
    );
    onCharactersChange(updated);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-secondary rounded-lg border-2 border-black shadow-pop-out-dark">
          <Users className="text-white" size={40} strokeWidth={2.5} />
        </div>
        <h2 className="text-6xl md:text-7xl font-display text-primary text-shadow-comic-lg tracking-wider">
          DEFINE CHARACTERS!
        </h2>
        <p className="text-xl text-text-dark/80 font-medium max-w-2xl mx-auto">
          Add characters and their reference photos
        </p>
      </div>

      {/* Add Character Button */}
      <div className="flex justify-center">
        <button
          onClick={() => setShowAddCharacter(true)}
          className="flex items-center gap-2 px-8 py-4 bg-primary text-text-light rounded-lg border-2 border-black font-bold text-xl shadow-pop-out-dark hover:-translate-y-1 transition-all duration-200"
        >
          <Plus size={24} strokeWidth={3} />
          Add Character
        </button>
      </div>

      {/* Characters Grid */}
      {characters.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {characters.map((character) => (
            <div
              key={character.id}
              className="bg-background-dark border-2 border-primary rounded-lg p-6 shadow-pop-out-dark"
            >
              {/* Character Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-display text-primary">{character.name}</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleGenerateAnime(character.id, character.name)}
                    disabled={isGeneratingAnime === character.id}
                    className="p-2 bg-secondary text-white rounded border-2 border-black shadow-pop-out hover:-translate-y-0.5 transition-all disabled:opacity-50"
                    title="Generate AI character"
                  >
                    {isGeneratingAnime === character.id ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Wand2 size={20} />
                    )}
                  </button>
                  <button
                    onClick={() => handleDeleteCharacter(character.id)}
                    className="p-2 bg-accent-red text-white rounded border-2 border-black shadow-pop-out hover:-translate-y-0.5 transition-all"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Photos */}
              {character.photos.length > 0 ? (
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {character.photos.map((photo) => (
                    <div key={photo.id} className="relative group">
                      <img
                        src={photo.url}
                        alt={character.name}
                        className="w-full h-24 object-cover rounded border-2 border-black"
                      />
                      <button
                        onClick={() => removePhoto(character.id, photo.id)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-accent-red text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border-2 border-black"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border-2 border-dashed border-primary/50 rounded-lg p-6 text-center mb-4">
                  <Upload className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="text-text-dark/60 text-sm font-medium">No photos yet</p>
                </div>
              )}

              {/* Upload Button */}
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => e.target.files && handleFileUpload(character.id, e.target.files)}
                className="hidden"
                id={`upload-${character.id}`}
              />
              <label
                htmlFor={`upload-${character.id}`}
                className="block w-full px-4 py-2 bg-secondary text-white text-center rounded-lg border-2 border-black font-bold cursor-pointer shadow-pop-out hover:-translate-y-0.5 transition-all"
              >
                Upload Photo
              </label>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-primary mx-auto mb-4" />
          <h3 className="text-2xl font-display text-text-dark mb-2">No Characters Yet</h3>
          <p className="text-text-dark/60 font-medium">Click "Add Character" to get started</p>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-center gap-4">
        <button
          onClick={onBack}
          className="px-8 py-4 bg-gray-700 text-white rounded-lg border-2 border-black font-bold text-xl shadow-pop-out-dark hover:-translate-y-1 transition-all duration-200"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="px-12 py-4 bg-primary text-text-light rounded-lg border-2 border-black font-bold text-xl shadow-pop-out-dark hover:-translate-y-1 transition-all duration-200"
        >
          Next: Choose Style
        </button>
      </div>

      {/* Add Character Modal */}
      {showAddCharacter && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-background-dark rounded-lg border-2 border-primary p-8 w-full max-w-md shadow-pop-out-dark">
            <h3 className="text-3xl font-display text-primary mb-6 text-shadow-comic">ADD CHARACTER</h3>
            <input
              type="text"
              value={newCharacterName}
              onChange={(e) => setNewCharacterName(e.target.value)}
              placeholder="Character name..."
              className="w-full px-4 py-3 bg-background-dark border-2 border-primary rounded-lg text-text-dark placeholder:text-text-dark/40 focus:ring-2 focus:ring-primary focus:outline-none mb-6 font-medium"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleAddCharacter()}
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowAddCharacter(false)}
                className="flex-1 px-4 py-3 bg-gray-700 text-white rounded-lg border-2 border-black font-bold shadow-pop-out hover:-translate-y-0.5 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCharacter}
                disabled={!newCharacterName.trim()}
                className={`flex-1 px-4 py-3 rounded-lg border-2 border-black font-bold shadow-pop-out transition-all ${
                  newCharacterName.trim()
                    ? 'bg-primary text-text-light hover:-translate-y-0.5'
                    : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                }`}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
