# Codebase Summary

## Key Components and Their Interactions

### Page Component (app/page.tsx)
- Main entry point
- Handles URL parameters
- Coordinates data flow

### Data Layer (app/utils/excel.ts)
- Excel file reading functionality
- Data transformation
- Error handling

### UI Components
- Header.tsx: Displays bay information
- RotatingIframe.tsx: Handles URL rotation

## Data Flow
1. URL parameters (bay, flightline) → Page Component
2. Page Component → Excel Reader
3. Excel Data → Type Validation
4. Validated Data → UI Components

## External Dependencies
- Excel file reading utilities
- Next.js framework
- TypeScript type system

## Recent Significant Changes
1. Attempted API-based approach (reverted)
2. Restored Excel-based implementation
3. Enhanced type safety
4. Improved error handling

## User Feedback Integration
- Identified searchParams synchronous access issues
- Implemented proper error messages
- Enhanced type safety based on runtime errors

## Current Focus Areas
1. Resolving searchParams errors
2. Optimizing data loading
3. Improving error handling
4. Enhancing type safety
