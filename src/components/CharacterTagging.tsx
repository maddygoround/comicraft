'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Plus,
  Search,
  Edit3,
  Trash2,
  Upload,
  CheckCircle,
  AlertCircle,
  X,
  Sparkles,
  Lightbulb,
  BookOpen,
  Wand2
} from 'lucide-react';
import { Card } from './ui/Card';
import { Character } from '../types';
import { generateAnimeCharacter } from '../services/geminiService';

interface CharacterTaggingProps {
  characters: Character[];
  onCharactersChange: (characters: Character[]) => void;
  onNext: () => void;
  onBack: () => void;
}

interface CharacterCardProps {
  character: Character;
  onEdit: (id: string, newName: string) => void;
  onDelete: (id: string) => void;
  onPhotosChange: (id: string, photos: Character['photos']) => void;
  onAnimeGenerate: (id: string, generatedImage: string) => void;
}

const CharacterCard: React.FC<CharacterCardProps> = ({
  character,
  onEdit,
  onDelete,
  onPhotosChange,
  onAnimeGenerate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(character.name);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isGeneratingAnime, setIsGeneratingAnime] = useState(false);

  const handleEdit = () => {
    if (isEditing && editName.trim() && editName !== character.name) {
      onEdit(character.id, editName.trim());
    }
    setIsEditing(!isEditing);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEdit();
    } else if (e.key === 'Escape') {
      setEditName(character.name);
      setIsEditing(false);
    }
  };

  const handleAnimeGenerate = async () => {
    setIsGeneratingAnime(true);
    try {
      const generatedImage = await generateAnimeCharacter(character.name);
      onAnimeGenerate(character.id, generatedImage);
    } catch (error) {
      console.error('Error generating anime character:', error);
      alert('Failed to generate anime character. Please try again.');
    } finally {
      setIsGeneratingAnime(false);
    }
  };

  const handleFileUpload = (files: FileList) => {
    const newPhotos: Character['photos'] = Array.from(files).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      url: URL.createObjectURL(file),
      file,
    }));
    onPhotosChange(character.id, [...character.photos, ...newPhotos]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files) as File[];
    if (files.length > 0) {
      handleFileUpload(files as any);
    }
  };

  const removePhoto = (photoId: string) => {
    const updatedPhotos = character.photos.filter(photo => photo.id !== photoId);
    onPhotosChange(character.id, updatedPhotos);
  };

  return (
    <div
      className={`glass rounded-2xl border transition-all duration-300 group hover:shadow-2xl hover:shadow-[#B7A3E3]/10 ${isDragOver
          ? 'border-[#B7A3E3]/70 bg-[#B7A3E3]/10 scale-105'
          : 'border-white/10 hover:border-[#B7A3E3]/50'
        }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#B7A3E3] to-[#FF8F8F] flex items-center justify-center text-white font-bold text-lg">
              {character.name.charAt(0).toUpperCase()}
            </div>
            <div>
              {isEditing ? (
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className="bg-transparent text-white text-lg font-semibold border-b border-[#B7A3E3] focus:outline-none focus:border-[#C2E2FA]"
                  autoFocus
                />
              ) : (
                <h3 className="text-white text-lg font-semibold">{character.name}</h3>
              )}
              <div className="flex items-center gap-2 mt-1">
                {character.photos.length > 0 ? (
                  <div className="flex items-center gap-2 text-[#C2E2FA]">
                    <CheckCircle size={16} />
                    <span className="text-sm font-medium">Ready for AI</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-[#FFF1CB]">
                    <AlertCircle size={16} />
                    <span className="text-sm font-medium">Add reference image</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleAnimeGenerate}
              disabled={isGeneratingAnime}
              className="p-2 text-gray-400 hover:text-[#A183B8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Generate anime-style character"
            >
              {isGeneratingAnime ? (
                <div className="w-4 h-4 border-2 border-[#A183B8] border-t-transparent rounded-full animate-spin" />
              ) : (
                <Wand2 size={16} />
              )}
            </button>
            <button
              onClick={handleEdit}
              className="p-2 text-gray-400 hover:text-[#C2E2FA] transition-colors"
            >
              <Edit3 size={16} />
            </button>
            <button
              onClick={() => onDelete(character.id)}
              className="p-2 text-gray-400 hover:text-[#FF8F8F] transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Photos */}
      <div className="p-6">
        {character.photos.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {character.photos.map((photo) => (
              <div key={photo.id} className="relative group">
                <img
                  src={photo.url}
                  alt={character.name}
                  className="w-full h-24 object-cover rounded-lg border border-white/10"
                />
                <button
                  onClick={() => removePhoto(photo.id)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-[#FF8F8F] text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="border-2 border-dashed border-[#B7A3E3]/30 rounded-xl p-8 text-center hover:border-[#B7A3E3]/50 transition-colors">
            <Upload className="w-8 h-8 text-[#B7A3E3] mx-auto mb-3" />
            <p className="text-gray-300 text-sm mb-2">Drop images here or click to upload</p>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
              className="hidden"
              id={`upload-${character.id}`}
            />
            <label
              htmlFor={`upload-${character.id}`}
              className="inline-block px-4 py-2 bg-[#B7A3E3]/20 text-[#B7A3E3] rounded-lg cursor-pointer hover:bg-[#B7A3E3]/30 transition-colors"
            >
              Choose Files
            </label>
          </div>
        )}
      </div>
    </div>
  );
};

export const CharacterTagging: React.FC<CharacterTaggingProps> = ({
  characters,
  onCharactersChange,
  onNext,
  onBack,
}) => {
  const [showAddCharacter, setShowAddCharacter] = useState(false);
  const [newCharacterName, setNewCharacterName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCharacters, setFilteredCharacters] = useState<Character[]>(characters);

  useEffect(() => {
    if (searchTerm) {
      const filtered = characters.filter(char =>
        char.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCharacters(filtered);
    } else {
      setFilteredCharacters(characters);
    }
  }, [characters, searchTerm]);

  const handleEditCharacter = (id: string, newName: string) => {
    const updated = characters.map(char =>
      char.id === id ? { ...char, name: newName } : char
    );
    onCharactersChange(updated);
  };

  const handleDeleteCharacter = (id: string) => {
    const updated = characters.filter(char => char.id !== id);
    onCharactersChange(updated);
  };

  const handlePhotosChange = (id: string, photos: Character['photos']) => {
    const updated = characters.map(char =>
      char.id === id ? { ...char, photos } : char
    );
    onCharactersChange(updated);
  };

  const handleAnimeGenerate = (id: string, generatedImage: string) => {
    const character = characters.find(char => char.id === id);
    if (character) {
      const newPhoto = {
        id: Math.random().toString(36).substr(2, 9),
        url: generatedImage,
      };
      const updatedPhotos = [...character.photos, newPhoto];
      handlePhotosChange(id, updatedPhotos);
    }
  };

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

  const charactersWithPhotos = characters.filter(char => char.photos.length > 0).length;
  const totalPhotos = characters.reduce((sum, char) => sum + char.photos.length, 0);

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-full">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#B7A3E3] to-[#FF8F8F] flex items-center justify-center">
              <Users className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Define Your Characters</h1>
              <p className="text-gray-300 text-lg">
                Add reference photos to help AI create consistent characters
              </p>
            </div>
          </div>

          {/* Character Counter */}
          <div className="relative">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#B7A3E3] to-[#FF8F8F] flex items-center justify-center text-white font-bold text-2xl shadow-2xl shadow-[#B7A3E3]/50">
              {characters.length || '?'}
            </div>
            {charactersWithPhotos > 0 && (
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#C2E2FA] rounded-full flex items-center justify-center">
                <CheckCircle className="text-gray-800" size={16} />
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <button
            onClick={() => setShowAddCharacter(true)}
            className="px-6 py-3 bg-gradient-to-r from-[#C2E2FA] to-[#B7A3E3] hover:from-[#C2E2FA]/80 hover:to-[#B7A3E3]/80 text-gray-800 font-semibold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg flex items-center gap-2"
          >
            <Plus size={20} />
            Add Character
          </button>

          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search characters..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 glass border border-white/10 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-[#B7A3E3] focus:border-transparent focus:outline-none rounded-xl transition-all duration-300"
            />
          </div>
        </div>

        {/* Character Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="glass rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-[#C2E2FA]">{charactersWithPhotos}</div>
            <div className="text-sm text-gray-400">With Photos</div>
          </div>
          <div className="glass rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-[#FFF1CB]">{totalPhotos}</div>
            <div className="text-sm text-gray-400">Total Photos</div>
          </div>
          <div className="glass rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-[#B7A3E3]">{characters.length}</div>
            <div className="text-sm text-gray-400">Characters</div>
          </div>
        </div>

        {/* Characters Grid */}
        <div className="flex-1 overflow-y-auto">
          {filteredCharacters.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCharacters.map((character) => (
                <CharacterCard
                  key={character.id}
                  character={character}
                  onEdit={handleEditCharacter}
                  onDelete={handleDeleteCharacter}
                  onPhotosChange={handlePhotosChange}
                  onAnimeGenerate={handleAnimeGenerate}
                />
              ))}
            </div>
          ) : searchTerm ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-300 mb-2">No Characters Found</h3>
              <p className="text-gray-400">Try adjusting your search terms</p>
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-300 mb-2">No Characters Yet</h3>
              <p className="text-gray-400 mb-6">Add characters to get started</p>
              <button
                onClick={() => setShowAddCharacter(true)}
                className="px-6 py-3 bg-gradient-to-r from-[#C2E2FA] to-[#B7A3E3] text-gray-800 font-semibold rounded-xl hover:scale-105 transition-all duration-300"
              >
                Add Your First Character
              </button>
            </div>
          )}
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
            className="px-8 py-3 bg-gradient-to-r from-[#C2E2FA] to-[#B7A3E3] hover:from-[#C2E2FA]/80 hover:to-[#B7A3E3]/80 text-gray-800 font-semibold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
          >
            Next: Choose Style
          </button>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-full lg:w-80 space-y-6">
        {/* AI Insights */}
        <Card>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#B7A3E3] to-[#FF8F8F] flex items-center justify-center">
              <Sparkles className="text-white" size={16} />
            </div>
            <h3 className="text-lg font-semibold text-white">AI Insights</h3>
          </div>
          <div className="space-y-3 text-sm text-gray-300">
            <p>
              {charactersWithPhotos > 0
                ? `Great! ${charactersWithPhotos} character${charactersWithPhotos > 1 ? 's have' : ' has'} reference photos.`
                : 'Add reference photos to help AI create consistent character appearances.'}
            </p>
            <p>
              {characters.length > 0
                ? `Found ${characters.length} character${characters.length > 1 ? 's' : ''} in your story.`
                : 'No characters detected yet.'}
            </p>
          </div>
        </Card>

        {/* Pro Tips */}
        <Card>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#C2E2FA] to-[#B7A3E3] flex items-center justify-center">
              <Lightbulb className="text-white" size={16} />
            </div>
            <h3 className="text-lg font-semibold text-white">Pro Tips</h3>
          </div>
          <ol className="space-y-3 text-sm text-gray-300">
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-[#B7A3E3] text-white text-xs rounded-full flex items-center justify-center font-bold shrink-0">1</span>
              <span>Use clear, well-lit photos for best results</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-[#FF8F8F] text-white text-xs rounded-full flex items-center justify-center font-bold shrink-0">2</span>
              <span>Include different angles and expressions</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-[#C2E2FA] text-white text-xs rounded-full flex items-center justify-center font-bold shrink-0">3</span>
              <span>Add multiple photos per character for consistency</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-[#FFF1CB] text-white text-xs rounded-full flex items-center justify-center font-bold shrink-0">4</span>
              <span>Drag and drop images directly onto character cards</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-[#A183B8] text-white text-xs rounded-full flex items-center justify-center font-bold shrink-0">5</span>
              <span>Use the magic wand button to generate anime-style characters with AI</span>
            </li>
          </ol>
        </Card>

        {/* Story Context */}
        <Card>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF8F8F] to-[#B7A3E3] flex items-center justify-center">
              <BookOpen className="text-white" size={16} />
            </div>
            <h3 className="text-lg font-semibold text-white">Story Context</h3>
          </div>
          <div className="text-sm text-gray-300">
            <p className="mb-2">Characters will appear in your comic based on their role in the story.</p>
            <p>Make sure to add photos for main characters to get the best visual results.</p>
          </div>
        </Card>
      </div>

      {/* Add Character Modal */}
      {showAddCharacter && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="glass rounded-2xl border border-white/10 p-8 w-full max-w-md">
            <h3 className="text-xl font-semibold text-white mb-6">Add New Character</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Character Name
                </label>
                <input
                  type="text"
                  value={newCharacterName}
                  onChange={(e) => setNewCharacterName(e.target.value)}
                  placeholder="Enter character name..."
                  className="w-full px-4 py-3 glass border border-white/10 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-[#B7A3E3] focus:border-transparent focus:outline-none rounded-xl transition-all duration-300"
                  autoFocus
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowAddCharacter(false)}
                  className="flex-1 px-4 py-3 glass border border-white/10 text-gray-300 hover:text-white hover:border-white/20 rounded-xl transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCharacter}
                  disabled={!newCharacterName.trim()}
                  className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${newCharacterName.trim()
                      ? 'bg-gradient-to-r from-[#C2E2FA] to-[#B7A3E3] hover:from-[#C2E2FA]/80 hover:to-[#B7A3E3]/80 text-gray-800 hover:scale-105 shadow-lg'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    }`}
                >
                  Add Character
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
