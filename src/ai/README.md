# AI Module Architecture

## Overview

The AI module provides a clean, modular, and extensible architecture for integrating AI services into the ComicGenius application. It follows SOLID principles with clear separation of concerns, dependency injection, and interface-based design.

## Architecture

```
src/ai/
├── index.ts                          # Public API - Main entry point
├── AIServiceFactory.ts               # Service factory and dependency management
├── core/                             # Core abstractions
│   └── AIBaseProvider.ts            # Abstract base class for all providers
├── providers/                        # AI provider implementations
│   └── gemini/                      # Gemini AI provider
│       ├── AIGeminiCharacterService.ts
│       ├── AIGeminiComicService.ts
│       └── AIGeminiVideoService.ts
├── types/                           # Type definitions and interfaces
│   └── index.ts                     # All AI-related types
├── utils/                           # Utility functions
│   └── AIImageUtils.ts             # Image processing utilities
└── models/                          # (Reserved for future use)
```

## Design Patterns

### 1. **Factory Pattern**
- `AIServiceFactory` manages the creation and lifecycle of all AI services
- Singleton pattern ensures single instance across the application

### 2. **Strategy Pattern**
- Different AI providers (Gemini, OpenAI, etc.) can be swapped via configuration
- Services implement common interfaces

### 3. **Facade Pattern**
- Public API (`index.ts`) provides simple functions hiding complex implementation
- Clean separation between external API and internal architecture

### 4. **Template Method Pattern**
- `AIBaseProvider` defines initialization workflow
- Concrete providers implement provider-specific logic

## Core Components

### AIServiceFactory

Central factory for managing all AI service instances:

```typescript
import { AIServiceFactory, AIServiceProvider } from './ai';

// Initialize services
await AIServiceFactory.initialize(AIServiceProvider.GEMINI);

// Get service instances
const characterService = AIServiceFactory.getCharacterService();
const comicService = AIServiceFactory.getComicService();
const videoService = AIServiceFactory.getVideoService();
```

### Service Interfaces

#### IAICharacterService
- Extract characters from story text
- Generate character images

#### IAIComicService
- Generate comic panels from story

#### IAIVideoService
- Generate videos from comic panels
- Download videos to disk

### AIBaseProvider

Abstract base class that all providers must extend:

```typescript
export abstract class AIBaseProvider implements IAIProvider {
  protected async initialize(config: AIProviderConfig): Promise<void>
  protected abstract onInitialize(): Promise<void>
  protected ensureInitialized(): void
  protected getConfig(): AIProviderConfig
}
```

## Usage

### Initialization

```typescript
import { initializeAI, AIServiceProvider } from './ai';

// Initialize with default (Gemini) provider
await initializeAI();

// Or specify provider explicitly
await initializeAI(AIServiceProvider.GEMINI);
```

### Character Services

```typescript
import { AIExtractCharacters, AIGenerateCharacterImage } from './ai';

// Extract characters from story
const characters = await AIExtractCharacters(storyText);

// Generate character image
const imageUrl = await AIGenerateCharacterImage('Hero', 'A brave warrior');
```

### Comic Generation

```typescript
import { AIGenerateComicPanels } from './ai';

const panels = await AIGenerateComicPanels(
  storyText,
  characters,
  style,
  (current, total) => {
    console.log(`Progress: ${current}/${total}`);
  }
);
```

### Video Generation

```typescript
import { AIGenerateVideo, AIDownloadVideo } from './ai';

// Generate video
const videoUrl = await AIGenerateVideo(
  panelImage,
  narration,
  characters,
  (status) => console.log(status)
);

// Download video
await AIDownloadVideo(videoUrl, 'panel-1-video.mp4');
```

## Adding New Providers

To add a new AI provider (e.g., OpenAI):

1. **Create provider directory**:
   ```
   src/ai/providers/openai/
   ```

2. **Implement service classes** extending `AIBaseProvider`:
   ```typescript
   export class AIOpenAICharacterService extends AIBaseProvider implements IAICharacterService {
     // Implementation
   }
   ```

3. **Register in factory**:
   ```typescript
   // In AIServiceFactory.ts
   export enum AIServiceProvider {
     GEMINI = 'gemini',
     OPENAI = 'openai', // Add new provider
   }
   ```

4. **Update initialization logic**:
   ```typescript
   case AIServiceProvider.OPENAI:
     this.characterService = new AIOpenAICharacterService();
     // ...
     break;
   ```

## Benefits

### 1. **Isolation**
- Each service is self-contained
- No direct dependencies between services
- Easy to test and mock

### 2. **Extensibility**
- Add new providers without modifying existing code
- Implement new AI services by extending base classes

### 3. **Maintainability**
- Clear structure and naming conventions
- Single responsibility for each component
- Type-safe interfaces

### 4. **Testability**
- Interface-based design enables easy mocking
- Dependency injection via factory
- Isolated unit testing

### 5. **Scalability**
- Easy to add new features
- Support multiple AI providers
- Swap providers at runtime

## Naming Conventions

All AI-related entities are prefixed with `AI`:
- `AIServiceFactory`
- `AIBaseProvider`
- `AIExtractCharacters`
- `AIGenerateVideo`
- etc.

This ensures:
- Clear identification of AI-related code
- No naming conflicts
- Consistent API surface

## Type Safety

All services use TypeScript interfaces and types:
- Request/Response types for all operations
- Generic progress callbacks
- Strongly-typed configuration

## Error Handling

Services implement consistent error handling:
- Meaningful error messages
- Error logging for debugging
- Graceful fallbacks where appropriate

## Future Enhancements

- Add caching layer for API responses
- Implement retry logic with exponential backoff
- Add request queuing and rate limiting
- Support batch operations
- Add monitoring and analytics
- Implement A/B testing for different providers
