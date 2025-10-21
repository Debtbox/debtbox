import userEvent from '@testing-library/user-event';

// Create a user event instance with default options
export const user = userEvent.setup({
  // Add any default options here
});

// Helper function to wait for async operations
export const waitFor = async (callback: () => void | Promise<void>, options?: { timeout?: number }) => {
  const { waitFor: rtlWaitFor } = await import('@testing-library/react');
  return rtlWaitFor(callback, options);
};

// Helper function to wait for elements to disappear
export const waitForElementToBeRemoved = async (
  callback: () => HTMLElement | null,
  options?: { timeout?: number }
) => {
  const { waitForElementToBeRemoved: rtlWaitForElementToBeRemoved } = await import('@testing-library/react');
  return rtlWaitForElementToBeRemoved(callback, options);
};
