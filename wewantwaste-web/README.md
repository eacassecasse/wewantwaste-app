# Skip Hire Page Redesign

## Overview
This document explains the architectural decisions and implementation approach for the skip hire selection page redesign, focusing on maintainability, performance, and user experience.

## Design Goals

1. **Improved User Experience**:
   - Clear visual hierarchy for skip options
   - Responsive design for all devices
   - Intuitive filtering and sorting

2. **Technical Excellence**:
   - Type-safe React components
   - Optimized rendering performance
   - Clean, maintainable code structure

3. **API Resilience**:
   - Graceful handling of incomplete API data
   - Client-side enhancements where API is limited
   - Clear documentation for future API improvements

## Key Decisions

### 1. Component Architecture

```tsx
// Feature-based organization
features/
  skip-selection/
    components/  // Dumb components
    hooks/       // Custom hooks
    types/       // Type definitions
    index.tsx    // Smart parent component
```

**Why**: 
- Isolated feature development
- Clear separation of concerns
- Easier testing and maintenance

### 2. State Management

```tsx
// Using React's built-in state management
const [filterOption, setFilterOption] = useState("all");
const [sortOption, setSortOption] = useState("latest");

// Memoized derived state
const processedSkips = useMemo(() => {
  // Filtering and sorting logic
}, [skips, filterOption, sortOption]);
```

**Why**:
- No external dependencies needed for current complexity
- Optimal performance with memoization
- Clear data flow

### 3. API Data Handling

```tsx
interface SkipProps {
  id: number;
  size: string;
  area: string | null;  // Explicit null handling
  // ...other fields
}

const processApiSkips = (apiSkips: any[]): SkipProps[] => {
  return apiSkips.map(skip => ({
    ...skip,
    size: `${skip.size} Yard`,  // Formatting
    area: skip.area || null,    // Normalization
    img_src: getSkipImage(skip.size) // Client-side enhancement
  }));
};
```

**Why**:
- Type safety with TypeScript interfaces
- Normalization of API data
- Client-side enhancements where API is limited

### 4. Pagination Approach

```tsx
// Client-side pagination
const paginatedSkips = useMemo(() => (
  processedSkips.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )
), [processedSkips, currentPage]);
```

**Why**:
- API doesn't support pagination
- Consistent user experience
- Simple to implement with current data volume

### 5. Image Handling Strategy

```tsx
// Client-side image mapping
const skipImageMap: Record<string, string> = {
  "4 Yard": "/images/skips/4-yard.jpg",
  // ...
};

function getSkipImage(size: string): string {
  return skipImageMap[size] || "/images/skips/default.jpg";
}
```

**Why**:
- API doesn't currently provide images
- Maintain visual appeal while waiting for API updates
- Easy to replace with API-sourced images later

## Recommended API Improvements

1. **Add Image Support**:
```json
{
  "images": {
    "thumbnail": "url",
    "full": "url"
  }
}
```

2. **Pagination Support**:
```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "totalPages": 5
  }
}
```

3. **Better Area Data**:
```json
{
  "area": {
    "name": "Toronto",
    "available": true
  }
}