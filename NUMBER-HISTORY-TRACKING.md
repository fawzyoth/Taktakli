# Number History Tracking System

## Overview

The Number History Tracking System allows you to see when and where phone numbers have appeared across different live capture sessions. This helps identify repeat leads, track engagement patterns, and optimize contact strategies.

## Features

### 1. **Session Appearance Counter**
- Shows how many other sessions a phone number has appeared in
- Displays prominently on each phone number card
- Only appears when the number has been seen before

### 2. **Detailed History Modal**
- Opens with a single click on the "History" button
- Shows chronological list of all sessions where the number appeared
- Displays session details including:
  - Session name and status (Active/Stopped)
  - Detection date and time
  - Session metrics (views, likes, comments)
  - Contact status at that time
  - Session ID for reference

### 3. **Quick Navigation**
- Jump directly to active sessions from the history modal
- "View Live Session" button for ongoing captures

## User Interface

### Main Display Component

When viewing a phone number in a live capture session:

```
┌─────────────────────────────────────────────────────┐
│ Sarah Miller | NEW                                   │
│ +1 (555) 123-4567                                   │
│ Detected: Dec 6, 2024, 3:30 PM                      │
│                                                      │
│ [✓ 2×] [📞 2×] [↗ 80%]  <- Call History Badges     │
│                                                      │
│ ┌─────────────────────────────────────────────┐    │
│ │ 🕐 Previously Seen                [History] │    │
│ │ Appeared in 2 other sessions                │    │
│ └─────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────┘
```

### History Modal Layout

```
┌───────────────────────────────────────────────────────┐
│ Number History                                    [X] │
│ 📞 +1 (555) 123-4567                                 │
│ Sarah Miller                                          │
│                                                       │
│ 🕐 Appeared in 3 sessions                            │
├───────────────────────────────────────────────────────┤
│                                                       │
│ Session History                                       │
│ Chronological list of when this number was detected  │
│                                                       │
│ ┌─────────────────────────────────────────────────┐ │
│ │ 🎥 Cooking Channel              [Active]        │ │
│ │ Dec 6, 2024 • 12:30 PM                          │ │
│ │ Contact Status: Not Called                      │ │
│ │ Session ID: 3                                   │ │
│ │                                                 │ │
│ │ 👁 12,450  ❤ 892  💬 234                       │ │
│ │                                                 │ │
│ │ [View Live Session]                            │ │
│ └─────────────────────────────────────────────────┘ │
│                                                       │
│ ┌─────────────────────────────────────────────────┐ │
│ │ 🎥 Tech Reviews                 [Stopped]       │ │
│ │ Dec 5, 2024 • 4:00 PM                          │ │
│ │ Contact Status: Confirmed                       │ │
│ │ Session ID: 2                                   │ │
│ │                                                 │ │
│ │ 👁 28,540  ❤ 1,832  💬 423                     │ │
│ └─────────────────────────────────────────────────┘ │
│                                                       │
│ ┌─────────────────────────────────────────────────┐ │
│ │ 🎥 Fashion Trends               [Stopped]       │ │
│ │ Dec 5, 2024 • 8:30 AM                          │ │
│ │ Contact Status: Confirmed                       │ │
│ │ Session ID: 1                                   │ │
│ │                                                 │ │
│ │ 👁 45,230  ❤ 3,421  💬 856                     │ │
│ └─────────────────────────────────────────────────┘ │
├───────────────────────────────────────────────────────┤
│                    [Close]                            │
└───────────────────────────────────────────────────────┘
```

## Technical Implementation

### Database Schema

The system leverages the existing `detected_phone_numbers` table structure:

```typescript
interface DetectedPhoneNumber {
  id: string
  capture_id: string          // Links to specific session
  phone_number: string        // The actual phone number
  username: string | null
  detected_at: string         // When it was detected
  contact_status: ContactStatus
  // ... other fields
}
```

### Data Structure for History Tracking

```typescript
interface SessionHistory {
  totalSessions: number
  sessions: Array<{
    capture: Capture           // Full capture/session details
    detectedAt: string        // When detected in this session
    username: string | null   // Username at detection
    contactStatus: ContactStatus // Status in this session
  }>
}
```

### Key Functions

#### 1. Get Session History
```typescript
mockDataService.getNumberSessionHistory(phoneNumber: string)
```
Returns complete history of all sessions where the number appeared.

**Performance:** O(n) where n is total phone numbers across all sessions
**Cache Strategy:** Results cached per phone number for 5 minutes

#### 2. Get Appearance Count
```typescript
mockDataService.getNumberAppearanceCount(
  phoneNumber: string,
  excludeCaptureId?: string
)
```
Returns count of unique sessions excluding the current one.

**Performance:** O(n) with Set deduplication
**Use Case:** Display the "Seen in X sessions" counter

### Component Architecture

```
CaptureMonitorView
├── NumberHistoryModal (Lazy loaded)
│   ├── Session List
│   │   ├── Session Card (repeating)
│   │   │   ├── Session Info
│   │   │   ├── Metrics
│   │   │   └── Navigation Button
│   └── Close Button
└── Phone Number Card
    ├── Call History Badges
    ├── Previously Seen Alert
    │   └── History Button
    └── Contact Status Dropdown
```

## Usage Examples

### Example 1: Identifying High-Value Repeat Leads

```
Sarah Miller has appeared in 3 sessions:
- Cooking Channel (Current) - Just detected
- Tech Reviews - Confirmed contact
- Fashion Trends - Confirmed contact

Analysis: This is a highly engaged lead with 100%
confirmation rate across previous sessions.
Priority: HIGH
```

### Example 2: Avoiding Contact Fatigue

```
Lisa Anderson has appeared in 2 sessions:
- Cooking Channel (Current) - Just detected
- Fashion Trends - Declined 3 times

Analysis: This lead has consistently declined contact.
Recommend: Skip or try different approach
Priority: LOW
```

### Example 3: Fresh Opportunity

```
John Smith - No previous sessions
(No history badge shown)

Analysis: Brand new lead, no prior contact history
Priority: MEDIUM - Standard processing
```

## Performance Considerations

### Optimizations Implemented

1. **Parallel Data Loading**
   - Call history and session count load simultaneously
   - Uses Promise.all() for optimal performance

2. **Lazy Modal Loading**
   - History modal only fetches data when opened
   - Reduces initial page load time

3. **Efficient Filtering**
   - Set-based deduplication for unique session counts
   - Sorted chronologically (most recent first)

4. **Mock Data Performance**
   - Simulated network delays (100-300ms)
   - Realistic production behavior

### Scalability

For production with Supabase:

```sql
-- Efficient query for session history
SELECT
  dpn.*,
  c.page_name,
  c.status,
  c.total_views,
  c.total_likes,
  c.total_comments
FROM detected_phone_numbers dpn
JOIN captures c ON dpn.capture_id = c.id
WHERE dpn.phone_number = $1
ORDER BY dpn.detected_at DESC;

-- Add index for performance
CREATE INDEX idx_phone_number
ON detected_phone_numbers(phone_number);
```

## Privacy Considerations

### Data Retention
- History tracked indefinitely by default
- Consider implementing retention policies:
  - Archive sessions older than 90 days
  - Delete declined contacts after 30 days
  - Anonymize data for analytics

### Access Control
- History visible to all users with session access
- Consider role-based restrictions:
  - Managers: Full history access
  - Agents: Current session only
  - Auditors: Read-only historical view

### Compliance
- GDPR Right to Erasure: Implement phone number deletion across all sessions
- Data Minimization: Only store necessary fields
- Audit Trail: Log who accessed history and when

## Integration Points

### Current Integrations
✅ CaptureMonitorView - Main live session view
✅ Call History System - Combined with call tracking badges
✅ Contact Status Tracking - Shows status in each session

### Future Integration Opportunities
- **NumbersView**: Add history access from the global numbers list
- **DashboardView**: Show "Repeat Leads" metric on dashboard
- **Analytics**: Track conversion rates for repeat vs new numbers
- **Alerts**: Notify when high-value repeat lead appears
- **Export**: Include history data in CSV/PDF reports

## Testing Scenarios

### Test Data Included

1. **Sarah Miller (+1 555-123-4567)**
   - Appears in 3 sessions
   - Tests multi-session display
   - Tests navigation between sessions

2. **Mike Johnson (+1 555-987-6543)**
   - Appears in 2 sessions
   - Tests different contact statuses

3. **Lisa Anderson (+1 555-876-5432)**
   - Appears in 2 sessions with declines
   - Tests negative pattern recognition

4. **John Smith (+1 555-234-5678)**
   - Single session only
   - Tests new lead behavior (no badge shown)

### Manual Testing Checklist

- [ ] Counter shows correct session count
- [ ] History button opens modal
- [ ] Modal shows all sessions chronologically
- [ ] Session details are accurate
- [ ] Navigation to active session works
- [ ] Modal closes properly
- [ ] No badge shown for first-time numbers
- [ ] Performance is acceptable (< 1s load time)
- [ ] Dark mode displays correctly
- [ ] Mobile responsive layout works

## Troubleshooting

### Issue: Counter shows 0 for repeated numbers
**Cause:** excludeCaptureId not working correctly
**Solution:** Verify capture.value!.id is being passed

### Issue: Modal shows "No Previous Sessions"
**Cause:** Phone number format mismatch
**Solution:** Ensure exact string match including formatting

### Issue: Navigation button doesn't work
**Cause:** Router not properly initialized
**Solution:** Check Vue Router setup in component

### Issue: Slow loading
**Cause:** Too many parallel requests
**Solution:** Implement request batching or caching

## Future Enhancements

### Planned Features
1. **Timeline View**: Visual timeline of number appearances
2. **Pattern Analysis**: AI-suggested actions based on history
3. **Bulk Actions**: Process all repeat leads at once
4. **Export History**: Download history as PDF/CSV
5. **Comparison View**: Side-by-side session comparison
6. **Notes System**: Add notes to specific session appearances

### Performance Improvements
1. Implement Redis caching for frequent queries
2. GraphQL subscriptions for real-time updates
3. Virtual scrolling for large history lists
4. Progressive loading for old sessions

## Conclusion

The Number History Tracking System provides crucial context for lead management by showing when and where phone numbers have appeared across sessions. This enables data-driven decisions about contact priority, helps avoid fatigue, and identifies high-value repeat leads.

The system is designed for performance, scalability, and user experience, with clear privacy considerations and room for future enhancements.
