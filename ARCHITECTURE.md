# ComicGenius - Architecture Overview

## Project Structure

```
comicgenius-nextjs/
├── src/
│   ├── ai/                           # AI Services Module (NEW!)
│   │   ├── index.ts                 # Public API
│   │   ├── AIServiceFactory.ts      # Service factory & DI
│   │   ├── README.md                # AI module documentation
│   │   ├── core/
│   │   │   └── AIBaseProvider.ts    # Base class for providers
│   │   ├── providers/
│   │   │   └── gemini/              # Gemini AI implementation
│   │   │       ├── AIGeminiCharacterService.ts
│   │   │       ├── AIGeminiComicService.ts
│   │   │       └── AIGeminiVideoService.ts
│   │   ├── types/
│   │   │   └── index.ts             # AI type definitions
│   │   └── utils/
│   │       └── AIImageUtils.ts      # Image utilities
│   │
│   ├── services/                     # Non-AI Services
│   │   └── pdfService.ts            # PDF generation (jsPDF)
│   │
│   ├── components/                   # React components
│   ├── app/                         # Next.js app directory
│   └── types/                       # Global type definitions
│
├── ARCHITECTURE.md                   # This file
├── MIGRATION_GUIDE.md               # Migration documentation
└── README.md                        # Project README
```

## Folder Organization

### `/src/ai/` - AI Services Module

**Purpose**: All AI-related functionality (Gemini, future: OpenAI, Anthropic, etc.)

**Why AI folder?**
- Clear separation of AI logic from other services
- Extensible architecture for multiple AI providers
- Isolated, testable, and maintainable
- All AI functions prefixed with `AI` for clarity

**What's inside:**
- Character extraction from stories
- Character image generation
- Comic panel generation
- Video generation from panels
- Provider abstractions and interfaces

### `/src/services/` - General Services

**Purpose**: Non-AI services and utilities

**Current services:**
- `pdfService.ts` - PDF generation using jsPDF

**Why keep services folder?**
- Not all services are AI-related
- PDF generation is a utility service
- Clear separation of concerns
- Room for future non-AI services (analytics, storage, etc.)

## Architecture Decisions

### ✅ **Decision 1: Separate AI Module**

**Rationale:**
- AI services have unique characteristics (API keys, rate limits, providers)
- Need for swappable providers (Gemini → OpenAI)
- Growing complexity deserves dedicated architecture
- Clear naming with `AI` prefix

**Benefits:**
- Easy to add new AI providers
- Isolated testing and mocking
- Clear mental model
- Extensible for future AI features

### ✅ **Decision 2: Keep Services Folder**

**Rationale:**
- PDF generation is not AI-related
- Services folder remains for general utilities
- Avoids putting everything in one place
- Future-proof for non-AI services

**Examples of future services:**
- `analyticsService.ts`
- `storageService.ts`
- `emailService.ts`
- `exportService.ts`

### ✅ **Decision 3: Remove Old geminiService.ts**

**Rationale:**
- Fully migrated to new AI architecture
- No components using old service
- Avoids confusion and duplicate code
- Clean codebase

**Verification:**
```bash
# No imports found ✓
grep -r "geminiService" src/
```

## Service Usage

### AI Services

```typescript
// Initialize once in app
import { initializeAI } from './ai';
await initializeAI();

// Use AI services
import {
  AIExtractCharacters,
  AIGenerateCharacterImage,
  AIGenerateComicPanels,
  AIGenerateVideo,
  AIDownloadVideo
} from './ai';
```

### General Services

```typescript
// Use directly
import { downloadComicPDF, generateComicPDF } from './services/pdfService';
```

## Component Integration

### Frontend ✅ Fully Integrated

All components use the new AI services:

1. **[src/app/page.tsx](src/app/page.tsx)**
   - ✅ Initializes AI on mount
   - ✅ Uses `AIExtractCharacters`
   - ✅ Uses `AIGenerateComicPanels`

2. **[src/components/ComicPreview.tsx](src/components/ComicPreview.tsx)**
   - ✅ Uses `AIGenerateVideo`
   - ✅ Uses `AIDownloadVideo`
   - ✅ Uses `downloadComicPDF` (from services)

3. **[src/components/CharacterTagging.tsx](src/components/CharacterTagging.tsx)**
   - ✅ Uses `AIGenerateCharacterImage`

## Design Patterns

### 1. Factory Pattern
```typescript
// Central factory manages all AI services
AIServiceFactory.initialize();
const service = AIServiceFactory.getCharacterService();
```

### 2. Strategy Pattern
```typescript
// Swap providers easily
initializeAI(AIServiceProvider.GEMINI);
// Future: initializeAI(AIServiceProvider.OPENAI);
```

### 3. Facade Pattern
```typescript
// Simple public API hides complexity
import { AIGenerateVideo } from './ai';
// No need to know about providers, factories, etc.
```

### 4. Template Method
```typescript
// Base class defines structure
class AIBaseProvider {
  async initialize() {
    // Common logic
    await this.onInitialize(); // Hook for providers
  }
}
```

## Type Safety

All services use TypeScript:
- Request/Response interfaces
- Progress callback types
- Provider configuration types
- Compile-time checking

## Testing Strategy

### Unit Tests
- Mock AI providers using interfaces
- Test service isolation
- Verify factory patterns

### Integration Tests
- Test component → service integration
- Verify data flow
- Test error handling

### E2E Tests
- Full user workflows
- AI generation flows
- Video generation pipeline

## Future Enhancements

### AI Module
- [ ] Add OpenAI provider
- [ ] Add Anthropic provider
- [ ] Implement caching layer
- [ ] Add retry logic
- [ ] Rate limiting
- [ ] Request queuing

### Services
- [ ] Analytics service
- [ ] Cloud storage service
- [ ] Email service
- [ ] Export service (multiple formats)

## Performance Considerations

### AI Services
- Async/await throughout
- Progress callbacks for UX
- Rate limit handling
- Sequential processing for Gemini
- Blob URLs for videos

### PDF Service
- Image optimization
- Lazy loading
- Efficient canvas rendering

## Security

### API Keys
- Environment variables only
- Never committed to repo
- Server-side validation

### File Handling
- Blob URLs for temporary storage
- Proper cleanup
- Size limits

## Monitoring & Logging

Current:
- Console logging for errors
- Progress tracking

Future:
- Error tracking (Sentry)
- Performance monitoring
- Usage analytics

## Summary

The architecture now has:

✅ **Clear separation**: AI services in `/ai/`, general services in `/services/`
✅ **No old code**: geminiService.ts removed
✅ **Fully integrated**: All components using new AI module
✅ **Extensible**: Easy to add new providers and services
✅ **Maintainable**: Clear structure, single responsibility
✅ **Type-safe**: Full TypeScript coverage
✅ **Build passing**: No errors or warnings

The frontend is fully tied to the new AI services, and the old Gemini service has been completely removed! 🎉
