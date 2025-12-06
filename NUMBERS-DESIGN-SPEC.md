# Phone Numbers List Interface - Design Specification

## Overview
A clean, modern interface for displaying phone numbers with session tracking, usage statistics, and visual indicators for engagement levels.

---

## Layout Structure

### Grid System
- **Desktop (lg+)**: 2-column grid with 1.5rem gap
- **Tablet (md)**: 1-column grid
- **Mobile**: 1-column grid with reduced padding

### Card Structure
```
┌─────────────────────────────────────────────────────┐
│  [Avatar]  [Name + Session Badge]         [Arrow]   │
│            [Phone Number]                            │
│            [Usage Stats Row]                         │
│            [Status + First Seen]                     │
└─────────────────────────────────────────────────────┘
```

---

## Typography

### Hierarchy
- **Name**: 1.125rem (18px), font-weight: 700
- **Phone Number**: 0.875rem (14px), font-weight: 600, monospace
- **Statistics**: 0.75rem (12px), font-weight: 600
- **Metadata**: 0.75rem (12px), font-weight: 400

### Font Families
- **Body**: System font stack (default)
- **Phone Numbers**: Monospace font for readability
- **Icons**: Lucide Icons library

---

## Color Scheme

### Background Colors
- **Card Background (Light)**: White (#FFFFFF)
- **Card Background (Dark)**: Gray-900 (#111827)
- **Hover State**: Subtle shadow elevation

### Text Colors
- **Primary Text (Light)**: Gray-900 (#111827)
- **Primary Text (Dark)**: White (#FFFFFF)
- **Secondary Text (Light)**: Gray-600 (#4B5563)
- **Secondary Text (Dark)**: Gray-400 (#9CA3AF)

### Status Colors
- **Not Called**: Gray (#6B7280)
- **No Answer**: Yellow (#EAB308)
- **Called**: Blue (#3B82F6)
- **Confirmed**: Green (#22C55E)
- **Declined**: Red (#EF4444)
- **Callback**: Purple (#A855F7)
- **Invalid**: Orange (#F97316)
- **Completed**: Emerald (#10B981)

### Session Indicator Colors
- **Single Session**: Gray-100/Gray-800 background
- **Multiple Sessions (2-3)**: Blue-50/Blue-900 background with Blue-600/Blue-400 text
- **High Activity (4+)**: Emerald-50/Emerald-900 background with Emerald-600/Emerald-400 text

---

## Visual Indicators

### Session Badge
- **Position**: Next to username in header
- **Shape**: Rounded pill (border-radius: 9999px)
- **Padding**: 0.25rem horizontal, 0.125rem vertical
- **Content**: "{count} session(s)"

**Visual States:**
- 1 session: Subtle gray badge
- 2-3 sessions: Blue badge with medium emphasis
- 4+ sessions: Emerald badge with strong emphasis, pulsing animation

### Avatar
- **Size**: 4rem × 4rem (64px × 64px)
- **Shape**: Rounded-2xl (border-radius: 1rem)
- **Background**: Gradient from gray-700 to gray-900
- **Content**: First letter of username or phone emoji
- **Status Indicator**: 1.5rem × 1.5rem dot at bottom-right
  - Position: absolute, -0.5rem bottom and right
  - Border: 3px solid white/gray-900

### Usage Statistics Row
Display today's and weekly submission counts in a horizontal layout:

```
[Calendar Icon] Today: {n} | [Clock Icon] This week: {n}
```

- **Icons**: 0.875rem (14px) size
- **Text**: 0.75rem (12px), font-weight: 600
- **Color**:
  - Low activity (0-2): Gray
  - Medium activity (3-5): Blue
  - High activity (6+): Emerald
- **Separator**: Vertical bar with subtle color

---

## Spacing & Dimensions

### Card Padding
- **Desktop**: 1.5rem (24px)
- **Mobile**: 1rem (16px)

### Internal Spacing
- **Avatar to Content**: 1rem (16px)
- **Between Rows**: 0.75rem (12px)
- **Between Stats Items**: 1rem (16px)

### Border Radius
- **Cards**: 1rem (16px)
- **Avatar**: 1rem (16px)
- **Badges**: 9999px (full rounded)
- **Status Dots**: 50% (circle)

---

## Interactive States

### Hover
- **Transform**: Subtle scale or translate
- **Shadow**: Elevated shadow (0 10px 25px rgba(0,0,0,0.1))
- **Border**: Change from gray-200 to gray-400
- **Cursor**: Pointer
- **Transition**: 200ms ease-in-out

### Focus
- **Outline**: 2px solid focus ring color
- **Offset**: 2px

### Active
- **Transform**: Scale down slightly (0.98)
- **Shadow**: Reduced shadow

---

## Responsive Breakpoints

### Mobile (< 640px)
- Single column layout
- Reduced padding (1rem)
- Smaller avatar (3.5rem)
- Stacked statistics if needed
- Full-width search bar

### Tablet (640px - 1024px)
- Single column layout
- Standard padding (1.5rem)
- Standard avatar size
- Horizontal statistics layout

### Desktop (> 1024px)
- Two-column grid
- Standard padding (1.5rem)
- Standard avatar size
- All features visible

---

## Accessibility

### ARIA Labels
- Cards: `aria-label="Phone number {number}, {name}, {session count} sessions"`
- Status indicators: `aria-label="Status: {status}"`
- Usage stats: `aria-label="{count} submissions today, {count} this week"`

### Keyboard Navigation
- Tab order: Search → Cards (top to bottom, left to right)
- Enter/Space: Open detail modal
- Escape: Close modal

### Screen Reader Support
- Meaningful button labels
- Status announcements
- Live region for dynamic updates

### Color Contrast
- Text: Minimum 4.5:1 contrast ratio
- Interactive elements: Minimum 3:1 contrast ratio
- Focus indicators: High contrast, clearly visible

---

## Animations

### Card Entry
- Fade in with stagger effect
- Duration: 300ms
- Easing: ease-out

### Session Badge Pulse (4+ sessions)
- Subtle scale pulse animation
- Duration: 2s infinite
- Scale: 1 to 1.05

### Hover Transition
- Duration: 200ms
- Easing: ease-in-out
- Properties: transform, shadow, border-color

---

## Edge Cases

### Long Names
- Truncate with ellipsis
- Show full name in tooltip on hover

### Long Phone Numbers
- Use monospace font for alignment
- Ensure adequate width on mobile

### No Data States
- Empty state with icon
- Clear call-to-action message
- Centered layout

### Loading State
- Spinner with gray-600 color
- Centered vertically and horizontally
- Minimum height to prevent layout shift

---

## Performance Considerations

### Optimization
- Virtual scrolling for large lists (100+ items)
- Lazy load detail modal content
- Debounced search input (300ms)
- Memoized computed properties

### Bundle Size
- Tree-shake unused icons
- Optimize images/avatars
- Code-split detail modal

---

## Example Data Scenarios

### Single Session User
```json
{
  "phone_number": "+1 (555) 123-4567",
  "username": "john_doe",
  "sessionCount": 1,
  "todaySubmissions": 1,
  "weekSubmissions": 1,
  "contact_status": "not_called",
  "detected_at": "2024-01-15T10:30:00Z"
}
```

### Multiple Sessions User (High Activity)
```json
{
  "phone_number": "+1 (555) 987-6543",
  "username": "sarah_miller",
  "sessionCount": 5,
  "todaySubmissions": 3,
  "weekSubmissions": 8,
  "contact_status": "confirmed",
  "detected_at": "2024-01-10T08:15:00Z"
}
```

### Anonymous User
```json
{
  "phone_number": "+1 (555) 456-7890",
  "username": null,
  "sessionCount": 2,
  "todaySubmissions": 1,
  "weekSubmissions": 2,
  "contact_status": "called_no_answer",
  "detected_at": "2024-01-14T16:45:00Z"
}
```
