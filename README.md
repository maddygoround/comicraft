# ComicGenius - AI Comic Creator

Transform your stories into amazing comics with AI-powered character generation and visual storytelling.

## Features

- **Story Input**: Write your story with AI-powered character extraction
- **Character Tagging**: Add reference photos for consistent character appearances
- **Style Selection**: Choose from various comic styles, color palettes, and border styles
- **AI Generation**: Generate comic panels using Google's Gemini AI
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Modern UI**: Beautiful glassmorphism design with custom color palette
- **Vercel Ready**: Optimized for Vercel deployment

## Tech Stack

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling and responsive design
- **Lucide React** - Icons
- **Google Gemini AI** - AI-powered comic generation
- **Vercel** - Deployment platform

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Google Gemini API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd comicgenius-nextjs
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Get your Gemini API key:
- Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
- Create a new API key
- Add it to your `.env.local` file

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

### Vercel (Recommended)

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy to Vercel**:
   ```bash
   npm run deploy
   ```

3. **Set Environment Variables**:
   - Go to your Vercel dashboard
   - Navigate to your project settings
   - Add `NEXT_PUBLIC_GEMINI_API_KEY` with your Gemini API key

4. **Automatic Deployments**:
   - Connect your GitHub repository to Vercel
   - Every push to main branch will trigger a deployment
   - Preview deployments for pull requests

### Manual Deployment

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Start production server**:
   ```bash
   npm start
   ```

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- Render
- AWS Amplify

## Project Structure

```
src/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── Stepper.tsx
│   ├── CharacterTagging.tsx
│   ├── ComicPreview.tsx
│   ├── StoryInput.tsx
│   └── StyleSelector.tsx
├── constants/
│   └── index.ts
├── services/
│   └── geminiService.ts
└── types/
    └── index.ts
```

## Customization

### Color Palette

The app uses a custom color palette defined in the components:
- Primary: `#B7A3E3` (Purple)
- Secondary: `#FF8F8F` (Coral)
- Accent: `#C2E2FA` (Light Blue)
- Warning: `#FFF1CB` (Cream)

### Styling

The app uses Tailwind CSS with custom utilities:
- `.glass` - Glassmorphism effect
- `.glow-border` - Animated border effect
- Custom animations and transitions

## API Usage

The app uses Google's Gemini AI for:
- Character extraction from stories
- Comic panel text generation
- Image generation for each panel

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support, email support@comicgenius.com or create an issue on GitHub.

## Roadmap

- [ ] More comic styles and themes
- [ ] Character voice generation
- [ ] Comic export options (PDF, images)
- [ ] User accounts and saved comics
- [ ] Collaborative comic creation
- [ ] Mobile app
- [ ] Social sharing features
- [ ] Comic templates and presets# comicraft
