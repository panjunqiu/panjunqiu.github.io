# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React-based interactive music staff reading practice application (五线谱识谱练习) that helps music learners improve their staff reading skills and reaction speed. The app generates random notes in the range C4-A5 (covering 13 notes from do to la₅) and provides real-time feedback.

## Development Commands

### Essential Commands
- `npm run dev` - Start development server (runs on port 3000)
- `npm run build` - Build production bundle
- `npm install` - Install dependencies

### Development Workflow
1. Start development: `npm run dev`
2. Access application: `http://localhost:3000`
3. Build for production: `npm run build` (outputs to root directory as bundle.js)

## Architecture & Structure

### Core Architecture
The application follows a single-page React component architecture:
- **Main App Component** (`src/App.jsx`): ~46KB file containing the entire application logic and state management
- **Sub-components**: Three specialized components for different UI sections
- **Styles**: Tailwind CSS for styling with custom PostCSS configuration

### Component Structure
```
src/
├── App.jsx              # Main application component (contains all business logic)
├── index.jsx            # React root entry point
├── components/
│   ├── MusicStaff.jsx   # SVG-based staff notation renderer
│   ├── Piano.jsx        # Virtual piano keyboard interface
│   └── ScoreBoard.jsx   # Statistics and scoring display
└── styles/
    └── index.css        # Base styles and Tailwind imports
```

### Key Technical Features

#### Audio System
- Uses Web Audio API for real-time note sound generation
- OscillatorNode generates sine waves for each note
- GainNode controls volume and fade-out effects
- Accurate frequency mapping (A4=440Hz standard)
- Supports 13-note range with precise frequency calculations

#### State Management Pattern
The App.jsx uses comprehensive React hooks for state management:
- `useState` for multiple state slices (score, timers, statistics, UI state)
- `useEffect` for side effects (keyboard listeners, timers)
- Complex nested state objects for detailed statistics tracking
- Real-time updates across multiple UI components

#### Music Theory Implementation
- **Note Mapping**: Maps between Western notation (C4, D4, etc.) and solfège (do, re, mi)
- **Staff Rendering**: SVG-based with proper staff line calculations
- **13-Note System**: Covers C4-A5 range (do to la₅)
- **Keyboard Shortcuts**: 13 keys mapped (A-S-D-F-G-H-J-K-L-;-'-Enter-Shift)

### Data Flow Architecture
1. **Random Note Generation**: Algorithm selects from 13-note pool
2. **User Input**: Keyboard shortcuts or piano clicks
3. **Validation**: Compare user input against current note
4. **Statistics Update**: Real-time tracking per note (accuracy, reaction time)
5. **Audio Feedback**: Play selected note and correct answer sounds
6. **UI Updates**: Immediate visual feedback and score updates

### Configuration Files

#### Webpack Configuration (`webpack.config.js`)
- Entry point: `./src/index.jsx`
- Output: Bundle to root directory (unusual pattern - normally dist/)
- Dev server on port 3000
- Babel transpilation for React and ES6+
- CSS processing with PostCSS and Tailwind
- HTML template: `debug.html`

#### Build Process
- Development: Webpack dev server with hot reload
- Production: Webpack builds to `bundle.js` in root directory
- Babel presets: `@babel/preset-react` and `@babel/preset-env`
- CSS processing: style-loader → css-loader → postcss-loader

## Unique Patterns & Considerations

### Large Monolithic App Component
The main App.jsx is ~1200+ lines containing all application logic. When making changes:
- Scroll carefully to find relevant sections
- State is managed through many useState hooks at the top
- Event handlers and business logic are mixed throughout
- Consider component boundaries when refactoring

### Note System Mapping
The application uses a dual notation system:
- **Western notation**: C4, D4, E4, F4, G4, A4, B4, C5, D5, E5, F5, G5, A5
- **Solfège system**: do, re, mi, fa, sol, la, si, do₅, re₅, mi₅, fa₅, sol₅, la₅
- Always maintain consistency between both systems when adding features

### Statistics Data Structure
Complex nested statistics tracking:
- Per-note statistics (correct, total, totalTime)
- Current session vs. cumulative statistics
- Practice records with detailed metadata
- Multiple view modes (card/table, sorting options)

### Timing and Performance
- Reaction time measured in milliseconds
- Real-time statistics updates
- Timer-based practice modes (10/20/30 minutes or custom)
- Careful state management to avoid re-renders

### Audio API Considerations
- Web Audio API requires user interaction to start
- Each note plays for specific duration with fade-out
- Error handling needed for browsers without Web Audio support
- Frequency calculations must remain accurate for musical correctness

## Development Notes

### Adding New Features
1. Most logic should be added to App.jsx unless creating new components
2. Maintain the note mapping consistency (Western ↔ solfège)
3. Update statistics tracking when adding new practice modes
4. Consider audio feedback for new interactive elements

### Styling Approach
- Heavily uses Tailwind CSS utility classes
- Custom gradients and animations throughout
- Responsive design considerations
- Some custom CSS in `src/styles/index.css`

### Package Management
- Uses npm (no lock file indicates npm usage)
- All dependencies in package.json are required for the build process
- No testing framework currently configured