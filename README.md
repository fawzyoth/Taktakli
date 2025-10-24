# TikTok Capture Monitor - Vue 3 Edition

A modern Vue 3 application for monitoring TikTok captures and tracking phone numbers with real-time analytics.

## Tech Stack

- **Vue 3** - Composition API
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **Pinia** - State management
- **Vue Router** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Supabase** - Backend database and authentication
- **Lucide Vue Next** - Beautiful icons

## Features

### Authentication
- Email/password authentication with Supabase
- Protected routes with route guards
- Session management

### Dashboard
- Real-time statistics (active captures, phone numbers, views, comments)
- Recent captures list with metrics
- Quick capture creation

### Capture Monitor
- Live phone number tracking
- Contact status management (8 states)
- Comment viewing and tracking
- Real-time metrics (views, likes, comments)
- Tabbed interface (numbers/chat)

### Pages Management
- Add/edit TikTok pages
- Activate/deactivate pages
- URL validation

### Additional Features
- Dark mode support
- Responsive design
- Modal components with Teleport
- Type-safe API calls

## Project Structure

```
src/
├── assets/          # Global styles
├── components/      # Reusable components
│   ├── AppLayout.vue
│   ├── AppSidebar.vue
│   ├── CommentsModal.vue
│   ├── ContactStatusDropdown.vue
│   └── NewCaptureModal.vue
├── lib/            # Utilities and configs
│   └── supabase.ts
├── router/         # Route definitions
│   └── index.ts
├── stores/         # Pinia stores
│   ├── auth.ts
│   └── theme.ts
├── views/          # Page components
│   ├── CaptureMonitorView.vue
│   ├── DashboardView.vue
│   ├── LoginView.vue
│   └── PagesView.vue
├── App.vue
└── main.ts
```

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Type check
npm run typecheck

# Lint code
npm run lint
```

## Vue 3 Features Used

### Composition API
- `<script setup>` syntax for cleaner component code
- Reactive state with `ref()` and `reactive()`
- Computed properties with `computed()`
- Lifecycle hooks (`onMounted`, `onUnmounted`)

### Component Communication
- Props with TypeScript validation
- Emit events with type safety
- Provide/Inject (via Pinia stores)

### Vue Router
- Lazy-loaded routes
- Route guards for authentication
- Dynamic route parameters

### Pinia State Management
- Auth store for user session
- Theme store for dark mode
- Composable store pattern

### Advanced Features
- Teleport for modals
- Dynamic component rendering
- Watchers for reactive updates
- Custom composables pattern

## Architecture Decisions

### Why Composition API?
- Better TypeScript support
- More flexible code organization
- Easier code reuse with composables
- Better performance

### Why Pinia over Vuex?
- Simpler API
- Better TypeScript inference
- No mutations (direct state modification)
- Modular by design

### Component Design
- Single File Components (.vue)
- Separation of concerns
- Reusable modal components
- Layout wrapper pattern

### State Management
- Local state for component-specific data
- Store state for shared application state
- Props for parent-child communication
- Emits for child-parent events

### Styling Approach
- Tailwind CSS utility classes
- Dark mode with class strategy
- Responsive design with breakpoints
- Consistent color system

## Database Schema

The application uses Supabase with the following tables:
- `captures` - Capture sessions
- `detected_phone_numbers` - Phone numbers with contact status
- `phone_number_comments` - Comments linked to phone numbers
- `pages` - User's TikTok pages

## Environment Variables

Create a `.env` file:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES2020+ support required
- No IE11 support
