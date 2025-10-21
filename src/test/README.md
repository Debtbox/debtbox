# Testing Guide

This directory contains all testing utilities, mocks, and fixtures for the Debtbox application.

## Structure

```
src/test/
├── setup.ts                 # Global test setup and configuration
├── index.ts                 # Main exports for test utilities
├── utils/                   # Testing utilities and helpers
│   ├── test-utils.tsx       # Custom render functions with providers
│   ├── user-event.ts        # User event utilities
│   ├── mock-functions.ts    # Mock functions for common APIs
│   └── test-helpers.ts      # Helper functions for common test operations
├── mocks/                   # MSW (Mock Service Worker) configuration
│   ├── server.ts            # MSW server setup for Node.js
│   ├── browser.ts           # MSW worker setup for browser
│   ├── handlers.ts          # API request handlers
│   └── utils.ts             # Mock utilities and helpers
└── fixtures/                # Test data and fixtures
    ├── user.ts              # User-related test data
    ├── transactions.ts      # Transaction-related test data
    ├── notifications.ts     # Notification-related test data
    └── index.ts             # Fixture exports
```

## Getting Started

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests once (CI mode)
pnpm test:run

# Run tests with coverage
pnpm test:coverage

# Run tests with UI
pnpm test:ui

# Run tests for CI
pnpm test:ci
```

### Writing Component Tests

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen, user } from '@/test';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('handles user interaction', async () => {
    render(<MyComponent />);
    const button = screen.getByRole('button');
    await user.click(button);
    expect(screen.getByText('Clicked!')).toBeInTheDocument();
  });
});
```

### Writing Integration Tests

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@/test';
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';
import MyPage from './MyPage';

describe('MyPage Integration', () => {
  it('loads data from API', async () => {
    server.use(
      http.get('/api/data', () => {
        return HttpResponse.json({ data: 'test' });
      })
    );

    render(<MyPage />);
    
    await waitFor(() => {
      expect(screen.getByText('test')).toBeInTheDocument();
    });
  });
});
```

### Writing API Tests

```tsx
import { describe, it, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useMyApi } from './useMyApi';
import { mockData } from '@/test/fixtures';

describe('useMyApi', () => {
  it('fetches data successfully', async () => {
    const { result } = renderHook(() => useMyApi());
    
    result.current.mutate();
    
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    
    expect(result.current.data).toEqual(mockData);
  });
});
```

## Testing Utilities

### Custom Render Function

The `render` function from `@/test` includes all necessary providers:

- React Query
- React Router
- i18next
- MSW

### User Event

```tsx
import { user } from '@/test';

// Click an element
await user.click(screen.getByRole('button'));

// Type in an input
await user.type(screen.getByRole('textbox'), 'Hello World');

// Clear and type
await user.clear(screen.getByRole('textbox'));
await user.type(screen.getByRole('textbox'), 'New text');
```

### Mock Functions

```tsx
import { mockLocalStorage, mockFetch, mockAxios } from '@/test';

// Mock localStorage
const localStorage = mockLocalStorage();

// Mock fetch
const mockFetchResponse = mockFetch({ data: 'test' });

// Mock axios
mockAxios.get.mockResolvedValue({ data: 'test' });
```

### Test Helpers

```tsx
import { 
  findByTestId, 
  waitForText, 
  clickElement,
  typeInElement 
} from '@/test';

// Find by test ID
const element = await findByTestId('my-element');

// Wait for text to appear
await waitForText('Loading complete');

// Click element
await clickElement(screen.getByRole('button'));

// Type in element
await typeInElement(screen.getByRole('textbox'), 'Hello');
```

## MSW (Mock Service Worker)

MSW is configured to intercept API requests during testing. Handlers are defined in `src/test/mocks/handlers.ts`.

### Adding New API Handlers

```tsx
// In src/test/mocks/handlers.ts
export const handlers = [
  // ... existing handlers
  http.get('/api/new-endpoint', () => {
    return HttpResponse.json({
      success: true,
      data: { message: 'Hello' }
    });
  }),
];
```

### Overriding Handlers in Tests

```tsx
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';

it('handles error response', async () => {
  server.use(
    http.get('/api/data', () => {
      return HttpResponse.json(
        { error: 'Not found' },
        { status: 404 }
      );
    })
  );

  // Your test code here
});
```

## Test Fixtures

Fixtures provide consistent test data across tests:

```tsx
import { mockUser, mockTransactions } from '@/test/fixtures';

// Use in tests
const user = mockUser;
const transactions = mockTransactions;
```

## Best Practices

1. **Use descriptive test names** that explain what is being tested
2. **Test user behavior**, not implementation details
3. **Use data-testid sparingly** - prefer accessible queries
4. **Mock external dependencies** using MSW for API calls
5. **Keep tests focused** - one concept per test
6. **Use fixtures** for consistent test data
7. **Test error states** and edge cases
8. **Use async/await** for asynchronous operations
9. **Clean up** after tests using `afterEach` when needed
10. **Write integration tests** for critical user flows

## Coverage

The project is configured to maintain 80% code coverage across:
- Branches
- Functions  
- Lines
- Statements

Run `pnpm test:coverage` to see current coverage and identify areas that need more tests.
