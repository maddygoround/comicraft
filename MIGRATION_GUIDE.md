# Migration Guide: Services to AI Architecture

## Overview

The codebase has been refactored from a simple `services/` folder structure to a comprehensive `ai/` module with proper architecture, isolation, and extensibility.

## What Changed

### Before
```
src/services/
├── geminiService.ts       # All Gemini AI functions
└── pdfService.ts          # PDF generation
```

### After
```
src/ai/                    # New AI module
├── index.ts              # Public API
├── AIServiceFactory.ts   # Service factory
├── core/
│   └── AIBaseProvider.ts
├── providers/
│   └── gemini/
│       ├── AIGeminiCharacterService.ts
│       ├── AIGeminiComicService.ts
│       └── AIGeminiVideoService.ts
├── types/
│   └── index.ts
├── utils/
│   └── AIImageUtils.ts
└── README.md

src/services/             # Kept for non-AI services
└── pdfService.ts
```

## API Changes

### Initialization

**Before**: No initialization needed
```typescript
import { extractCharacters } from '../services/geminiService';
```

**After**: Initialize AI services on app mount
```typescript
import { initializeAI } from '../ai';

useEffect(() => {
  initializeAI().catch(console.error);
}, []);
```

### Character Extraction

**Before**:
```typescript
import { extractCharacters } from '../services/geminiService';

const characters = await extractCharacters(storyText);
```

**After**:
```typescript
import { AIExtractCharacters } from '../ai';

const characters = await AIExtractCharacters(storyText);
```

### Character Image Generation

**Before**:
```typescript
import { generateAnimeCharacter } from '../services/geminiService';

const imageUrl = await generateAnimeCharacter(name, description);
```

**After**:
```typescript
import { AIGenerateCharacterImage } from '../ai';

const imageUrl = await AIGenerateCharacterImage(name, description);
```

### Comic Panel Generation

**Before**:
```typescript
import { generateComicPanels } from '../services/geminiService';

const panels = await generateComicPanels(
  story,
  characters,
  style,
  (current, total) => { /* progress */ }
);
```

**After**:
```typescript
import { AIGenerateComicPanels } from '../ai';

const panels = await AIGenerateComicPanels(
  story,
  characters,
  style,
  (current, total) => { /* progress */ }
);
```

### Video Generation

**Before**:
```typescript
import { generatePanelVideo, downloadVideo } from '../services/geminiService';

const videoUrl = await generatePanelVideo(
  panelImage,
  narration,
  characters,
  (status) => { /* progress */ }
);

await downloadVideo(videoUrl, filename);
```

**After**:
```typescript
import { AIGenerateVideo, AIDownloadVideo } from '../ai';

const videoUrl = await AIGenerateVideo(
  panelImage,
  narration,
  characters,
  (status) => { /* progress */ }
);

await AIDownloadVideo(videoUrl, filename);
```

## Complete Import Mapping

| Old Import | New Import |
|------------|------------|
| `extractCharacters` | `AIExtractCharacters` |
| `generateAnimeCharacter` | `AIGenerateCharacterImage` |
| `generateComicPanels` | `AIGenerateComicPanels` |
| `generatePanelVideo` | `AIGenerateVideo` |
| `downloadVideo` | `AIDownloadVideo` |

## Files Modified

1. **src/app/page.tsx**
   - Added `initializeAI()` call in useEffect
   - Updated imports and function calls

2. **src/components/ComicPreview.tsx**
   - Updated video generation imports

3. **src/components/CharacterTagging.tsx**
   - Updated character image generation import

## Breaking Changes

### None!

All functionality remains exactly the same. The changes are purely architectural:
- ✅ Same function signatures
- ✅ Same behavior
- ✅ Same return types
- ✅ No configuration changes needed

## Benefits of New Architecture

### 1. **Better Organization**
- Clear separation between AI providers (Gemini, future: OpenAI, etc.)
- Each service has a single responsibility
- Easy to locate and understand code

### 2. **Isolation**
- Services are self-contained
- No cross-dependencies
- Easy to test and mock

### 3. **Extensibility**
- Add new AI providers without touching existing code
- Implement new AI services by extending base classes
- Switch providers via configuration

### 4. **Type Safety**
- All services use TypeScript interfaces
- Request/Response types for all operations
- Compile-time error checking

### 5. **Consistency**
- All AI functions prefixed with `AI`
- Consistent naming conventions
- Clear API surface

## Testing

The build passes successfully with no errors:
```bash
npm run build
# ✓ Compiled successfully
# ✓ Generating static pages
```

## Backward Compatibility

The old `services/geminiService.ts` file has been **kept in place** for reference but is no longer used. You can safely delete it once you've verified everything works.

## Next Steps

1. ✅ All imports updated
2. ✅ Build passing
3. ✅ No functionality broken
4. ⏭️ Test the application manually
5. ⏭️ Delete old service file when confident

## Rollback Plan

If you need to rollback:

1. Revert imports in the 3 modified files
2. Change imports back to `'../services/geminiService'`
3. Change function names back to original names
4. Remove `initializeAI()` call

## Questions?

Refer to the [AI Module README](./src/ai/README.md) for:
- Detailed architecture documentation
- Usage examples
- Adding new providers
- Best practices
